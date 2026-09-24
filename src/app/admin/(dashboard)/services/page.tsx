import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { SERVICE_STATUS_FLOW, SERVICE_STATUS_LABELS } from "@/lib/site";
import { updateServiceStatusAction, updateServiceQuoteAction } from "@/app/actions/admin";


export const dynamic = "force-dynamic";

export default async function AdminServicesPage() {
  const requests = await db.serviceRequest.findMany({
    include: { serviceTier: true, statusEvents: { orderBy: { createdAt: "desc" }, take: 1 } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-black tracking-tight">Respawn jobs ({requests.length})</h1>
      <p className="mt-2 max-w-2xl text-xs leading-relaxed text-mist">
        Customer refurb requests. Update status as units move through the pipeline — customers
        see the status live in the Respawn Log. Internal notes stay internal.
      </p>

      {requests.length === 0 ? (
        <p className="mt-6 rounded-surface border border-dashed border-line bg-panel p-10 text-center text-sm text-mist">
          No refurb jobs yet.
        </p>
      ) : (
        <ul className="mt-6 space-y-3">
          {requests.map((r) => (
            <li key={r.id} className="rounded-surface border border-line bg-panel p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-sm font-bold">{r.jobNumber}</p>
                  <p className="text-xs text-mist">
                    {r.contactName} · {r.email}
                    {r.phone ? ` · ${r.phone}` : ""}
                  </p>
                  <p className="mt-1 text-xs text-bone">
                    {r.deviceFamily}
                    {r.deviceModel ? ` · ${r.deviceModel}` : ""} · {r.serviceTier.name} ·{" "}
                    {r.shippingMethod === "SHIP_TO_US" ? "shipping in" : "local drop-off"}
                  </p>
                  {r.symptoms && (
                    <p className="mt-1 max-w-lg text-[11px] leading-relaxed text-mist">“{r.symptoms}”</p>
                  )}
                  {r.photos.length > 0 && (
                    <p className="mt-1 font-mono text-[10px] text-mist">{r.photos.length} photo(s) attached</p>
                  )}
                </div>
                <div className="text-right font-mono text-[11px] text-mist">
                  <p>Quote: {formatPrice(r.quotedCents)}</p>
                  <p>Deposit: {formatPrice(r.depositCents)} {r.depositPaidAt ? "✓ paid" : ""}</p>
                  <p className="mt-1">{r.createdAt.toISOString().slice(0, 10)}</p>
                </div>
              </div>

              {r.statusEvents[0]?.note && (
                <p className="mt-2 rounded-sm bg-ink px-3 py-2 font-mono text-[10px] text-mist">
                  last note: {r.statusEvents[0].note}
                </p>
              )}

              <div className="mt-3 flex flex-wrap items-end gap-3 border-t border-line pt-3">
                <form action={updateServiceStatusAction} className="flex flex-wrap items-end gap-2">
                  <input type="hidden" name="id" value={r.id} />
                  <label className="flex flex-col gap-1">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-mist">Set status</span>
                    <select
                      name="status"
                      defaultValue={r.status}
                      className="h-9 rounded-sm border border-line bg-ink px-2 font-mono text-xs"
                    >
                      {SERVICE_STATUS_FLOW.map((s) => (
                        <option key={s} value={s}>{SERVICE_STATUS_LABELS[s]}</option>
                      ))}
                    </select>
                  </label>
                  <label className="flex flex-col gap-1">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-mist">Internal note</span>
                    <input
                      name="note"
                      placeholder="only staff sees this"
                      className="h-9 w-44 rounded-sm border border-line bg-ink px-2 font-mono text-xs placeholder:text-mist/40"
                    />
                  </label>
                  <button className="h-9 rounded-sm border border-phosphor/40 px-3 font-mono text-[10px] uppercase tracking-widest text-phosphor hover:bg-phosphor/10">
                    Update
                  </button>
                </form>

                <form action={updateServiceQuoteAction} className="flex items-end gap-2">
                  <input type="hidden" name="id" value={r.id} />
                  <label className="flex flex-col gap-1">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-mist">Quote $</span>
                    <input
                      name="quoted"
                      inputMode="decimal"
                      defaultValue={(r.quotedCents / 100).toFixed(2)}
                      className="h-9 w-20 rounded-sm border border-line bg-ink px-2 font-mono text-xs"
                    />
                  </label>
                  <label className="flex flex-col gap-1">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-mist">Deposit $</span>
                    <input
                      name="deposit"
                      inputMode="decimal"
                      defaultValue={(r.depositCents / 100).toFixed(2)}
                      className="h-9 w-20 rounded-sm border border-line bg-ink px-2 font-mono text-xs"
                    />
                  </label>
                  <button className="h-9 rounded-sm border border-line px-3 font-mono text-[10px] uppercase tracking-widest text-mist hover:text-bone">
                    Save quote
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
