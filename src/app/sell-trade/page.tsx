import type { Metadata } from "next";
import { SellTradeForm } from "./sell-trade-form";

export const metadata: Metadata = {
  title: "Sell or Trade Your Retro Gear",
  description:
    "Consoles, handhelds, games and accessories collecting dust? Send photos and a description — get a fair cash or trade offer, usually within 24 hours.",
};

const PERKS = [
  {
    title: "Fair offers, fast",
    body: "Real market-based offers — usually within 24 hours. No lowball auctions, no buyer ghosting.",
  },
  {
    title: "We handle everything",
    body: "No marketplace listings, no strangers at your door, no shipping headaches. Ship it or drop it off.",
  },
  {
    title: "Cash or trade",
    body: "Take the payout or put more value toward anything on the shelf — your call.",
  },
];

export default function SellTradePage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <p className="pixel-tag text-[9px] text-phosphor">SELL / TRADE</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">
            Turn dust into cash
          </h1>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-mist sm:text-base">
            Consoles, handhelds, games, controllers, accessories — working or not. Send photos
            and a description, and we&apos;ll come back with a real offer.
          </p>

          <div className="mt-8 space-y-4">
            {PERKS.map((p) => (
              <div key={p.title} className="rounded-surface border border-line bg-panel p-5">
                <h2 className="text-sm font-bold">{p.title}</h2>
                <p className="mt-1.5 text-xs leading-relaxed text-mist">{p.body}</p>
              </div>
            ))}
          </div>
        </div>

        <div id="offer">
          <SellTradeForm />
        </div>
      </div>
    </main>
  );
}
