import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { setProductStatusAction } from "@/app/actions/admin";
import { ProductStatus } from "@/generated/prisma/enums";

export const dynamic = "force-dynamic";

const STATUS_TONE: Record<string, string> = {
  DRAFT: "text-mist border-line bg-panel-2",
  AVAILABLE: "text-phosphor border-phosphor/40 bg-phosphor/10",
  RESERVED: "text-amber border-amber/40 bg-amber/10",
  SOLD: "text-mist border-line bg-ink",
};

export default async function AdminProductsPage() {
  const products = await db.product.findMany({
    include: { platform: true, images: { orderBy: { sort: "asc" }, take: 1 } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-black tracking-tight">Products ({products.length})</h1>
        <Link
          href="/admin/products/new"
          className="rounded-sm bg-phosphor px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-ink hover:bg-bone"
        >
          + Add product
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="mt-6 rounded-surface border border-dashed border-line bg-panel p-10 text-center text-sm text-mist">
          No products yet. Add your first unit — it only publishes when you set status to
          AVAILABLE.
        </p>
      ) : (
        <ul className="mt-6 space-y-2">
          {products.map((p) => (
            <li
              key={p.id}
              className="flex flex-wrap items-center gap-4 rounded-surface border border-line bg-panel p-3"
            >
              <div className="relative h-14 w-16 shrink-0 overflow-hidden rounded-sm bg-panel-2">
                {p.images[0] ? (
                  <Image src={p.images[0].url} alt="" fill sizes="64px" className="object-cover" />
                ) : (
                  <span className="pixel-tag flex h-full items-center justify-center text-[7px] text-mist/40">ROG</span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold">{p.name}</p>
                <p className="font-mono text-[10px] uppercase tracking-widest text-mist">
                  {p.platform.name} · {p.inventoryId} · {formatPrice(p.priceCents)} · qty {p.quantity}
                  {p.featured ? " · ★ featured" : ""}
                </p>
              </div>

              <span className={`pixel-tag rounded-sm border px-2 py-1 text-[8px] ${STATUS_TONE[p.status] ?? ""}`}>
                {p.status}
              </span>

              <div className="flex items-center gap-1.5">
                {p.status !== ProductStatus.AVAILABLE && p.quantity > 0 && (
                  <form action={setProductStatusAction}>
                    <input type="hidden" name="id" value={p.id} />
                    <input type="hidden" name="status" value="AVAILABLE" />
                    <button className="rounded-sm border border-phosphor/40 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-widest text-phosphor hover:bg-phosphor/10">
                      Publish
                    </button>
                  </form>
                )}
                {p.status === ProductStatus.AVAILABLE && (
                  <form action={setProductStatusAction}>
                    <input type="hidden" name="id" value={p.id} />
                    <input type="hidden" name="status" value="DRAFT" />
                    <button className="rounded-sm border border-line px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-widest text-mist hover:text-bone">
                      Unpublish
                    </button>
                  </form>
                )}
                {p.status !== ProductStatus.SOLD && (
                  <form action={setProductStatusAction}>
                    <input type="hidden" name="id" value={p.id} />
                    <input type="hidden" name="status" value="SOLD" />
                    <button className="rounded-sm border border-line px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-widest text-mist hover:text-amber">
                      Mark sold
                    </button>
                  </form>
                )}
                <Link
                  href={`/admin/products/${p.id}`}
                  className="rounded-sm border border-line px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-widest text-mist hover:text-phosphor"
                >
                  Edit
                </Link>
                <Link
                  href={`/shop/${p.slug}`}
                  className="rounded-sm border border-line px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-widest text-mist hover:text-phosphor"
                >
                  View
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
