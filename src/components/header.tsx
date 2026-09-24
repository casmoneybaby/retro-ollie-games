import Link from "next/link";
import { site, NAV_LINKS } from "@/lib/site";
import { CartButton } from "./cart-button";
import { cn } from "@/lib/utils";

export function Header({ active }: { active?: string }) {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-ink/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="pixel-tag flex h-8 w-8 items-center justify-center rounded-sm bg-phosphor text-[10px] text-ink transition-transform group-hover:-translate-y-0.5">
            RO
          </span>
          <span className="hidden flex-col leading-tight sm:flex">
            <span className="text-sm font-bold tracking-widest">RETRO OLLIE GAMES</span>
            <span className="text-[9px] font-semibold tracking-[0.3em] text-phosphor">{site.tagline}</span>
          </span>
        </Link>

        <nav className="ml-auto hidden items-center gap-1 md:flex" aria-label="Main">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-sm px-3 py-2 text-xs font-semibold uppercase tracking-widest text-mist transition-colors hover:bg-panel-2 hover:text-bone",
                active === link.href && "bg-panel-2 text-phosphor"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3 md:ml-0">
          <Link
            href="/refurbish"
            className="hidden h-9 items-center rounded-sm bg-phosphor px-3 text-xs font-bold uppercase tracking-widest text-ink transition-colors hover:bg-phosphor-dim lg:flex"
          >
            Refurb my console
          </Link>
          <CartButton />
        </div>
      </div>

      {/* Mobile nav row */}
      <nav
        className="flex items-center gap-1 overflow-x-auto border-t border-line px-4 py-2 md:hidden"
        aria-label="Mobile"
      >
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "whitespace-nowrap rounded-sm px-3 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-mist",
              active === link.href && "text-phosphor"
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
