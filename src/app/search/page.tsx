import Link from "next/link";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { ProductStatus } from "@/generated/prisma/enums";
import { ProductCard } from "@/components/product-card";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Search" };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();

  const results = query
    ? await db.product.findMany({
        where: {
          status: ProductStatus.AVAILABLE,
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
            { model: { contains: query, mode: "insensitive" } },
            { platform: { name: { contains: query, mode: "insensitive" } } },
          ],
        },
        include: { platform: true, images: { orderBy: { sort: "asc" } }, accessories: true },
        orderBy: { publishedAt: "desc" },
        take: 24,
      })
    : [];

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-8">
      <p className="cursor-blink font-mono text-xs text-phosphor">{"// SEARCH"}</p>
      <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
        {query ? `Results for “${query}”` : "Search the shop"}
      </h1>

      <form action="/search" className="mt-6 flex max-w-xl gap-2">
        <input
          name="q"
          defaultValue={query}
          placeholder="Consoles, games, handhelds…"
          className="h-12 flex-1 rounded-sm border border-line bg-panel px-4 text-sm placeholder:text-mist/50 focus:border-phosphor/50 focus:outline-none"
        />
        <button className="h-12 rounded-sm bg-phosphor px-6 text-xs font-bold uppercase tracking-widest text-ink">
          Search
        </button>
      </form>

      {query && results.length === 0 && (
        <div className="mt-12 rounded-surface border border-dashed border-line bg-panel p-12 text-center">
          <p className="pixel-tag text-[9px] text-orange">NO RESULTS</p>
          <p className="mx-auto mt-3 max-w-md text-sm text-mist">
            Nothing matched. Try a console name like “PS2”, “PSP”, or browse{" "}
            <Link href="/shop" className="text-phosphor hover:underline">the full shop</Link>.
          </p>
        </div>
      )}

      {results.length > 0 && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {results.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </main>
  );
}
