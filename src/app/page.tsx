import Link from "next/link";
import Image from "next/image";
import { DEFAULT_REFURB_CHECKLIST, PLATFORM_NAV } from "@/lib/site";
import { getPlatforms, getSiteSettingJSON, getFeatured } from "@/lib/queries";
import { ProductCard } from "@/components/product-card";
import { TrustStrip } from "@/components/trust-strip";
import { CategoryCard } from "@/components/category-card";
import { EmailSignup } from "@/components/email-signup";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [platforms, featured, checklist] = await Promise.all([
    getPlatforms().catch(() => []),
    getFeatured(4).catch(() => []),
    getSiteSettingJSON("refurb_checklist", DEFAULT_REFURB_CHECKLIST),
  ]);

  const categoryCards = platforms
    .filter((p) => PLATFORM_NAV.some((n) => n.slug === p.slug))
    .slice(0, 8);

  return (
    <main className="flex flex-col">
      {/* ================= HERO — 45/55 split ================= */}
      <section className="relative border-b border-line bg-ink">
        <div className="mx-auto grid max-w-7xl items-stretch gap-0 lg:grid-cols-[45fr_55fr]">
          {/* LEFT — text */}
          <div className="relative z-10 flex flex-col justify-center px-4 py-16 sm:px-8 lg:py-24">
            <p className="cursor-blink font-mono text-xs tracking-wide text-phosphor">
              {"// WELCOME TO RETRO OLLIE GAMES"}
            </p>
            <h1 className="mt-6 font-black leading-[0.95] tracking-tight">
              <span className="block text-5xl text-bone sm:text-6xl lg:text-7xl">OLD TECH.</span>
              <span className="block text-5xl text-phosphor sm:text-6xl lg:text-7xl">NEW LIFE.</span>
            </h1>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-mist">
              We buy, clean, test and refurbish gaming consoles, games and electronics — giving
              great hardware a second chance to be played, collected and enjoyed.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/shop"
                className="flex h-13 items-center justify-center gap-2 rounded-sm bg-phosphor px-7 py-4 text-[13px] font-bold tracking-wide text-ink transition-colors hover:bg-bone"
              >
                SHOP CONSOLES &amp; GAMES <span aria-hidden>→</span>
              </Link>
              <Link
                href="/refurbishment"
                className="flex h-13 items-center justify-center gap-2 rounded-sm border border-line bg-panel px-7 py-4 text-[13px] font-bold tracking-wide text-bone transition-colors hover:border-phosphor/40 hover:text-phosphor"
              >
                REFURBISH MY CONSOLE <span aria-hidden>→</span>
              </Link>
            </div>
            <p className="mt-8 font-mono text-[11px] uppercase tracking-widest text-mist/70">
              Buy · Sell · Trade · Refurbish — an independent gaming store
            </p>
          </div>

          {/* RIGHT — hero image */}
          <div className="relative min-h-[320px] overflow-hidden lg:min-h-[560px]">
            <Image
              src="/images/hero-room.jpg"
              alt="A restored retro gaming room: CRT television, classic consoles, controllers and shelves of games in warm ambient light"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="crt-flicker object-cover"
            />
            {/* blend edges into the dark text panel + slight bottom vignette */}
            <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-ink/70 via-ink/20 to-transparent lg:from-ink/80" />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
          </div>
        </div>
      </section>

      {/* ================= TRUST STRIP ================= */}
      <TrustStrip />

      {/* ================= SHOP BY SYSTEM ================= */}
      <section className="border-b border-line">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="cursor-blink font-mono text-xs text-phosphor">{"// PICK YOUR POISON"}</p>
              <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">SHOP BY SYSTEM</h2>
            </div>
            <Link href="/shop" className="font-mono text-xs uppercase tracking-widest text-mist transition-colors hover:text-phosphor">
              View all →
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {categoryCards.map((p) => (
              <CategoryCard key={p.id} name={p.name} slug={p.slug} blurb={p.blurb} imageUrl={p.imageUrl} />
            ))}
          </div>
        </div>
      </section>

      {/* ================= JUST RESPAWNED ================= */}
      <section className="border-b border-line bg-panel/40">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="cursor-blink font-mono text-xs text-phosphor">{"// FRESH OFF THE BENCH"}</p>
              <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">JUST RESPAWNED</h2>
              <p className="mt-2 max-w-xl text-sm text-mist">
                Real inventory, one-of-one units. When it sells, it&apos;s gone.
              </p>
            </div>
            <Link href="/shop" className="font-mono text-xs uppercase tracking-widest text-mist transition-colors hover:text-phosphor">
              Shop everything →
            </Link>
          </div>

          {featured.length > 0 ? (
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-surface border border-dashed border-line bg-panel p-12 text-center">
              <p className="pixel-tag text-[9px] text-phosphor">RESTOCK INCOMING</p>
              <p className="mx-auto mt-3 max-w-md text-sm text-mist">
                The bench is full and new units are being tested right now. Join the restock
                alerts below to be first in line.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ================= REFURBISHMENT PANEL ================= */}
      <section className="border-b border-line">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-8">
          <div className="card-glow overflow-hidden rounded-surface border border-line bg-panel">
            <div className="grid gap-0 lg:grid-cols-[1.1fr_1fr_0.9fr]">
              {/* LEFT — pitch */}
              <div className="flex flex-col justify-center p-8 sm:p-10">
                {/* pixel wrench icon */}
                <div className="pixel-tag flex h-12 w-12 items-center justify-center rounded-sm border border-phosphor/40 bg-phosphor/10 text-lg text-phosphor">
                  ⚒
                </div>
                <h2 className="mt-6 text-2xl font-black leading-tight tracking-tight sm:text-3xl">
                  CONSOLE &amp; COMPUTER
                  <br />
                  <span className="text-phosphor">REFURBISHMENT SERVICE</span>
                </h2>
                <p className="mt-4 max-w-sm text-sm leading-relaxed text-mist">
                  Send in your PlayStation, Xbox, Nintendo, or computer and get it professionally
                  cleaned, tested, and refurbished.
                </p>
                <Link
                  href="/refurbishment"
                  className="mt-7 inline-flex h-12 w-fit items-center gap-2 rounded-sm bg-phosphor px-6 text-[13px] font-bold text-ink transition-colors hover:bg-bone"
                >
                  GET A REFURBISHMENT QUOTE <span aria-hidden>→</span>
                </Link>
              </div>

              {/* CENTER — before/after */}
              <div className="relative flex items-center justify-center gap-3 border-y border-line bg-ink/60 p-8 lg:border-x lg:border-y-0">
                <div className="flex-1 text-center">
                  <div className="relative mx-auto aspect-square w-full max-w-40 overflow-hidden rounded-sm border border-line bg-panel-2">
                    <Image
                      src="/images/refurb-before.svg"
                      alt="A dusty console before refurbishment"
                      fill
                      sizes="200px"
                      className="object-cover opacity-80 saturate-50"
                    />
                  </div>
                  <p className="pixel-tag mt-3 text-[7px] text-orange">BEFORE</p>
                </div>
                <span aria-hidden className="pixel-tag text-sm text-phosphor">▶</span>
                <div className="flex-1 text-center">
                  <div className="relative mx-auto aspect-square w-full max-w-40 overflow-hidden rounded-sm border border-phosphor/30 bg-panel-2">
                    <Image
                      src="/images/refurb-after.svg"
                      alt="The same console after professional restoration"
                      fill
                      sizes="200px"
                      className="object-cover"
                    />
                  </div>
                  <p className="pixel-tag mt-3 text-[7px] text-phosphor">AFTER</p>
                </div>
              </div>

              {/* RIGHT — admin-configurable checklist */}
              <div className="flex flex-col justify-center p-8 sm:p-10">
                <h3 className="pixel-tag text-[8px] text-mist">WHAT EVERY JOB INCLUDES</h3>
                <ul className="mt-4 space-y-2.5">
                  {checklist.map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-[13px] text-bone">
                      <span aria-hidden className="text-phosphor">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= LOWER THREE PANELS ================= */}
      <section className="border-b border-line">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-16 sm:px-8 lg:grid-cols-3">
          {/* BUY SELL TRADE — purple */}
          <div className="card-glow flex flex-col rounded-surface border border-purple/25 bg-panel p-7">
            <span className="pixel-tag w-fit rounded-sm border border-purple/40 bg-purple/10 px-2 py-1 text-[7px] text-purple">
              BUY · SELL · TRADE
            </span>
            <h3 className="mt-5 text-xl font-black tracking-tight">Got gear? Turn it into store credit or cash.</h3>
            <p className="mt-3 flex-1 text-[13px] leading-relaxed text-mist">
              We buy consoles, games, handhelds and accessories — working or not. Fair offers,
              no marketplace hassle, usually within 24 hours.
            </p>
            <Link
              href="/sell-trade"
              className="mt-6 inline-flex h-11 w-fit items-center gap-2 rounded-sm border border-purple/50 px-5 text-xs font-bold uppercase tracking-widest text-purple transition-colors hover:bg-purple/10"
            >
              GET A TRADE ESTIMATE <span aria-hidden>→</span>
            </Link>
          </div>

          {/* OUR MISSION — cyan */}
          <div className="card-glow flex flex-col rounded-surface border border-cyan/25 bg-panel p-7">
            <span className="pixel-tag w-fit rounded-sm border border-cyan/40 bg-cyan/10 px-2 py-1 text-[7px] text-cyan">
              OUR MISSION
            </span>
            <h3 className="mt-5 text-xl font-black tracking-tight">Keep great hardware alive.</h3>
            <p className="mt-3 flex-1 text-[13px] leading-relaxed text-mist">
              Retro Ollie Games exists to keep worthwhile gaming hardware out of landfills and in
              the hands of people who want to play and collect it.
            </p>
            <Link
              href="/about"
              className="mt-6 inline-flex h-11 w-fit items-center gap-2 rounded-sm border border-cyan/50 px-5 text-xs font-bold uppercase tracking-widest text-cyan transition-colors hover:bg-cyan/10"
            >
              LEARN MORE <span aria-hidden>→</span>
            </Link>
          </div>

          {/* JOIN THE COMMUNITY — orange */}
          <div className="card-glow flex flex-col rounded-surface border border-orange/25 bg-panel p-7">
            <span className="pixel-tag w-fit rounded-sm border border-orange/40 bg-orange/10 px-2 py-1 text-[7px] text-orange">
              JOIN THE COMMUNITY
            </span>
            <h3 className="mt-5 text-xl font-black tracking-tight">Restock alerts &amp; fresh drops.</h3>
            <p className="mt-3 flex-1 text-[13px] leading-relaxed text-mist">
              One-of-one units move fast. Subscribers hear first when new gear hits the shelf.
            </p>
            <div className="mt-6">
              <EmailSignup />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
