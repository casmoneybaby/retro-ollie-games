import Link from "next/link";
import Image from "next/image";

/**
 * SHOP BY SYSTEM category card. Uses an admin-managed imageUrl when set;
 * otherwise falls back to a clean generated-look gradient tile with the
 * system name (never a scraped copyrighted image).
 */
export function CategoryCard({
  name,
  slug,
  blurb,
  imageUrl,
}: {
  name: string;
  slug: string;
  blurb: string | null;
  imageUrl: string | null;
}) {
  return (
    <Link
      href={`/shop?platform=${slug}`}
      className="card-glow group relative flex aspect-[5/4] flex-col justify-end overflow-hidden rounded-surface border border-line bg-panel p-4"
    >
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover opacity-80 transition-transform duration-500 group-hover:scale-[1.05]"
        />
      ) : (
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 90% at 80% 0%, rgba(62,242,166,0.12) 0%, transparent 55%), radial-gradient(100% 80% at 10% 100%, rgba(56,201,245,0.08) 0%, transparent 60%)",
          }}
        />
      )}
      <div className="relative flex items-end justify-between gap-2">
        <div>
          <p className="text-sm font-bold tracking-wide text-bone">{name.toUpperCase()}</p>
          {blurb && <p className="mt-0.5 line-clamp-1 font-mono text-[10px] text-mist">{blurb}</p>}
        </div>
        <span aria-hidden className="text-phosphor transition-transform group-hover:translate-x-1">
          →
        </span>
      </div>
    </Link>
  );
}
