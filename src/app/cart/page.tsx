"use client";

import Link from "next/link";
import { useState, useSyncExternalStore, useTransition } from "react";
import { removeItem } from "@/lib/cart";
import { useCart } from "@/lib/use-cart";
import { formatPrice } from "@/lib/utils";

type CheckoutError = "sold_out" | "generic" | null;

const subscribeToLocation = () => () => {};

function getCheckoutError(): CheckoutError {
  const error = new URLSearchParams(window.location.search).get("error");
  if (error === "sold_out") return "sold_out";
  return error ? "generic" : null;
}

const getServerCheckoutError = () => null;

export default function CartPage() {
  const { items, ready } = useCart();
  const urlError = useSyncExternalStore(
    subscribeToLocation,
    getCheckoutError,
    getServerCheckoutError
  );
  const [checkoutError, setCheckoutError] = useState<CheckoutError | undefined>(undefined);
  const [pending, startTransition] = useTransition();
  const error = checkoutError === undefined ? urlError : checkoutError;

  async function checkout() {
    setCheckoutError(null);
    startTransition(async () => {
      try {
        const res = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slugs: items.map((i) => i.slug) }),
        });
        const data = (await res.json()) as { url?: string; error?: string; soldOut?: string[] };
        if (res.ok && data.url) {
          window.location.href = data.url;
          return;
        }
        if (data.error === "sold_out") setCheckoutError("sold_out");
        else setCheckoutError("generic");
      } catch {
        setCheckoutError("generic");
      }
    });
  }

  const subtotal = items.reduce((sum, i) => sum + i.priceCents, 0);
  const freeShipping = subtotal >= 30000;

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <p className="pixel-tag text-[9px] text-phosphor">YOUR LOADOUT</p>
      <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Cart</h1>

      {!ready ? (
        <div className="mt-10 h-40 animate-pulse rounded-surface border border-line bg-panel" />
      ) : items.length === 0 ? (
        <div className="mt-10 rounded-surface border border-dashed border-line bg-panel p-14 text-center">
          <p className="pixel-tag text-[9px] text-mist">CART EMPTY</p>
          <p className="mx-auto mt-3 max-w-sm text-sm text-mist">
            One-of-one consoles don&apos;t wait around. Grab something from the bench.
          </p>
          <Link
            href="/shop"
            className="pixel-tag mt-6 inline-flex h-12 items-center rounded-sm bg-phosphor px-6 text-[10px] text-ink transition-colors hover:bg-bone"
          >
            ▶ SHOP RESTORED GEAR
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
          <ul className="flex flex-col gap-3">
            {items.map((item) => (
              <li
                key={item.slug}
                className="flex items-center gap-4 rounded-surface border border-line bg-panel p-3"
              >
                <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-sm bg-panel-2">
                  {item.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  ) : (
                    <span className="pixel-tag flex h-full items-center justify-center text-[7px] text-mist/40">ROG</span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <Link href={`/shop/${item.slug}`} className="block truncate text-sm font-bold hover:text-phosphor">
                    {item.name}
                  </Link>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-mist">
                    {item.platform} · Qty 1
                  </p>
                </div>
                <p className="font-mono text-sm font-bold">{formatPrice(item.priceCents)}</p>
                <button
                  type="button"
                  onClick={() => removeItem(item.slug)}
                  aria-label={`Remove ${item.name} from cart`}
                  className="flex h-8 w-8 items-center justify-center rounded-sm border border-line text-mist transition-colors hover:border-amber/50 hover:text-amber"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>

          <aside className="h-fit rounded-surface border border-line bg-panel p-5">
            <h2 className="pixel-tag text-[9px] text-phosphor">ORDER SUMMARY</h2>
            <dl className="mt-4 space-y-2 font-mono text-xs">
              <div className="flex justify-between">
                <dt className="text-mist">Subtotal</dt>
                <dd>{formatPrice(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-mist">Shipping</dt>
                <dd>{freeShipping ? "FREE" : "calculated at checkout"}</dd>
              </div>
            </dl>
            <p className="mt-3 border-t border-line pt-3 font-mono text-[10px] leading-relaxed text-mist">
              Taxes calculated at checkout. Free shipping on orders over $300.
            </p>

            {error === "sold_out" && (
              <p className="mt-4 rounded-sm border border-amber/40 bg-amber/10 p-3 text-xs text-amber">
                Someone beat you to a unit — it just sold. Remove it and complete the rest of your
                order before it&apos;s gone too.
              </p>
            )}
            {error === "generic" && (
              <p className="mt-4 rounded-sm border border-amber/40 bg-amber/10 p-3 text-xs text-amber">
                Checkout couldn&apos;t start. Please try again.
              </p>
            )}

            <button
              type="button"
              onClick={checkout}
              disabled={pending}
              className="pixel-tag mt-5 flex h-14 w-full items-center justify-center rounded-sm bg-phosphor text-[10px] text-ink transition-colors hover:bg-bone disabled:opacity-50"
            >
              {pending ? "OPENING CHECKOUT…" : "▶ CHECKOUT SECURELY"}
            </button>
            <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-widest text-mist">
              Powered by Stripe · cards, Apple Pay, Google Pay
            </p>
          </aside>
        </div>
      )}
    </main>
  );
}
