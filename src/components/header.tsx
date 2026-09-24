"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { NAV_LINKS } from "@/lib/site";
import { readCart, subscribe } from "@/lib/cart";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [count, setCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const sync = () => setCount(readCart().length);
    sync();
    return subscribe(sync);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname, searchParams]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    const base = href.split("?")[0];
    if (href.includes("?platform=")) {
      return pathname === "/shop" && searchParams.get("platform") === href.split("platform=")[1];
    }
    return pathname === base || pathname.startsWith(base + "/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-ink/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label="Retro Ollie Games home">
          <span className="pixel-tag flex h-9 w-9 items-center justify-center rounded-sm bg-phosphor text-[10px] text-ink">
            RO
          </span>
          <span className="hidden flex-col leading-tight sm:flex">
            <span className="text-[13px] font-bold tracking-[0.18em]">RETRO OLLIE GAMES</span>
            <span className="pixel-tag text-[6px] text-phosphor">OLD TECH. NEW LIFE.</span>
          </span>
        </Link>

        {/* Center nav */}
        <nav className="mx-auto hidden items-center gap-1 lg:flex" aria-label="Main">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={cn(
                "relative px-3 py-2 text-[13px] font-medium text-mist transition-colors hover:text-bone",
                isActive(link.href) && "text-bone"
              )}
            >
              {link.label}
              <span
                className={cn(
                  "absolute inset-x-3 bottom-0 h-0.5 bg-phosphor transition-opacity",
                  isActive(link.href) ? "opacity-100" : "opacity-0"
                )}
              />
            </Link>
          ))}
        </nav>

        {/* Right cluster */}
        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <button
            type="button"
            aria-label="Search"
            onClick={() => setSearchOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-sm text-mist transition-colors hover:bg-panel hover:text-bone"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
          </button>

          <Link
            href="/admin/login"
            aria-label="Account"
            className="flex h-9 w-9 items-center justify-center rounded-sm text-mist transition-colors hover:bg-panel hover:text-bone"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5" />
            </svg>
          </Link>

          <Link
            href="/cart"
            aria-label={`Cart, ${count} item${count === 1 ? "" : "s"}`}
            className="relative flex h-9 w-9 items-center justify-center rounded-sm text-mist transition-colors hover:bg-panel hover:text-bone"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6h15l-1.5 9h-12z" />
              <circle cx="9" cy="20" r="1.5" />
              <circle cx="18" cy="20" r="1.5" />
              <path d="M6 6L5 3H2" />
            </svg>
            {count > 0 && (
              <span className="pixel-tag absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-sm bg-phosphor px-1 text-[7px] text-ink">
                {count}
              </span>
            )}
          </Link>

          <button
            type="button"
            aria-label="Menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-sm text-mist transition-colors hover:bg-panel hover:text-bone lg:hidden"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {menuOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Search bar */}
      {searchOpen && (
        <div className="border-t border-line bg-panel">
          <form action="/search" className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-3">
            <input
              name="q"
              autoFocus
              placeholder="Search consoles, games, handhelds…"
              className="h-10 flex-1 rounded-sm border border-line bg-ink px-3 text-sm placeholder:text-mist/50 focus:border-phosphor/50 focus:outline-none"
            />
            <button className="h-10 rounded-sm bg-phosphor px-4 text-xs font-bold uppercase tracking-widest text-ink">
              Search
            </button>
          </form>
        </div>
      )}

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="border-t border-line bg-panel lg:hidden" aria-label="Mobile">
          <div className="mx-auto flex max-w-7xl flex-col px-4 py-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  "rounded-sm px-3 py-3 text-sm font-medium text-mist transition-colors hover:bg-panel-2 hover:text-bone",
                  isActive(link.href) && "text-phosphor"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
