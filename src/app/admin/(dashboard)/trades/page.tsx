import { db } from "@/lib/db";
import { updateTradeStatusAction } from "@/app/actions/admin";
import { TradeStatus } from "@/generated/prisma/enums";

export const dynamic = "force-dynamic";

const STATUSES = Object.values(TradeStatus);

export default async function AdminTradesPage() {
  const trades = await db.tradeSubmission.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-black tracking-tight">Trade leads ({trades.length})</h1>
      <p className="mt-2 max-w-2xl text-xs leading-relaxed text-mist">
        Sell/trade submissions from the website. Reply by email with an offer, then track the
        status here.
      </p>

      {trades.length === 0 ? (
        <p className="mt-6 rounded-surface border border-dashed border-line bg-panel p-10 text-center text-sm text-mist">
          No trade leads yet.
        </p>
      ) : (
        <ul className="mt-6 space-y-3">
          {trades.map((t) => (
            <li key={t.id} className="rounded-surface border border-line bg-panel p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-bold">{t.device}{t.model ? ` · ${t.model}` : ""}</p>
                  <p className="text-xs text-mist">
                    {t.contactName} · {t.email}
                  </p>
                  {t.conditionDesc && <p className="mt-1 max-w-lg text-[11px] text-mist">“{t.conditionDesc}”</p>}
                  {t.accessories && <p className="text-[11px] text-mist">Includes: {t.accessories}</p>}
                  {t.askingPrice && <p className="mt-1 font-mono text-xs text-phosphor">Asking {t.askingPrice}</p>}
                </div>
                <form action={updateTradeStatusAction} className="flex items-end gap-2">
                  <input type="hidden" name="id" value={t.id} />
                  <select
                    name="status"
                    defaultValue={t.status}
                    className="h-9 rounded-sm border border-line bg-ink px-2 font-mono text-xs"
                  >
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <button className="h-9 rounded-sm border border-line px-3 font-mono text-[10px] uppercase tracking-widest text-mist hover:text-bone">
                    Save
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
