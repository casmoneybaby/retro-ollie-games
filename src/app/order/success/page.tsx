import Link from "next/link";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { completeOrder } from "@/lib/order-lifecycle";
import { OrderStatus } from "@/generated/prisma/enums";
import { formatPrice } from "@/lib/utils";
import { ClearCartOnMount } from "@/components/clear-cart-on-mount";

export const dynamic = "force-dynamic";

export const metadata = { title: "Purchase Complete" };

/**
 * Success landing after Stripe Checkout. Stripe's webhook is the authority;
 * this page only performs a guarded fallback completion if the webhook hasn't
 * landed yet, so the customer never waits on a stale "processing" screen.
 */
export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId } = await searchParams;

  let order = sessionId
    ? await db.order.findFirst({
        where: { stripeSessionId: sessionId },
        include: { items: true },
      })
    : null;

  // Fallback: if webhook hasn't processed yet, verify with Stripe and complete.
  if (order && order.status === OrderStatus.PENDING && sessionId && isStripeConfigured()) {
    const stripe = getStripe()!;
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      if (session.payment_status === "paid" || session.payment_status === "no_payment_required") {
        await completeOrder({
          orderId: order.id,
          email: session.customer_details?.email ?? null,
          name: session.customer_details?.name ?? null,
          paymentIntentId:
            typeof session.payment_intent === "string" ? session.payment_intent : null,
          address: session.customer_details?.address
            ? {
                line1: session.customer_details.address.line1,
                line2: session.customer_details.address.line2,
                city: session.customer_details.address.city,
                state: session.customer_details.address.state,
                postalCode: session.customer_details.address.postal_code,
                country: session.customer_details.address.country,
              }
            : null,
        });
        order = await db.order.findFirst({
          where: { stripeSessionId: sessionId },
          include: { items: true },
        });
      }
    } catch (err) {
      console.error("success-page stripe verify failed", err);
    }
  }

  const paid = order && order.status !== OrderStatus.PENDING && order.status !== OrderStatus.CANCELLED;

  return (
    <main className="mx-auto max-w-2xl px-4 py-20">
      <ClearCartOnMount />
      {paid && order ? (
        <>
          <div className="text-center">
            <p className="pixel-tag text-[10px] text-phosphor">PURCHASE COMPLETE</p>
            <h1 className="pixel-tag mt-4 text-2xl leading-relaxed text-phosphor sm:text-3xl">
              NEW ITEM ACQUIRED
            </h1>
            <p className="mt-4 text-sm text-mist">
              Order <span className="font-mono font-bold text-bone">{order.number}</span> is
              confirmed and paid. A receipt is on its way to{" "}
              <span className="text-bone">{order.email}</span>.
            </p>
          </div>

          <div className="mt-10 rounded-surface border border-line bg-panel">
            <div className="border-b border-line px-5 py-4">
              <h2 className="pixel-tag text-[9px] text-phosphor">YOUR HAUL</h2>
            </div>
            <ul className="divide-y divide-line">
              {order.items.map((item) => (
                <li key={item.id} className="flex items-center justify-between gap-4 px-5 py-4">
                  <div>
                    <p className="text-sm font-bold">{item.nameSnapshot}</p>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-mist">
                      {item.platformNameSnapshot ?? "ROG"} · UNIT {item.inventoryIdSnapshot}
                    </p>
                  </div>
                  <p className="font-mono text-sm font-bold">
                    {formatPrice(item.unitPriceCents)}
                  </p>
                </li>
              ))}
            </ul>
            <dl className="space-y-1.5 border-t border-line px-5 py-4 font-mono text-xs">
              <div className="flex justify-between">
                <dt className="text-mist">Subtotal</dt>
                <dd>{formatPrice(order.subtotalCents)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-mist">Shipping</dt>
                <dd>{order.shippingCents === 0 ? "FREE" : formatPrice(order.shippingCents)}</dd>
              </div>
              <div className="flex justify-between border-t border-line pt-2 text-sm font-bold">
                <dt>Total paid</dt>
                <dd className="text-phosphor">{formatPrice(order.totalCents)}</dd>
              </div>
            </dl>
          </div>

          <div className="mt-8 rounded-surface border border-line bg-panel p-5">
            <h2 className="pixel-tag text-[9px] text-phosphor">WHAT HAPPENS NEXT</h2>
            <ol className="mt-3 space-y-2 font-mono text-xs text-mist">
              <li><span className="text-phosphor">01</span> Your unit gets final QC and a fresh photo set</li>
              <li><span className="text-phosphor">02</span> Packed with care and shipped tracked (3–5 business days)</li>
              <li><span className="text-phosphor">03</span> Tracking number lands in your inbox</li>
            </ol>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/order"
              className="font-mono text-[11px] uppercase tracking-widest text-mist hover:text-phosphor"
            >
              Save your order number for lookup →
            </Link>
          </div>
        </>
      ) : order && order.status === OrderStatus.CANCELLED ? (
        <div className="text-center">
          <h1 className="pixel-tag text-xl text-amber">ORDER CANCELED</h1>
          <p className="mx-auto mt-4 max-w-sm text-sm text-mist">
            This checkout was canceled and the unit was returned to the shelf. If you were
            charged in error, email us and we&apos;ll make it right.
          </p>
          <Link
            href="/shop"
            className="pixel-tag mt-8 inline-flex h-12 items-center rounded-sm bg-phosphor px-6 text-[10px] text-ink"
          >
            ▶ BACK TO THE SHOP
          </Link>
        </div>
      ) : (
        <div className="text-center">
          <h1 className="pixel-tag text-lg text-bone">FINALIZING PAYMENT…</h1>
          <p className="mx-auto mt-4 max-w-sm text-sm text-mist">
            We&apos;re waiting on Stripe&apos;s confirmation. This page updates once payment
            clears — usually seconds. Don&apos;t close the tab.
          </p>
        </div>
      )}
    </main>
  );
}
