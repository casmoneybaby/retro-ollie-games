import Link from "next/link";
import { site, NAV_LINKS, PLATFORM_NAV } from "@/lib/site";
import { EmailSignup } from "./email-signup";

export function Footer() {
  return (
    <footer className="border-t border-line bg-panel">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr_1fr_1.4fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="pixel-tag flex h-8 w-8 items-center justify-center rounded-sm bg-phosphor text-[10px] text-ink">
                RO
              </span>
              <span className="text-sm font-bold tracking-widest">RETRO OLLIE GAMES</span>
            </div>
            <p className="mt-3 max-w-xs text-xs leading-relaxed text-mist">
              {site.subline} Sourced from marketplaces and eBay, restored at the workbench, shipped ready to play.
            </p>
            <p className="pixel-tag mt-4 text-[9px] text-phosphor">{site.tagline}</p>
          </div>

          <nav aria-label="Footer shop">
            <h3 className="text-xs font-bold uppercase tracking-widest text-bone">Shop</h3>
            <ul className="mt-3 space-y-2">
              {PLATFORM_NAV.slice(0, 6).map((p) => (
                <li key={p.slug}>
                  <Link href={`/shop?platform=${p.slug}`} className="text-xs text-mist transition-colors hover:text-phosphor">
                    {p.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Footer company">
            <h3 className="text-xs font-bold uppercase tracking-widest text-bone">Company</h3>
            <ul className="mt-3 space-y-2">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-xs text-mist transition-colors hover:text-phosphor">
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/admin/login" className="text-xs text-mist/50 transition-colors hover:text-mist">
                  Control Center
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-bone">Restock alerts</h3>
            <p className="mt-3 text-xs leading-relaxed text-mist">
              One-of-one consoles sell fast. Get pinged the moment new gear respawns.
            </p>
            <EmailSignup />
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-line pt-6 text-[11px] text-mist sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
          <p className="font-mono">Payments secured by Stripe · Ships from the USA</p>
        </div>
      </div>
    </footer>
  );
}
