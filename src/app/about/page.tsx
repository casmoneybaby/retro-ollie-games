import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About the Workshop",
  description:
    "Retro Ollie Games is an independent online refurb store — we buy, clean, test and refurbish gaming hardware so it gets played again instead of thrown away.",
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <p className="cursor-blink font-mono text-xs text-phosphor">{"// THE WORKSHOP"}</p>
      <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">
        Old tech. <span className="text-phosphor">New life.</span>
      </h1>

      <div className="mt-8 space-y-5 text-sm leading-relaxed text-mist">
        <p>
          <strong className="text-bone">Retro Ollie Games</strong> is an independent online
          refurb store. We hunt down consoles, games and electronics on marketplaces and eBay,
          tear them down to the board, and restore them — deep-cleaned, re-pasted,
          port-repaired and burn-in tested — so you get hardware that plays like it did on day
          one.
        </p>
        <p>
          Every unit we sell ships with its <strong className="text-bone">Respawn Report</strong>{" "}
          — the documented test results from our bench, not marketing fluff. Most consoles are
          one-of-one: when it sells, it&apos;s gone.
        </p>
        <p>
          Got a console that&apos;s seen better days? Our{" "}
          <Link href="/refurbishment" className="text-phosphor hover:underline">
            Refurbishment Service
          </Link>{" "}
          brings your own hardware back — full teardown, professional cleaning, thermal
          maintenance, repairs where needed, with status updates at every stage. And if
          you&apos;re sitting on gear you never touch,{" "}
          <Link href="/sell-trade" className="text-phosphor hover:underline">
            we&apos;ll buy or trade for it
          </Link>
          .
        </p>
        <p className="font-mono text-xs text-mist/80">
          Questions? <a href={`mailto:${site.email}`} className="text-phosphor hover:underline">{site.email}</a>
        </p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {[
          { stat: "100%", label: "Teardown & deep clean" },
          { stat: "Hours", label: "Burn-in testing, not minutes" },
          { stat: "1-of-1", label: "Every unit is the unit" },
        ].map((s) => (
          <div key={s.label} className="card-glow rounded-surface border border-line bg-panel p-5 text-center">
            <p className="font-mono text-2xl font-black text-phosphor">{s.stat}</p>
            <p className="mt-1 text-xs text-mist">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/shop" className="flex h-12 items-center rounded-sm bg-phosphor px-6 text-[13px] font-bold text-ink transition-colors hover:bg-bone">
          SHOP CONSOLES &amp; GAMES →
        </Link>
        <Link href="/refurbishment" className="flex h-12 items-center rounded-sm border border-line bg-panel px-6 text-[13px] font-bold text-bone transition-colors hover:border-phosphor/40 hover:text-phosphor">
          REFURBISH MY CONSOLE →
        </Link>
      </div>
    </main>
  );
}
