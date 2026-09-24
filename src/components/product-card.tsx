import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { ConditionBadge } from "./badges";
import { QuickAddButton } from "./quick-add-button";
import type { StorefrontProduct } from "@/lib/queries";

export function ProductCard({ product }: { product: StorefrontProduct }) {
  const cover = product.images[0];
  const img = cover?.url ?? null;
  const isSold = product.status === "SOLD";
  const isReserved = product.status === "RESERVED";
  const dimmed = isSold || isReserved;

  return (
    <div className="card-glow group relative flex flex-col overflow-hidden rounded-surface border border-line bg-panel">
      <Link href={`/shop/${product.slug}`} className="relative block aspect-[4/3] overflow-hidden bg-panel-2">
        {img ? (
          <Image
            src={img}
            alt={cover.alt ?? product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className={dimmed ? "object-cover opacity-60 grayscale" : "object-cover transition-transform duration-500 group-hover:scale-[1.04]"}
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-[repeating-linear-gradient(45deg,transparent_0_14px,rgba(255,255,255,0.015)_14px_28px)]">
            <span className="pixel-tag text-[8px] text-mist/40">PHOTO</span>
            <span className="pixel-tag text-[8px] text-mist/40">INCOMING</span>
          </div>
        )}
        <div className="absolute left-2.5 top-2.5">
          <ConditionBadge condition={product.condition} />
        </div>
        {dimmed && (
          <span className="pixel-tag absolute right-2.5 top-2.5 rounded-sm bg-ink/85 px-2 py-1 text-[7px] text-orange">
            {isSold ? "SOLD" : "RESERVED"}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <Link href={`/shop/${product.slug}`} className="line-clamp-1 text-[13px] font-semibold text-bone transition-colors hover:text-phosphor">
          {product.name}
        </Link>
        <p className="font-mono text-[10px] uppercase tracking-widest text-mist">
          {product.platform.name}
          {product.storage ? ` · ${product.storage}` : ""}
        </p>
        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <div>
            <p className="font-mono text-lg font-bold text-bone">{formatPrice(product.priceCents)}</p>
            {product.compareAtCents && (
              <p className="font-mono text-[11px] text-mist line-through">{formatPrice(product.compareAtCents)}</p>
            )}
          </div>
          {product.status === "AVAILABLE" && <QuickAddButton product={product} />}
        </div>
      </div>
    </div>
  );
}
