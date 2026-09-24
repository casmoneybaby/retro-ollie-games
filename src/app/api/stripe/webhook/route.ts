import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { db } from "@/lib/db";
import { getStripe } from "@/lib/stripe";
import { completeOrder, releaseOrder } from "@/lib/order-lifecycle";
import { logAudit } from "@/lib/audit";

export const runtime = "nodejs";

/**
 * Stripe webhook — the authoritative payment source. The browser is never
 * trusted for payment confirmation. Signature is verified server-side and
 * processing is idempotent (status-guarded transitions in order-lifecycle).
 */
export async function POST(req: NextRequest) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) {
    return NextResponse.json({ error: "webhook_unconfigured" }, { status: 503 });
  }

  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "missing_signature" }, { status: 400 });
  }

  const raw = await req.text(); // must be the raw body for signature verification
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, secret);
  } catch (err) {
    console.error("webhook signature verification failed", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "invalid_signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;

        // Service deposit flow
        if (session.metadata?.kind === "service_deposit") {
          const serviceRequestId = session.metadata.serviceRequestId;
          if (serviceRequestId) {
            await db.serviceRequest.update({
              where: { id: serviceRequestId },
              data: { depositPaidAt: new Date() },
            });
            await logAudit(
              "service.deposit.paid",
              `${session.metadata.jobNumber} pi=${typeof session.payment_intent === "string" ? session.payment_intent : "n/a"}`
            );
          }
          break;
        }

        const orderId = session.metadata?.orderId;
        if (!orderId) break;

        const email =
          session.customer_details?.email ?? session.customer_email ?? null;
        const name = session.customer_details?.name ?? null;

        const address = session.customer_details?.address
          ? {
              line1: session.customer_details.address.line1,
              line2: session.customer_details.address.line2,
              city: session.customer_details.address.city,
              state: session.customer_details.address.state,
              postalCode: session.customer_details.address.postal_code,
              country: session.customer_details.address.country,
            }
          : null;

        await completeOrder({
          orderId,
          email,
          name,
          paymentIntentId:
            typeof session.payment_intent === "string" ? session.payment_intent : null,
          address,
        });
        break;
      }

      case "checkout.session.async_payment_failed": {
        const session = event.data.object;
        const orderId = session.metadata?.orderId;
        if (orderId) await releaseOrder(orderId);
        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object;
        const orderId = session.metadata?.orderId;
        if (orderId) await releaseOrder(orderId);
        break;
      }

      case "charge.refunded": {
        // Refunds are handled from the admin dashboard (markOrderRefunded).
        // Inventory is NOT auto-restocked: the owner decides after the item
        // physically returns and is inspected.
        break;
      }

      default:
        break;
    }
  } catch (err) {
    console.error(`webhook handler error (${event.type})`, err);
    return NextResponse.json({ error: "handler_error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
