import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { DEFAULT_REFURB_CHECKLIST } from "@/lib/site";
import { getSiteSettingJSON } from "@/lib/queries";
import { saveRefurbChecklistAction, updateTierAction } from "@/app/actions/settings";
import { ChecklistEditor } from "./checklist-editor";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const [checklist, tiers] = await Promise.all([
    getSiteSettingJSON("refurb_checklist", DEFAULT_REFURB_CHECKLIST),
    db.serviceTier.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-black tracking-tight">Settings</h1>

      <section className="mt-8 max-w-2xl">
        <h2 className="pixel-tag text-[9px] text-phosphor">HOMEPAGE REFURBISHMENT CHECKLIST</h2>
        <p className="mt-2 text-xs leading-relaxed text-mist">
          These items appear in the refurbishment panel on the homepage. Only list services you
          actually offer — customers will expect them.
        </p>
        <div className="mt-4">
          <ChecklistEditor items={checklist} />
        </div>
      </section>

      <section className="mt-12 max-w-2xl">
        <h2 className="pixel-tag text-[9px] text-phosphor">SERVICE TIERS &amp; PRICING</h2>
        <p className="mt-2 text-xs leading-relaxed text-mist">
          Tier prices feed the refurbishment request form and the homepage teaser. Inactive tiers
          are hidden from customers.
        </p>
        <ul className="mt-4 space-y-3">
          {tiers.map((t) => (
            <li key={t.id} className="rounded-surface border border-line bg-panel p-4">
              <form action={updateTierAction} className="flex flex-wrap items-end gap-3">
                <input type="hidden" name="id" value={t.id} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold">{t.name}</p>
                  <p className="line-clamp-1 text-[11px] text-mist">{t.description}</p>
                </div>
                <label className="flex flex-col gap-1">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-mist">Price $</span>
                  <input
                    name="price"
                    inputMode="decimal"
                    defaultValue={(t.priceCents / 100).toFixed(2)}
                    className="h-9 w-24 rounded-sm border border-line bg-ink px-2 font-mono text-xs"
                  />
                </label>
                <label className="flex items-center gap-2 pb-2 text-xs">
                  <input type="checkbox" name="active" defaultChecked={t.active} className="accent-phosphor" />
                  Active
                </label>
                <button className="h-9 rounded-sm border border-phosphor/40 px-3 font-mono text-[10px] uppercase tracking-widest text-phosphor hover:bg-phosphor/10">
                  Save
                </button>
              </form>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
