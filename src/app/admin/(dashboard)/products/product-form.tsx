"use client";

import { useActionState } from "react";
import { saveProductAction } from "@/app/actions/admin";

type Option = { id: string; name: string };

export type ProductFormValues = {
  id?: string;
  name?: string;
  slug?: string;
  inventoryId?: string;
  model?: string | null;
  platformId?: string;
  categoryId?: string;
  condition?: string;
  cosmeticGrade?: string | null;
  storage?: string | null;
  color?: string | null;
  description?: string;
  price?: string;
  compareAt?: string;
  quantity?: number;
  status?: string;
  featured?: boolean;
  specialEdition?: boolean;
  collectible?: boolean;
  shippingWeightLbs?: number | null;
  defectNotes?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  imageUrls?: string[];
  accessories?: string;
  workPerformed?: string;
  inspectionItems?: string;
  source?: string;
  sourceNotes?: string;
  acquisitionCost?: string;
  partsCost?: string;
  otherCost?: string;
  serialNumber?: string;
};

const CONDITIONS = ["PLAYER", "RESTORED", "VAULT"];
const STATUSES = ["DRAFT", "AVAILABLE", "RESERVED", "SOLD"];
const SOURCES = ["FACEBOOK_MARKETPLACE", "EBAY", "CRAIGSLIST", "GARAGE_SALE", "TRADE_IN", "CUSTOMER", "OTHER"];

const inputCls =
  "h-11 w-full rounded-sm border border-line bg-ink px-3 text-sm placeholder:text-mist/40 focus:border-phosphor/50 focus:outline-none";
const labelCls = "font-mono text-[10px] uppercase tracking-widest text-mist";

