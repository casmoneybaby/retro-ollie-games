import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { ConditionBadge, StockBadge } from "./badges";
import type { StorefrontProduct } from "@/lib/queries";

export function ProductCard({ product }: { product: StorefrontProduct }) {
  const cover = product.images[0];
  const img = cover?.url ?? null;
  const isSold = product.status === "SOLD";
  const isReserved = product.status === "RESERVED";
  const dimmed = isSold || isReserved;

  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-surface border border-line bg-panel transition-all duration-200 hover:-translate-y-1 hover:border-phosphor/40 hover:shadow-[0_8px_30px_-12px_rgba(74,227,130,0.25)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-panel-2">
        {img ? (
          <Image
            src={img}
            alt={cover.alt ?? product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className={dimmed ? "object-cover opacity-60 grayscale" : "object-cover transition-transform duration-500 group-hover:scale-[1.03]"}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="pixel-tag text-[10px] text-mist/40">NO PHOTO YET</span>
          </div>
        )}
        <div className="absolute left-2 top-2 flex gap-1.5">
          <ConditionBadge condition={product.condition} />
        </div>
        {dimmed && (
          <span className="pixel-tag absolute right-2 top-2 rounded-sm bg-ink/80 px-2 py-1 text-[8px] text-amber">
            {isSold ? "SOLD" : "RESERVED"}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <span className="font-mono text-[10px] uppercase tracking-widest text-phosphor">
          {product.platform.name}
        </span>
        <h3 className="text-sm font-bold leading-snug text-bone">{product.name}</h3>
        {product.defectNotes && (
          <p className="line-clamp-1 text-[11px] text-mist">{product.defectNotes}</p>
        )}
        <div className="mt-auto flex items-end justify-between pt-2">
          <div>
            <p className="font-mono text-lg font-bold text-bone">
              {formatPrice(product.priceCents)}
            </p>
            {product.compareAtCents && (
              <p className="font-mono text-[11px] text-mist line-through">
                {formatPrice(product.compareAtCents)}
              </p>
            )}
          </div>
          {product.status === "AVAILABLE" && <StockBadge quantity={product.quantity} status={product.status} />}
        </div>
      </div>
    </Link>
  );
}
