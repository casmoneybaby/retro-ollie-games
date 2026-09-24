import Link from "next/link";
import { site, FOOTER_LINKS } from "@/lib/site";
import { EmailSignup } from "./email-signup";

const SOCIALS = [
  { label: "eBay", href: "https://www.ebay.com" },
  { label: "Instagram", href: "https://www.instagram.com" },
  { label: "TikTok", href: "https://www.tiktok.com" },
  { label: "YouTube", href: "https://www.youtube.com" },
];

export function Footer() {
  return (
    <footer className="border-t border-line bg-panel">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-10 md:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="pixel-tag flex h-9 w-9 items-center justify-center rounded-sm bg-phosphor text-[10px] text-ink">
                RO
              </span>
              <span className="text-sm font-bold tracking-[0.18em]">RETRO OLLIE GAMES</span>
            </div>
            <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-mist">{site.description}</p>
            <p className="pixel-tag mt-5 text-[7px] text-phosphor">{site.footerTagline}</p>
          </div>

          <nav aria-label="Footer shop">
            <h3 className="pixel-tag text-[8px] text-phosphor">SHOP</h3>
            <ul className="mt-4 space-y-2.5">
              {FOOTER_LINKS.slice(0, 5).map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-[13px] text-mist transition-colors hover:text-phosphor">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Footer support">
            <h3 className="pixel-tag text-[8px] text-phosphor">SUPPORT</h3>
            <ul className="mt-4 space-y-2.5">
              {FOOTER_LINKS.slice(5).map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-[13px] text-mist transition-colors hover:text-phosphor">
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/respawn-log" className="text-[13px] text-mist transition-colors hover:text-phosphor">
                  Track a repair
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <h3 className="pixel-tag text-[8px] text-phosphor">RESTOCK ALERTS</h3>
            <p className="mt-4 text-[13px] leading-relaxed text-mist">
              One-of-one consoles sell fast. Get pinged the moment new gear respawns.
            </p>
            <EmailSignup />
            <div className="mt-6 flex flex-wrap gap-3">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-sm border border-line px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-widest text-mist transition-colors hover:border-phosphor/40 hover:text-phosphor"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-line pt-6 text-[11px] text-mist sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
          <p className="font-mono">Payments secured by Stripe · Ships from the USA</p>
        </div>
      </div>
    </footer>
  );
}