export function ProductForm({
  platforms,
  categories,
  product,
}: {
  platforms: Option[];
  categories: Option[];
  product?: ProductFormValues;
}) {
  const [state, action, pending] = useActionState(saveProductAction, {});

  return (
    <form action={action} className="space-y-6">
      {product?.id && <input type="hidden" name="id" value={product.id} />}

      {state.ok && (
        <p className="rounded-sm border border-phosphor/40 bg-phosphor/10 p-3 text-xs text-phosphor">
          ✓ Saved. {product?.id ? "Changes are live." : "Product created."}
        </p>
      )}
      {state.error && (
        <p className="rounded-sm border border-amber/40 bg-amber/10 p-3 text-xs text-amber">{state.error}</p>
      )}

      {/* Core */}
      <section className="rounded-surface border border-line bg-panel p-5">
        <h2 className="pixel-tag text-[9px] text-phosphor">CORE</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5 sm:col-span-2">
            <span className={labelCls}>Product name *</span>
            <input name="name" required defaultValue={product?.name} className={inputCls} placeholder="PlayStation 3 Super Slim 500GB — Restored" />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className={labelCls}>Platform *</span>
            <select name="platformId" required defaultValue={product?.platformId ?? ""} className={inputCls}>
              <option value="" disabled>Select…</option>
              {platforms.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className={labelCls}>Category *</span>
            <select name="categoryId" required defaultValue={product?.categoryId ?? ""} className={inputCls}>
              <option value="" disabled>Select…</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className={labelCls}>Model</span>
            <input name="model" defaultValue={product?.model ?? ""} className={inputCls} placeholder="CECH-4201C" />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className={labelCls}>Inventory ID</span>
            <input name="inventoryId" defaultValue={product?.inventoryId} className={inputCls} placeholder="auto if blank" />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className={labelCls}>Slug (leave blank to auto-generate)</span>
            <input name="slug" defaultValue={product?.slug} className={inputCls} placeholder="ps3-super-slim-500gb" />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className={labelCls}>Condition *</span>
            <select name="condition" defaultValue={product?.condition ?? "RESTORED"} className={inputCls}>
              {CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className={labelCls}>Cosmetic grade</span>
            <input name="cosmeticGrade" defaultValue={product?.cosmeticGrade ?? ""} className={inputCls} placeholder="B+ (light wear)" />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className={labelCls}>Storage</span>
            <input name="storage" defaultValue={product?.storage ?? ""} className={inputCls} placeholder="500GB HDD" />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className={labelCls}>Color</span>
            <input name="color" defaultValue={product?.color ?? ""} className={inputCls} placeholder="Charcoal black" />
          </label>

          <label className="flex flex-col gap-1.5 sm:col-span-2">
            <span className={labelCls}>Description *</span>
            <textarea
              name="description"
              required
              rows={5}
              defaultValue={product?.description}
              className="w-full rounded-sm border border-line bg-ink p-3 text-sm placeholder:text-mist/40 focus:border-phosphor/50 focus:outline-none"
              placeholder="Fully restored PS3 Super Slim. New thermal paste, deep clean, HDMI port serviced…"
            />
          </label>

          <label className="flex flex-col gap-1.5 sm:col-span-2">
            <span className={labelCls}>Known imperfections (shown publicly — honesty sells)</span>
            <input name="defectNotes" defaultValue={product?.defectNotes ?? ""} className={inputCls} placeholder="Hairline scuff on lid — see photo 4" />
          </label>
        </div>
      </section>

      {/* Money */}
      <section className="rounded-surface border border-line bg-panel p-5">
        <h2 className="pixel-tag text-[9px] text-phosphor">MONEY</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <label className="flex flex-col gap-1.5">
            <span className={labelCls}>Sale price (USD) *</span>
            <input name="price" required inputMode="decimal" defaultValue={product?.price} className={inputCls} placeholder="200" />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={labelCls}>Compare-at price</span>
            <input name="compareAt" inputMode="decimal" defaultValue={product?.compareAt} className={inputCls} placeholder="249" />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={labelCls}>Quantity</span>
            <input name="quantity" type="number" min={0} max={99} defaultValue={product?.quantity ?? 1} className={inputCls} />
          </label>
        </div>

        <div className="mt-4 rounded-sm border border-line bg-ink p-3">
          <p className="font-mono text-[10px] uppercase tracking-widest text-mist">
            🔒 Private costs — never shown to customers (powers profit analytics)
          </p>
          <div className="mt-3 grid gap-4 sm:grid-cols-3">
            <label className="flex flex-col gap-1.5">
              <span className={labelCls}>Acquisition cost</span>
              <input name="acquisitionCost" inputMode="decimal" defaultValue={product?.acquisitionCost} className={inputCls} placeholder="85" />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={labelCls}>Parts cost</span>
              <input name="partsCost" inputMode="decimal" defaultValue={product?.partsCost} className={inputCls} placeholder="22" />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={labelCls}>Other cost</span>
              <input name="otherCost" inputMode="decimal" defaultValue={product?.otherCost} className={inputCls} placeholder="10" />
            </label>
          </div>
        </div>
      </section>

      {/* Status & merchandising */}
      <section className="rounded-surface border border-line bg-panel p-5">
        <h2 className="pixel-tag text-[9px] text-phosphor">STATUS &amp; MERCHANDISING</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <label className="flex flex-col gap-1.5">
            <span className={labelCls}>Status</span>
            <select name="status" defaultValue={product?.status ?? "DRAFT"} className={inputCls}>
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={labelCls}>Shipping weight (lbs)</span>
            <input name="shippingWeightLbs" inputMode="decimal" defaultValue={product?.shippingWeightLbs ?? ""} className={inputCls} placeholder="6" />
          </label>
          <div className="flex flex-col justify-end gap-2 pb-1">
            <label className="flex items-center gap-2 text-xs">
              <input type="checkbox" name="featured" defaultChecked={product?.featured} className="accent-phosphor" />
              Featured on homepage
            </label>
            <label className="flex items-center gap-2 text-xs">
              <input type="checkbox" name="specialEdition" defaultChecked={product?.specialEdition} className="accent-phosphor" />
              Special edition
            </label>
            <label className="flex items-center gap-2 text-xs">
              <input type="checkbox" name="collectible" defaultChecked={product?.collectible} className="accent-phosphor" />
              Collectible / vault
            </label>
          </div>
        </div>
      </section>

      {/* Media & box contents */}
      <section className="rounded-surface border border-line bg-panel p-5">
        <h2 className="pixel-tag text-[9px] text-phosphor">PHOTOS &amp; BOX CONTENTS</h2>
        <p className="mt-2 text-[11px] leading-relaxed text-mist">
          Paste image URLs (one per line) — hosted anywhere, e.g. Vercel Blob or your eBay photo
          CDN. First image is the cover.
        </p>
        <label className="mt-3 flex flex-col gap-1.5">
          <span className={labelCls}>Image URLs</span>
          <textarea
            name="imageUrls"
            rows={3}
            defaultValue={(product?.imageUrls ?? []).join("\n")}
            className="w-full rounded-sm border border-line bg-ink p-3 font-mono text-xs focus:border-phosphor/50 focus:outline-none"
            placeholder={"https://…/ps3-1.jpg\nhttps://…/ps3-2.jpg"}
          />
        </label>
        <label className="mt-3 flex flex-col gap-1.5">
          <span className={labelCls}>Included accessories (comma separated)</span>
          <input name="accessories" defaultValue={product?.accessories} className={inputCls} placeholder="1 controller, HDMI cable, power cable" />
        </label>
      </section>

      {/* Respawn Report */}
      <section className="rounded-surface border border-line bg-panel p-5">
        <h2 className="pixel-tag text-[9px] text-phosphor">RESPAWN REPORT (SHOWN ON PRODUCT PAGE)</h2>
        <div className="mt-4 grid gap-4">
          <label className="flex flex-col gap-1.5">
            <span className={labelCls}>Work performed summary</span>
            <textarea
              name="workPerformed"
              rows={3}
              defaultValue={product?.workPerformed}
              className="w-full rounded-sm border border-line bg-ink p-3 text-sm placeholder:text-mist/40 focus:border-phosphor/50 focus:outline-none"
              placeholder="Full teardown, ultrasonic clean, new thermal paste (Arctic MX-4), fan service, HDMI port reflow, 2h burn-in."
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={labelCls}>Inspection checklist — one per line, prefix with ! for a note/fail</span>
            <textarea
              name="inspectionItems"
              rows={6}
              defaultValue={product?.inspectionItems}
              className="w-full rounded-sm border border-line bg-ink p-3 font-mono text-xs focus:border-phosphor/50 focus:outline-none"
              placeholder={"Power\nVideo output\nDisc drive\nWi-Fi\nBluetooth\nAll ports"}
            />
          </label>
        </div>
      </section>

      {/* Sourcing (private) */}
      <section className="rounded-surface border border-line bg-panel p-5">
        <h2 className="pixel-tag text-[9px] text-phosphor">🔒 SOURCING (PRIVATE)</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <label className="flex flex-col gap-1.5">
            <span className={labelCls}>Source</span>
            <select name="source" defaultValue={product?.source ?? "OTHER"} className={inputCls}>
              {SOURCES.map((s) => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={labelCls}>Serial number</span>
            <input name="serialNumber" defaultValue={product?.serialNumber} className={inputCls} />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={labelCls}>Source notes</span>
            <input name="sourceNotes" defaultValue={product?.sourceNotes} className={inputCls} placeholder="eBay auction, seller pics" />
          </label>
        </div>
      </section>

      {/* SEO */}
      <section className="rounded-surface border border-line bg-panel p-5">
        <h2 className="pixel-tag text-[9px] text-phosphor">SEO</h2>
        <div className="mt-4 grid gap-4">
          <label className="flex flex-col gap-1.5">
            <span className={labelCls}>SEO title</span>
            <input name="seoTitle" defaultValue={product?.seoTitle ?? ""} className={inputCls} />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={labelCls}>SEO description</span>
            <input name="seoDescription" defaultValue={product?.seoDescription ?? ""} className={inputCls} />
          </label>
        </div>
      </section>

      <button
        type="submit"
        disabled={pending}
        className="pixel-tag flex h-14 w-full items-center justify-center rounded-sm bg-phosphor text-[10px] text-ink transition-colors hover:bg-bone disabled:opacity-50"
      >
        {pending ? "SAVING…" : product?.id ? "SAVE CHANGES" : "SAVE PRODUCT"}
      </button>
    </form>
  );
}
