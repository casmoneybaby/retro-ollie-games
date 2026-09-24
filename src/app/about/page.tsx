import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About the Workshop",
  description:
    "Retro Ollie Games rescues and restores retro gaming hardware — one console at a time, at a real workbench, with documented testing.",
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <p className="pixel-tag text-[9px] text-phosphor">THE WORKSHOP</p>
      <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">
        Old tech. New life.
      </h1>

      <div className="mt-8 space-y-5 text-sm leading-relaxed text-mist">
        <p>
          <strong className="text-bone">Retro Ollie Games</strong> started at a single workbench
          with a simple frustration: the consoles we grew up with were ending up in drawers,
          landfills, and overpriced &quot;untested&quot; listings.
        </p>
        <p>
          So we do it differently. Every console we sell was hunted down on marketplaces and
          eBay, torn down to the board, deep-cleaned, re-pasted, repaired where it needed it, and
          burn-in tested for hours. Every unit ships with its{" "}
          <strong className="text-bone">Respawn Report</strong> — the actual test results, not
          marketing fluff.
        </p>
        <p>
          And because we hate seeing good hardware die, we also run the{" "}
          <Link href="/refurbish" className="text-phosphor hover:underline">Respawn Service</Link>:
          send us your ailing console and we&apos;ll bring it back — with status updates at every
          stage, from your shelf to ours and home again.
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
          <div key={s.label} className="rounded-surface border border-line bg-panel p-5 text-center">
            <p className="font-mono text-2xl font-black text-phosphor">{s.stat}</p>
            <p className="mt-1 text-xs text-mist">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/shop" className="pixel-tag flex h-12 items-center rounded-sm bg-phosphor px-6 text-[10px] text-ink">
          ▶ SHOP RESTORED GEAR
        </Link>
        <Link href="/refurbish" className="pixel-tag flex h-12 items-center rounded-sm border border-phosphor/50 px-6 text-[10px] text-phosphor">
          REFURBISH MY CONSOLE
        </Link>
      </div>
    </main>
  );
}
