import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductBySlug, getProducts } from "@/lib/queries";
import { formatPrice, CONDITION_META, type ConditionKey } from "@/lib/utils";
import { ConditionBadge, StockBadge } from "@/components/badges";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { ProductCard } from "@/components/product-card";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug).catch(() => null);
  if (!product) return { title: "Not found" };
  return {
    title: product.name,
    description: product.description.slice(0, 155),
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product || product.status === "DRAFT") notFound();

  const related = (
    await getProducts({ limit: 4 }).catch(() => [])
  ).filter((p) => p.id !== product.id).slice(0, 3);

  const sold = product.status === "SOLD";
  const reserved = product.status === "RESERVED";
  const buyable = !sold && !reserved;
  const conditionMeta = CONDITION_META[product.condition as ConditionKey] ?? CONDITION_META.PLAYER;

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <nav aria-label="Breadcrumb" className="mb-6 font-mono text-[11px] uppercase tracking-widest text-mist">
        <Link href="/shop" className="hover:text-phosphor">Shop</Link>
        <span className="mx-2">/</span>
        <Link href={`/shop?platform=${product.platform.slug}`} className="hover:text-phosphor">
          {product.platform.name}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-bone">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* ---------- Gallery ---------- */}
        <div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-surface border border-line bg-panel-2">
            {product.images[0] ? (
              <Image
                src={product.images[0].url}
                alt={product.images[0].alt ?? product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <span className="pixel-tag text-[10px] text-mist/40">PHOTOS INCOMING</span>
              </div>
            )}
          </div>

          {product.images.length > 1 && (
            <div className="mt-3 grid grid-cols-5 gap-2">
              {product.images.slice(1, 6).map((img) => (
                <div key={img.id} className="relative aspect-square overflow-hidden rounded-sm border border-line bg-panel-2">
                  <Image src={img.url} alt={img.alt ?? product.name} fill sizes="120px" className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ---------- Buy box ---------- */}
        <div className="flex flex-col">
          <div className="flex flex-wrap items-center gap-2">
            <ConditionBadge condition={product.condition} />
            <StockBadge quantity={product.quantity} status={product.status} />
            {product.specialEdition && (
              <span className="pixel-tag rounded-sm border border-amber/40 bg-amber/10 px-2 py-1 text-[8px] text-amber">
                SPECIAL EDITION
              </span>
            )}
          </div>

          <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">{product.name}</h1>
          <p className="mt-2 font-mono text-[11px] uppercase tracking-widest text-mist">
            {product.platform.name}
            {product.model ? ` · ${product.model}` : ""}
            {product.inventoryId ? ` · UNIT ${product.inventoryId}` : ""}
          </p>

          <div className="mt-6 flex items-end gap-3">
            <p className="font-mono text-4xl font-black text-bone">{formatPrice(product.priceCents)}</p>
            {product.compareAtCents && (
              <p className="pb-1.5 font-mono text-base text-mist line-through">
                {formatPrice(product.compareAtCents)}
              </p>
            )}
          </div>

          <p className="mt-6 text-sm leading-relaxed text-mist">{product.description}</p>

          <dl className="mt-6 space-y-2 rounded-surface border border-line bg-panel p-4 font-mono text-xs">
            {product.model && (
              <div className="flex justify-between gap-4">
                <dt className="text-mist">MODEL</dt>
                <dd className="text-right text-bone">{product.model}</dd>
              </div>
            )}
            {product.storage && (
              <div className="flex justify-between gap-4">
                <dt className="text-mist">STORAGE</dt>
                <dd className="text-right text-bone">{product.storage}</dd>
              </div>
            )}
            {product.color && (
              <div className="flex justify-between gap-4">
                <dt className="text-mist">COLOR</dt>
                <dd className="text-right text-bone">{product.color}</dd>
              </div>
            )}
            <div className="flex justify-between gap-4">
              <dt className="text-mist">CONDITION</dt>
              <dd className="text-right text-bone">
                {conditionMeta.label} — {conditionMeta.blurb}
              </dd>
            </div>
          </dl>

          {product.accessories.length > 0 && (
            <div className="mt-4 rounded-surface border border-line bg-panel p-4">
              <h2 className="pixel-tag text-[8px] text-phosphor">WHAT&apos;S IN THE BOX</h2>
              <ul className="mt-2 space-y-1 font-mono text-xs text-mist">
                {product.accessories.map((a) => (
                  <li key={a.id}>
                    <span className="text-phosphor">+</span> {a.quantity > 1 ? `${a.quantity}× ` : ""}
                    {a.name}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {product.defectNotes && (
            <p className="mt-4 rounded-surface border border-amber/30 bg-amber/5 p-4 text-xs leading-relaxed text-amber/90">
              <strong className="font-bold">Known imperfections:</strong> {product.defectNotes}
            </p>
          )}

          {/* ---------- CTA ---------- */}
          <div className="mt-8">
            {buyable && product.status === "AVAILABLE" ? (
              <AddToCartButton
                product={{
                  slug: product.slug,
                  name: product.name,
                  priceCents: product.priceCents,
                  image: product.images[0]?.url ?? null,
                  platform: product.platform.name,
                }}
              />
            ) : (
              <button
                disabled
                className="pixel-tag flex h-14 w-full items-center justify-center rounded-sm border border-line bg-panel-2 text-[11px] text-mist"
              >
                {sold ? "SOLD — GONE TO A NEW PLAYER" : "RESERVED — CHECK BACK"}
              </button>
            )}
            <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-widest text-mist">
              Secure Stripe checkout · Tracked shipping · 30-day doa guarantee
            </p>
          </div>

          {/* ---------- Respawn Report ---------- */}
          {product.inspection && (
            <section aria-label="Respawn Report" className="mt-10 overflow-hidden rounded-surface border border-line">
              <header className="flex items-center justify-between border-b border-line bg-panel px-4 py-3">
                <h2 className="pixel-tag text-[9px] text-phosphor">RESPAWN REPORT</h2>
                <span className="font-mono text-[10px] text-mist">
                  {product.inspection.completedAt
                    ? `verified ${product.inspection.completedAt.toISOString().slice(0, 10)}`
                    : "verified at bench"}
                </span>
              </header>
              {product.inspection.workPerformed && (
                <p className="border-b border-line px-4 py-3 text-xs leading-relaxed text-mist">
                  {product.inspection.workPerformed}
                </p>
              )}
              <ul className="grid gap-x-6 gap-y-1 p-4 font-mono text-xs sm:grid-cols-2">
                {product.inspection.items.map((item) => (
                  <li key={item.id} className="flex items-center justify-between gap-2 py-1">
                    <span className="text-mist">{item.label}</span>
                    <span className={item.passed ? "text-phosphor" : "text-amber"}>
                      {item.passed ? "✓ PASS" : "! NOTE"}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="pixel-tag text-[9px] text-phosphor">MORE FROM THE BENCH</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
