import Link from "next/link";
import type { Metadata } from "next";
import { getProducts, getPlatformBySlug } from "@/lib/queries";
import { PLATFORM_NAV } from "@/lib/site";
import { ProductCard } from "@/components/product-card";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop Restored Consoles & Retro Gear",
  description:
    "Browse one-of-one restored consoles, handhelds, games and tech. Cleaned, tested and ready to play — every unit ships with a documented Respawn Report.",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ platform?: string }>;
}) {
  const { platform } = await searchParams;
  const [products, activePlatform] = await Promise.all([
    getProducts({ platform }),
    platform ? getPlatformBySlug(platform) : Promise.resolve(null),
  ]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="pixel-tag text-[9px] text-phosphor">THE SHOP</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
            {activePlatform ? `${activePlatform.name} gear` : "All restored gear"}
          </h1>
          <p className="mt-2 max-w-xl text-sm text-mist">
            One-of-one units. Cleaned, tested, and shipped with a Respawn Report. When it sells,
            it&apos;s gone.
          </p>
        </div>
        <p className="font-mono text-xs text-mist">{products.length} units listed</p>
      </header>

      <nav aria-label="Platform filter" className="mt-8 flex flex-wrap gap-2">
        <Link
          href="/shop"
          className={`rounded-sm border px-3 py-2 font-mono text-[11px] uppercase tracking-widest transition-colors ${
            !platform
              ? "border-phosphor/50 bg-phosphor/10 text-phosphor"
              : "border-line text-mist hover:border-phosphor/40 hover:text-bone"
          }`}
        >
          All
        </Link>
        {PLATFORM_NAV.map((p) => (
          <Link
            key={p.slug}
            href={`/shop?platform=${p.slug}`}
            className={`rounded-sm border px-3 py-2 font-mono text-[11px] uppercase tracking-widest transition-colors ${
              platform === p.slug
                ? "border-phosphor/50 bg-phosphor/10 text-phosphor"
                : "border-line text-mist hover:border-phosphor/40 hover:text-bone"
            }`}
          >
            {p.label}
          </Link>
        ))}
      </nav>

      {products.length === 0 ? (
        <div className="mt-12 rounded-surface border border-dashed border-line bg-panel p-14 text-center">
          <p className="pixel-tag text-[9px] text-phosphor">SHELF RESTOCKING</p>
          <p className="mx-auto mt-3 max-w-md text-sm text-mist">
            Nothing on this shelf right now — new units respawn weekly. Join the restock alert
            list in the footer and you&apos;ll be first to know.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex h-11 items-center rounded-sm border border-line px-5 font-mono text-[11px] uppercase tracking-widest text-mist hover:border-phosphor/50 hover:text-phosphor"
          >
            Back to home
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </main>
  );
}
