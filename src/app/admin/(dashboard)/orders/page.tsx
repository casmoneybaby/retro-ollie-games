import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { updateOrderStatusAction, refundOrderAction } from "@/app/actions/admin";
import { OrderStatus } from "@/generated/prisma/enums";

export const dynamic = "force-dynamic";

const STATUSES = Object.values(OrderStatus);

export default async function AdminOrdersPage() {
  const orders = await db.order.findMany({
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-black tracking-tight">Orders ({orders.length})</h1>
      <p className="mt-2 max-w-2xl text-xs leading-relaxed text-mist">
        Payment status is driven by verified Stripe webhooks. Refunds require typing REFUND to
        confirm — inventory is not auto-restocked, you decide that after the item physically
        returns.
      </p>

      {orders.length === 0 ? (
        <p className="mt-6 rounded-surface border border-dashed border-line bg-panel p-10 text-center text-sm text-mist">
          No orders yet.
        </p>
      ) : (
        <ul className="mt-6 space-y-3">
          {orders.map((o) => (
            <li key={o.id} className="rounded-surface border border-line bg-panel p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-sm font-bold">{o.number}</p>
                  <p className="font-mono text-[10px] text-mist">
                    {o.email} · {o.createdAt.toISOString().slice(0, 16).replace("T", " ")}
                  </p>
                  <p className="mt-1 font-mono text-[10px] text-mist">
                    PI: {o.stripePaymentIntentId ?? "—"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-lg font-black">{formatPrice(o.totalCents)}</p>
                  <p className="font-mono text-[10px] text-mist">
                    items {formatPrice(o.subtotalCents)} + ship {formatPrice(o.shippingCents)}
                  </p>
                </div>
              </div>

              <ul className="mt-3 space-y-1 border-y border-line py-2">
                {o.items.map((i) => (
                  <li key={i.id} className="flex justify-between font-mono text-xs">
                    <span>
                      {i.quantity}× {i.nameSnapshot}{" "}
                      <span className="text-mist">({i.inventoryIdSnapshot})</span>
                    </span>
                    <span>{formatPrice(i.unitPriceCents * i.quantity)}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-3 flex flex-wrap items-end gap-3">
                <form action={updateOrderStatusAction} className="flex items-end gap-2">
                  <input type="hidden" name="id" value={o.id} />
                  <label className="flex flex-col gap-1">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-mist">Status</span>
                    <select
                      name="status"
                      defaultValue={o.status}
                      className="h-9 rounded-sm border border-line bg-ink px-2 font-mono text-xs"
                    >
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </label>
                  <button className="h-9 rounded-sm border border-phosphor/40 px-3 font-mono text-[10px] uppercase tracking-widest text-phosphor hover:bg-phosphor/10">
                    Update
                  </button>
                </form>

                {o.status === OrderStatus.PAID && o.stripePaymentIntentId && (
                  <form action={refundOrderAction} className="flex items-end gap-2">
                    <input type="hidden" name="id" value={o.id} />
                    <label className="flex flex-col gap-1">
                      <span className="font-mono text-[9px] uppercase tracking-widest text-mist">Type REFUND to confirm</span>
                      <input
                        name="confirm"
                        placeholder="REFUND"
                        className="h-9 w-28 rounded-sm border border-amber/40 bg-ink px-2 font-mono text-xs placeholder:text-mist/40"
                      />
                    </label>
                    <button className="h-9 rounded-sm border border-amber/40 px-3 font-mono text-[10px] uppercase tracking-widest text-amber hover:bg-amber/10">
                      Refund via Stripe
                    </button>
                  </form>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
