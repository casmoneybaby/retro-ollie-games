import Link from "next/link";
import Image from "next/image";
import { site } from "@/lib/site";
import { getFeatured, getServiceTiers } from "@/lib/queries";
import { formatPrice } from "@/lib/utils";
import { ProductCard } from "@/components/product-card";

export const dynamic = "force-dynamic";

const PIPELINE = [
  { key: "FOUND", blurb: "Hunted down on marketplaces & eBay" },
  { key: "OPENED", blurb: "Fully disassembled on the bench" },
  { key: "CLEANED", blurb: "Ultrasonic bath, deep detail, dust gone" },
  { key: "RESTORED", blurb: "New thermal paste, ports, caps & parts" },
  { key: "POWERED ON", blurb: "Burn-in tested for hours, not minutes" },
  { key: "READY TO PLAY", blurb: "Photographed, packed, shipped to you" },
];

const WHAT_WE_DO = [
  {
    tag: "01 / SHOP",
    title: "Restored consoles, ready to play",
    body: "One-of-one consoles, handhelds, games and tech — sourced, fully restored, tested and shipped. Every unit passes a documented Respawn Report before it lists.",
    href: "/shop",
    cta: "Browse the shop",
  },
  {
    tag: "02 / RESPAWN",
    title: "Your console, professionally restored",
    body: "Ship us your PS2, PS3, PSP, Xbox, Game Boy and more. Full teardown, deep clean, new thermal paste, port repair, capacitor work — then it comes back working like it did on day one.",
    href: "/refurbish",
    cta: "Refurbish my console",
  },
  {
    tag: "03 / TRADE",
    title: "Sell or trade your retro gear",
    body: "Got a console collecting dust? Send photos and a description — we'll make a fair cash or trade offer and cover the hassle of marketplace selling.",
    href: "/sell-trade",
    cta: "Get an offer",
  },
];

