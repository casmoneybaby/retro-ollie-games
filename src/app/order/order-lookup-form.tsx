"use client";

import { useActionState } from "react";
import { lookupOrderAction } from "@/app/actions/orders";
import { formatPrice } from "@/lib/utils";
import { OrderStatus } from "@/generated/prisma/enums";

export function OrderLookupForm() {
  const [state, action, pending] = useActionState(lookupOrderAction, null);

  if (!state) {
    return (
      <form action={action} className="flex flex-col gap-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5">
            <span className="font-mono text-[10px] uppercase tracking-widest text-mist">Order number</span>
            <input
              name="number"
              required
              placeholder="ROG-XXXXX"
              className="h-11 rounded-sm border border-line bg-panel px-3 font-mono text-sm text-bone placeholder:text-mist/40 focus:border-phosphor/50 focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="font-mono text-[10px] uppercase tracking-widest text-mist">Email</span>
            <input
              type="email"
              name="email"
              required
              placeholder="you@email.com"
              className="h-11 rounded-sm border border-line bg-panel px-3 font-mono text-sm text-bone placeholder:text-mist/40 focus:border-phosphor/50 focus:outline-none"
            />
          </label>
        </div>
        <button
          type="submit"
          disabled={pending}
          className="pixel-tag mt-2 flex h-12 items-center justify-center rounded-sm bg-phosphor text-[10px] text-ink disabled:opacity-50"
        >
          {pending ? "SEARCHING…" : "FIND MY ORDER"}
        </button>
      </form>
    );
  }

  if ("error" in state) {
    return (
      <div>
        <p className="rounded-sm border border-amber/40 bg-amber/10 p-3 text-xs text-amber">{state.error}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-4 font-mono text-[11px] uppercase tracking-widest text-mist hover:text-phosphor"
        >
          ← Try again
        </button>
      </div>
    );
  }

  const order = state.order;
  const statusLabels: Record<string, string> = {
    PENDING: "Awaiting payment",
    PAID: "Paid — preparing to ship",
    FULFILLED: "Shipped",
    CANCELLED: "Canceled",
    REFUNDED: "Refunded",
  };

  return (
    <div className="rounded-surface border border-line bg-panel p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-mono text-sm font-bold">{order.number}</p>
        <span className="pixel-tag rounded-sm border border-phosphor/40 bg-phosphor/10 px-2 py-1 text-[8px] text-phosphor">
          {statusLabels[order.status] ?? order.status}
        </span>
      </div>
      <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-mist">
        placed {order.createdAt}
      </p>

      <ul className="mt-4 divide-y divide-line border-y border-line">
        {order.items.map((item) => (
          <li key={item.id} className="flex items-center justify-between gap-4 py-3">
            <div>
              <p className="text-sm font-bold">{item.nameSnapshot}</p>
              <p className="font-mono text-[10px] uppercase tracking-widest text-mist">
                UNIT {item.inventoryIdSnapshot}
              </p>
            </div>
            <p className="font-mono text-sm">{formatPrice(item.unitPriceCents)}</p>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex justify-between font-mono text-sm font-bold">
        <span>Total</span>
        <span className="text-phosphor">{formatPrice(order.totalCents)}</span>
      </div>
      <p className="mt-3 font-mono text-[10px] leading-relaxed text-mist">
        {order.status === "PAID" && "We're packing your gear. Tracking arrives by email soon."}
        {order.status === "FULFILLED" && "Shipped! Tracking details were sent to your email."}
      </p>
    </div>
  );
}
