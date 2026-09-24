import type { Metadata } from "next";
import { getServiceTiers } from "@/lib/queries";
import { ServiceRequestForm } from "./service-request-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Console Refurbishment Service — Respawn Your Console",
  description:
    "Ship us your PS2, PS3, PSP, Xbox, Nintendo handheld and more. Full teardown, deep clean, new thermal paste, port repair, capacitor work and burn-in testing. Status updates at every stage.",
};

const STEPS = [
  {
    n: "01",
    title: "Tell us what's wrong",
    body: "Pick your device and service level, describe the symptoms, add photos if you can. You get a job number instantly.",
  },
  {
    n: "02",
    title: "Ship it or drop it off",
    body: "Box it up with tracking and ship it to the workshop — or drop it off locally if you're nearby. We confirm arrival.",
  },
  {
    n: "03",
    title: "The Respawn",
    body: "Full teardown, deep clean, new thermal paste, port & laser work, whatever the inspection calls for. You see status at every stage.",
  },
  {
    n: "04",
    title: "Burn-in & return",
    body: "Hours of testing, then it ships back ready to play. If we can't fix it, you only pay return shipping.",
  },
];

const COMMON_FIXES = [
  "Overheating & jet-engine fans",
  "Yellowed / scuffed shells",
  "Dead HDMI or video output",
  "Disc drives that won't read",
  "Sticky or unresponsive buttons",
  "Charge ports & battery issues",
  "Laser & drive calibration",
  "Full teardown deep cleans",
];

export default async function RefurbishPage() {
  const tiers = await getServiceTiers().catch(() => []);

  return (
    <main>
      {/* Hero */}
      <section className="border-b border-line">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-16 h-72"
          style={{
            background:
              "radial-gradient(50% 60% at 50% 0%, rgba(74,227,130,0.10) 0%, transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-4xl px-4 py-16 text-center">
          <p className="cursor-blink font-mono text-xs text-phosphor">{"// RESPAWN SERVICE"}</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
            Your console, <span className="text-phosphor">professionally respawned</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-mist sm:text-base">
            Same workbench, same standards as the consoles we sell. Full teardown, ultrasonic
            clean, fresh thermal paste, port and drive repair, hours of burn-in testing. You get
            status updates at every stage of the pipeline — from your inbox to ours and back.
          </p>
        </div>
      </section>

      {/* Process */}
      <section className="border-b border-line bg-panel">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s) => (
              <div key={s.n} className="rounded-surface border border-line bg-ink p-5">
                <span className="font-mono text-xs text-phosphor">{s.n}</span>
                <h2 className="mt-2 text-sm font-bold">{s.title}</h2>
                <p className="mt-2 text-xs leading-relaxed text-mist">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Common fixes + form */}
      <section className="mx-auto grid max-w-6xl gap-12 px-4 py-16 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <p className="pixel-tag text-[9px] text-phosphor">WHAT WE FIX</p>
          <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
            Symptoms we see every week
          </h2>
          <ul className="mt-6 grid gap-2">
            {COMMON_FIXES.map((fix) => (
              <li key={fix} className="flex items-center gap-2 font-mono text-xs text-mist">
                <span className="text-phosphor">✓</span> {fix}
              </li>
            ))}
          </ul>

          <div className="mt-8 rounded-surface border border-line bg-panel p-5">
            <h3 className="pixel-tag text-[8px] text-phosphor">HOW PRICING WORKS</h3>
            <p className="mt-2 text-xs leading-relaxed text-mist">
              Pick a service tier below to lock in your deposit. If inspection reveals the job
              needs more (or less) work, we quote you before anything else happens — no surprise
              charges, ever.
            </p>
          </div>
        </div>

        <div id="start">
          <ServiceRequestForm tiers={tiers.map((t) => ({ id: t.id, name: t.name, description: t.description, priceCents: t.priceCents }))} />
        </div>
      </section>
    </main>
  );
}