export default async function Home() {
  const [featured, tiers] = await Promise.all([
    getFeatured(4).catch(() => []),
    getServiceTiers().catch(() => []),
  ]);

  return (
    <main className="flex flex-col">
      {/* ---------- HERO ---------- */}
      <section className="relative overflow-hidden border-b border-line">
        {/* atmosphere */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 50% at 50% 0%, rgba(74,227,130,0.14) 0%, transparent 60%), radial-gradient(40% 40% at 85% 20%, rgba(255,180,84,0.06) 0%, transparent 70%)",
          }}
        />
        <div className="relative mx-auto flex max-w-6xl flex-col items-center px-4 pb-20 pt-20 text-center sm:pt-28">
          <p className="pixel-tag mb-6 inline-flex items-center gap-2 rounded-sm border border-phosphor/30 bg-phosphor/10 px-3 py-2 text-[9px] text-phosphor">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-phosphor" />
            SIGNAL ACQUIRED · WORKSHOP ONLINE
          </p>

          <h1 className="text-balance text-5xl font-black leading-[0.95] tracking-tight sm:text-7xl">
            OLD TECH.
            <br />
            <span className="text-phosphor">NEW LIFE.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-mist sm:text-lg">
            <strong className="text-bone">Retro Ollie Games</strong> rescues forgotten consoles
            from marketplaces and eBay, tears them down to the board, and restores them —
            deep-cleaned, re-pasted, re-flowed, port-repaired and burn-in tested — so you get
            hardware that plays like it did on day one.{" "}
            <strong className="text-bone">Broken console? We restore yours too.</strong>
          </p>

          <div className="mt-10 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
            <Link
              href="/shop"
              className="pixel-tag flex h-14 w-full items-center justify-center rounded-sm bg-phosphor px-8 text-[11px] text-ink transition-all hover:bg-bone sm:w-auto"
            >
              ▶ SHOP WHAT JUST RESPAWNED
            </Link>
            <Link
              href="/refurbish"
              className="pixel-tag flex h-14 w-full items-center justify-center rounded-sm border border-phosphor/50 bg-transparent px-8 text-[11px] text-phosphor transition-all hover:bg-phosphor/10 sm:w-auto"
            >
              REFURBISH MY CONSOLE
            </Link>
          </div>

          <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-widest text-mist">
            <li>✓ Tested &amp; documented</li>
            <li>✓ Secure Stripe checkout</li>
            <li>✓ One-of-one units</li>
            <li>✓ Fast shipping</li>
          </ul>
        </div>
      </section>

      {/* ---------- RESPAWN PIPELINE ---------- */}
      <section aria-label="Restoration process" className="border-b border-line bg-panel">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <p className="pixel-tag mb-8 text-center text-[9px] text-mist">THE RESPAWN PIPELINE</p>
          <ol className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {PIPELINE.map((step, i) => (
              <li
                key={step.key}
                className="group relative rounded-surface border border-line bg-ink p-4 transition-colors hover:border-phosphor/40"
              >
                <span className="font-mono text-[10px] text-phosphor/70">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="pixel-tag mt-2 text-[8px] leading-relaxed text-bone">{step.key}</p>
                <p className="mt-2 text-[11px] leading-snug text-mist">{step.blurb}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- WHAT WE DO ---------- */}
      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <h2 className="text-balance text-3xl font-black tracking-tight sm:text-4xl">
            One workshop. Three ways to play.
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-mist">
            Whether you&apos;re buying restored gear, rescuing your own, or clearing out a closet —
            this is what we do all day, every day.
          </p>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {WHAT_WE_DO.map((card) => (
              <Link
                key={card.tag}
                href={card.href}
                className="group flex flex-col rounded-surface border border-line bg-panel p-6 transition-all hover:-translate-y-1 hover:border-phosphor/40"
              >
                <span className="font-mono text-[10px] tracking-widest text-phosphor">{card.tag}</span>
                <h3 className="mt-3 text-lg font-bold leading-snug">{card.title}</h3>
                <p className="mt-3 flex-1 text-[13px] leading-relaxed text-mist">{card.body}</p>
                <span className="mt-5 font-mono text-[11px] uppercase tracking-widest text-phosphor">
                  {card.cta} →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- FEATURED GEAR ---------- */}
      <section className="border-b border-line bg-panel">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="pixel-tag text-[9px] text-phosphor">FRESH FROM THE BENCH</p>
              <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                Just respawned
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-mist">
                Every unit is one-of-one. When it sells, it&apos;s gone — no restock, no re-run.
              </p>
            </div>
            <Link
              href="/shop"
              className="rounded-sm border border-line px-4 py-2.5 font-mono text-[11px] uppercase tracking-widest text-mist transition-colors hover:border-phosphor/50 hover:text-phosphor"
            >
              View all gear →
            </Link>
          </div>

          {featured.length > 0 ? (
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="mt-10 rounded-surface border border-dashed border-line bg-ink p-10 text-center">
              <p className="pixel-tag text-[9px] text-phosphor">RESTOCK INCOMING</p>
              <p className="mx-auto mt-3 max-w-md text-sm text-mist">
                The bench is full and new units are being tested right now. Get on the restock
                alert list below and you&apos;ll be first to know.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ---------- RESPAWN REPORT ---------- */}
      <section className="border-b border-line">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 lg:grid-cols-2">
          <div>
            <p className="pixel-tag text-[9px] text-phosphor">PROOF OF WORK</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              Every unit ships with a Respawn Report
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-mist">
              No &quot;tested, works&quot; guesswork. Each console gets a documented inspection —
              power, video, drives, ports, buttons, battery health — and you see the exact results
              on the product page before you buy.
            </p>
            <ul className="mt-6 space-y-2 font-mono text-xs text-mist">
              <li><span className="text-phosphor">✓</span> Full teardown &amp; deep clean</li>
              <li><span className="text-phosphor">✓</span> Fresh thermal paste on every restoration</li>
              <li><span className="text-phosphor">✓</span> Port, laser &amp; button service as needed</li>
              <li><span className="text-phosphor">✓</span> Hours of burn-in testing, not minutes</li>
              <li><span className="text-phosphor">✓</span> Known imperfections disclosed up front</li>
            </ul>
          </div>

          {/* terminal-style report card */}
          <div className="overflow-hidden rounded-surface border border-line bg-ink">
            <div className="flex items-center gap-2 border-b border-line bg-panel px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-amber/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-mist/40" />
              <span className="h-2.5 w-2.5 rounded-full bg-phosphor/70" />
              <span className="ml-2 font-mono text-[10px] uppercase tracking-widest text-mist">
                respawn_report.txt
              </span>
            </div>
            <pre className="overflow-x-auto p-5 font-mono text-[11px] leading-relaxed text-mist">
{`UNIT      PS3 Super Slim CECH-4201
GRADE     RESTORED · COSMETIC B+
FANS      ▮▮▮▮▮ clean, repasted (Arctic MX-4)
THERMALS  ▮▮▮▮▮ 61°C sustained, 2h burn-in
DISC      ▮▮▮▮▮ reads PS1/PS3 media
PORTS     ▮▮▮▮▯ HDMI replaced, USB x2 OK
NETWORK   ▮▮▮▮▮ Wi-Fi + LAN verified
BLU-RAY   ▮▮▮▮▮ firmware 4.91
DEFECTS   hairline scuff on lid — see photo 4
STATUS    READY TO PLAY`}
            </pre>
          </div>
        </div>
      </section>

      {/* ---------- REFURB SERVICE TEASER ---------- */}
      <section className="border-b border-line bg-panel">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <div className="text-center">
            <p className="pixel-tag text-[9px] text-phosphor">RESPAWN SERVICE</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              Your console. Second life. Guaranteed work.
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-mist">
              Yellowing shell? Overheating? Dead ports? Disc drive won&apos;t read? Ship it to the
              workshop and we&apos;ll bring it back — you&apos;ll get status updates at every stage
              of the pipeline.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(tiers.length > 0
              ? tiers.slice(0, 3).map((t) => ({
                  name: t.name,
                  desc: t.description,
                  price: formatPrice(t.priceCents),
                }))
              : [
                  {
                    name: "Deep Clean & Service",
                    desc: "Full teardown, ultrasonic clean, new thermal paste, fan service, outside port check.",
                    price: "from $59",
                  },
                  {
                    name: "Console Respawn",
                    desc: "Everything in Deep Clean plus thermal, capacitor and laser work, minor port repair, full burn-in.",
                    price: "from $99",
                  },
                  {
                    name: "Full Restoration",
                    desc: "Complete ground-up rebuild: parts replacement, port rework, shell de-yellowing, cosmetic restoration.",
                    price: "custom quote",
                  },
                ]
            ).map((tier) => (
              <div key={tier.name} className="flex flex-col rounded-surface border border-line bg-ink p-6">
                <h3 className="text-base font-bold">{tier.name}</h3>
                <p className="mt-2 flex-1 text-[13px] leading-relaxed text-mist">{tier.desc}</p>
                <p className="mt-4 font-mono text-sm font-bold text-phosphor">{tier.price}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/refurbish"
              className="pixel-tag inline-flex h-14 items-center justify-center rounded-sm border border-phosphor/50 px-8 text-[11px] text-phosphor transition-colors hover:bg-phosphor/10"
            >
              START A RESPAWN REQUEST
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- TRADE CTA ---------- */}
      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <div className="relative overflow-hidden rounded-surface border border-phosphor/25 bg-gradient-to-br from-panel-2 to-ink p-10 text-center sm:p-14">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(50% 60% at 50% 110%, rgba(74,227,130,0.12) 0%, transparent 70%)",
              }}
            />
            <h2 className="relative text-balance text-3xl font-black tracking-tight sm:text-4xl">
              Got gear gathering dust?
            </h2>
            <p className="relative mx-auto mt-3 max-w-lg text-sm leading-relaxed text-mist">
              Consoles, handhelds, games, controllers, accessories. Send photos and we&apos;ll send
              back a fair cash or trade offer — usually within 24 hours.
            </p>
            <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/sell-trade"
                className="pixel-tag flex h-12 items-center justify-center rounded-sm bg-phosphor px-7 text-[10px] text-ink transition-colors hover:bg-bone"
              >
                SELL / TRADE MY GEAR
              </Link>
              <a
                href={`mailto:${site.email}`}
                className="font-mono text-[11px] uppercase tracking-widest text-mist transition-colors hover:text-phosphor"
              >
                or email {site.email}
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
