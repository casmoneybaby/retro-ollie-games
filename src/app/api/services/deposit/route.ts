import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getStripe, isStripeConfigured } from "@/lib/stripe";

export const runtime = "nodejs";

const schema = z.object({
  jobNumber: z.string().min(5).max(40),
  email: z.string().email().max(200),
});

/** Create a Stripe Checkout session for a service deposit. */
export async function POST(req: NextRequest) {
  if (!isStripeConfigured()) {
    return NextResponse.json({ error: "payments_unavailable" }, { status: 503 });
  }
  const stripe = getStripe()!;

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const request = await db.serviceRequest.findFirst({
    where: {
      jobNumber: parsed.data.jobNumber.trim().toUpperCase(),
      email: parsed.data.email.toLowerCase(),
    },
  });

  if (!request) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  if (request.depositPaidAt) {
    return NextResponse.json({ error: "already_paid" }, { status: 409 });
  }
  if (request.depositCents <= 0) {
    return NextResponse.json({ error: "no_deposit_required" }, { status: 409 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: request.email,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: request.depositCents,
            product_data: {
              name: `Respawn deposit — ${request.jobNumber}`,
              description: `${request.deviceFamily} refurbishment deposit. Applied to your final invoice.`,
            },
          },
        },
      ],
      metadata: {
        kind: "service_deposit",
        serviceRequestId: request.id,
        jobNumber: request.jobNumber,
      },
      success_url: `${siteUrl}/respawn-log?paid=1`,
      cancel_url: `${siteUrl}/respawn-log?canceled=1`,
    });

    await db.serviceRequest.update({
      where: { id: request.id },
      data: { stripeDepositSessionId: session.id },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("service deposit checkout failed", err);
    return NextResponse.json({ error: "checkout_failed" }, { status: 500 });
  }
}
