import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { ProductStatus } from "@/generated/prisma/enums";

export const runtime = "nodejs";

const bodySchema = z.object({
  slugs: z.array(z.string().min(1).max(200)).min(1).max(20),
});

const FREE_SHIPPING_THRESHOLD_CENTS = 30000;
const FLAT_SHIPPING_CENTS = 1499;

function shippingFor(subtotalCents: number): number {
  return subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS ? 0 : FLAT_SHIPPING_CENTS;
}

export async function POST(req: NextRequest) {
  if (!isStripeConfigured()) {
    return NextResponse.json({ error: "payments_unavailable" }, { status: 503 });
  }
  const stripe = getStripe()!;

  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
  const slugs = [...new Set(parsed.data.slugs)];

  // Authoritative pricing always comes from the database — never the browser.
  const products = await db.product.findMany({
    where: { slug: { in: slugs }, status: ProductStatus.AVAILABLE },
    include: { platform: true, images: { orderBy: { sort: "asc" }, take: 1 } },
  });

  if (products.length === 0) {
    return NextResponse.json({ error: "sold_out", soldOut: slugs }, { status: 409 });
  }
  const missing = slugs.filter((s) => !products.some((p) => p.slug === s));
  if (missing.length > 0) {
    return NextResponse.json({ error: "sold_out", soldOut: missing }, { status: 409 });
  }

  const subtotalCents = products.reduce((s, p) => s + p.priceCents, 0);
  const shippingCents = shippingFor(subtotalCents);
  const totalCents = subtotalCents + shippingCents;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  try {
    const result = await db.$transaction(async (tx) => {
      const orderNumber = `ROG-${Date.now().toString(36).toUpperCase()}${Math.floor(Math.random() * 90 + 10)}`;

      const order = await tx.order.create({
        data: {
          number: orderNumber,
          email: "pending@checkout", // replaced by webhook from Stripe (authoritative)
          subtotalCents,
          shippingCents,
          totalCents,
          status: "PENDING" as const,
          items: {
            create: products.map((p) => ({
              productId: p.id,
              nameSnapshot: p.name,
              inventoryIdSnapshot: p.inventoryId,
              unitPriceCents: p.priceCents,
              quantity: 1,
              platformNameSnapshot: p.platform.name,
            })),
          },
        },
      });

      // Atomic one-of-one protection: decrement only while stock exists.
      for (const p of products) {
        const updated = await tx.product.updateMany({
          where: { id: p.id, status: ProductStatus.AVAILABLE, quantity: { gte: 1 } },
          data: { quantity: { decrement: 1 } },
        });
        if (updated.count === 0) {
          throw new Error(`SOLD_OUT:${p.slug}`);
        }
        if (p.quantity - 1 <= 0) {
          await tx.product.updateMany({
            where: { id: p.id },
            data: { status: ProductStatus.RESERVED },
          });
        }
      }

      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: products.map((p) => ({
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: p.priceCents,
            product_data: {
              name: p.name,
              description: `Restored & tested · Unit ${p.inventoryId}`,
              // Stripe only accepts absolute https image URLs.
              ...(p.images[0]?.url.startsWith("http")
                ? { images: [p.images[0].url] }
                : {}),
            },
          },
        })),
        shipping_options: [
          {
            shipping_rate_data: {
              type: "fixed_amount",
              fixed_amount: { amount: shippingCents, currency: "usd" },
              display_name:
                shippingCents === 0
                  ? "Free shipping"
                  : "Tracked shipping (3–5 business days)",
            },
          },
        ],
        metadata: { orderId: order.id, orderNumber: order.number },
        payment_intent_data: {
          description: `Retro Ollie Games ${order.number}`,
          metadata: { orderId: order.id, orderNumber: order.number },
        },
        success_url: `${siteUrl}/order/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${siteUrl}/cart?canceled=1&session_id={CHECKOUT_SESSION_ID}`,
      });

      await tx.order.update({
        where: { id: order.id },
        data: { stripeSessionId: session.id },
      });

      return { orderNumber: order.number, url: session.url };
    });

    return NextResponse.json({ url: result.url, orderNumber: result.orderNumber });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "";
    if (msg.startsWith("SOLD_OUT:")) {
      return NextResponse.json(
        { error: "sold_out", soldOut: [msg.slice("SOLD_OUT:".length)] },
        { status: 409 }
      );
    }
    console.error("checkout failed", err);
    return NextResponse.json({ error: "checkout_failed" }, { status: 500 });
  }
}
