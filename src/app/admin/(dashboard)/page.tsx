import Link from "next/link";
import { db } from "@/lib/db";
import { OrderStatus, ProductStatus } from "@/generated/prisma/enums";
import { formatPrice } from "@/lib/utils";
import { SERVICE_STATUS_LABELS } from "@/lib/site";

export const dynamic = "force-dynamic";

function money(cents: number): string {
  return formatPrice(cents);
}

export default async function AdminDashboard() {
  const [orders, products, serviceRequests, trades, subscribers] = await Promise.all([
    db.order.findMany({
      where: { status: { in: [OrderStatus.PAID, OrderStatus.FULFILLED] } },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    }),
    db.product.findMany({
      include: { platform: true, sourcingRecord: true },
      orderBy: { createdAt: "desc" },
    }),
    db.serviceRequest.findMany({
      include: { serviceTier: true },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    db.tradeSubmission.findMany({ where: { status: "NEW" as never }, orderBy: { createdAt: "desc" }, take: 5 }),
    db.emailSubscriber.count(),
  ]);

  // --- Analytics from real data (never fake) ---
  const paidOrders = orders;
  const revenueCents = paidOrders.reduce((s, o) => s + o.totalCents, 0);
  const unitsSold = paidOrders.reduce((s, o) => s + o.items.reduce((x, i) => x + i.quantity, 0), 0);
  const aovCents = paidOrders.length > 0 ? Math.round(revenueCents / paidOrders.length) : 0;

  const soldProducts = products.filter((p) => p.status === ProductStatus.SOLD);
  const acquisitionCents = soldProducts.reduce((s, p) => s + (p.sourcingRecord?.acquisitionCents ?? 0), 0);
  const partsCents = soldProducts.reduce((s, p) => s + (p.sourcingRecord?.partsCents ?? 0), 0);
  const otherCents = soldProducts.reduce((s, p) => s + (p.sourcingRecord?.otherCents ?? 0), 0);
  const contributionCents = revenueCents - acquisitionCents - partsCents - otherCents;
  const marginPct = revenueCents > 0 ? Math.round((contributionCents / revenueCents) * 100) : 0;

  const inventoryValueCents = products
    .filter((p) => p.status === ProductStatus.AVAILABLE || p.status === ProductStatus.RESERVED)
    .reduce((s, p) => s + p.priceCents * p.quantity, 0);

  const availableCount = products.filter((p) => p.status === ProductStatus.AVAILABLE).length;
  const draftCount = products.filter((p) => p.status === ProductStatus.DRAFT).length;
  const soldCount = soldProducts.length;

  const serviceRevenueCents = serviceRequests
    .filter((r) => r.status === "COMPLETED" as never)
    .reduce((s, r) => s + r.quotedCents, 0);

  const daysHeld = (p: (typeof soldProducts)[number]): number | null => {
    if (!p.publishedAt) return null;
    const sold = p.updatedAt;
    return Math.max(1, Math.round((sold.getTime() - p.publishedAt.getTime()) / 86_400_000));
  };
  const heldArr = soldProducts.map(daysHeld).filter((d): d is number => d !== null);
  const avgDaysHeld = heldArr.length > 0 ? Math.round(heldArr.reduce((s, d) => s + d, 0) / heldArr.length) : null;

  const recent = await db.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 6,
    include: { items: true },
  });

  const stats = [
    { label: "Revenue (paid)", value: money(revenueCents) },
    { label: "Orders", value: String(paidOrders.length) },
    { label: "Units sold", value: String(unitsSold) },
    { label: "Avg order value", value: money(aovCents) },
    { label: "Inventory value", value: money(inventoryValueCents) },
    { label: "Contribution profit", value: money(contributionCents) },
    { label: "Margin", value: `${marginPct}%` },
    { label: "Service revenue", value: money(serviceRevenueCents) },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-black tracking-tight">Dashboard</h1>
        <Link
          href="/admin/products/new"
          className="rounded-sm bg-phosphor px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-ink hover:bg-bone"
        >
          + Add product
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-surface border border-line bg-panel p-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-mist">{s.label}</p>
            <p className="mt-1.5 font-mono text-xl font-black text-bone">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-4">
        <Link href="/admin/products" className="rounded-surface border border-line bg-panel p-4 hover:border-phosphor/40">
          <p className="font-mono text-2xl font-black text-phosphor">{availableCount}</p>
          <p className="text-xs text-mist">Listed products</p>
        </Link>
        <Link href="/admin/products" className="rounded-surface border border-line bg-panel p-4 hover:border-phosphor/40">
          <p className="font-mono text-2xl font-black text-bone">{draftCount}</p>
          <p className="text-xs text-mist">Drafts</p>
        </Link>
        <Link href="/admin/products" className="rounded-surface border border-line bg-panel p-4 hover:border-phosphor/40">
          <p className="font-mono text-2xl font-black text-amber">{soldCount}</p>
          <p className="text-xs text-mist">Units sold all-time</p>
        </Link>
        <Link href="/admin/trades" className="rounded-surface border border-line bg-panel p-4 hover:border-phosphor/40">
          <p className="font-mono text-2xl font-black text-bone">{trades.length}+ / {subscribers}</p>
          <p className="text-xs text-mist">New trade leads / subscribers</p>
        </Link>
      </div>

      <section className="mt-8">
        <h2 className="pixel-tag text-[9px] text-mist">LATEST ORDERS</h2>
        {recent.length === 0 ? (
          <p className="mt-3 rounded-surface border border-dashed border-line bg-panel p-6 text-xs text-mist">
            No orders yet — they&apos;ll appear here the moment Stripe confirms a payment.
          </p>
        ) : (
          <ul className="mt-3 divide-y divide-line rounded-surface border border-line bg-panel">
            {recent.map((o) => (
              <li key={o.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
                <div>
                  <p className="font-mono text-sm font-bold">{o.number}</p>
                  <p className="font-mono text-[10px] text-mist">
                    {o.email} · {o.items.length} item{o.items.length === 1 ? "" : "s"} ·{" "}
                    {o.createdAt.toISOString().slice(0, 10)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="pixel-tag rounded-sm border border-line px-2 py-1 text-[8px] text-mist">{o.status}</span>
                  <span className="font-mono text-sm font-bold">{money(o.totalCents)}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-8">
        <h2 className="pixel-tag text-[9px] text-mist">ACTIVE RESPAWN JOBS</h2>
        {serviceRequests.length === 0 ? (
          <p className="mt-3 rounded-surface border border-dashed border-line bg-panel p-6 text-xs text-mist">
            No refurb jobs yet. Requests from /refurbish land here with a RESPAWN number.
          </p>
        ) : (
          <ul className="mt-3 divide-y divide-line rounded-surface border border-line bg-panel">
            {serviceRequests.map((r) => (
              <li key={r.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
                <div>
                  <p className="font-mono text-sm font-bold">{r.jobNumber}</p>
                  <p className="text-[11px] text-mist">
                    {r.contactName} · {r.deviceFamily}
                    {r.deviceModel ? ` · ${r.deviceModel}` : ""} · {r.serviceTier.name}
                  </p>
                </div>
                <span className="pixel-tag rounded-sm border border-phosphor/30 bg-phosphor/5 px-2 py-1 text-[8px] text-phosphor">
                  {SERVICE_STATUS_LABELS[r.status] ?? r.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
