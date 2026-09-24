"use client";

import { useActionState } from "react";
import { createTradeAction, type TradeFormState } from "@/app/actions/trade";

const initial: TradeFormState = {};

export function SellTradeForm() {
  const [state, action, pending] = useActionState(createTradeAction, initial);

  if (state.ok) {
    return (
      <div className="rounded-surface border border-phosphor/40 bg-phosphor/5 p-8 text-center">
        <p className="pixel-tag text-[9px] text-phosphor">SUBMISSION RECEIVED</p>
        <h2 className="pixel-tag mt-3 text-base leading-relaxed text-phosphor">
          WE&apos;LL BE IN TOUCH WITHIN 24 HOURS
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-mist">
          Watch your inbox — offers usually land same day. Thanks for thinking of the workshop.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="rounded-surface border border-line bg-panel p-6 sm:p-8">
      <h2 className="pixel-tag text-[9px] text-phosphor">GET AN OFFER</h2>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="font-mono text-[10px] uppercase tracking-widest text-mist">Device *</span>
          <input
            name="device"
            required
            placeholder="PS2, Game Boy, Wii…"
            className="h-11 rounded-sm border border-line bg-ink px-3 text-sm placeholder:text-mist/40 focus:border-phosphor/50 focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="font-mono text-[10px] uppercase tracking-widest text-mist">Model (optional)</span>
          <input
            name="model"
            placeholder="SCPH-39001"
            className="h-11 rounded-sm border border-line bg-ink px-3 font-mono text-sm placeholder:text-mist/40 focus:border-phosphor/50 focus:outline-none"
          />
        </label>
      </div>

      <label className="mt-4 flex flex-col gap-1.5">
        <span className="font-mono text-[10px] uppercase tracking-widest text-mist">Condition / what's included?</span>
        <textarea
          name="conditionDesc"
          rows={4}
          placeholder="Works great, light yellowing, 2 controllers and 12 games included…"
          className="rounded-sm border border-line bg-ink p-3 text-sm placeholder:text-mist/40 focus:border-phosphor/50 focus:outline-none"
        />
      </label>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="font-mono text-[10px] uppercase tracking-widest text-mist">Asking price (optional)</span>
          <input
            name="askingPrice"
            placeholder="$120"
            className="h-11 rounded-sm border border-line bg-ink px-3 font-mono text-sm placeholder:text-mist/40 focus:border-phosphor/50 focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="font-mono text-[10px] uppercase tracking-widest text-mist">Your name *</span>
          <input name="contactName" required className="h-11 rounded-sm border border-line bg-ink px-3 text-sm focus:border-phosphor/50 focus:outline-none" />
        </label>
      </div>

      <label className="mt-4 flex flex-col gap-1.5">
        <span className="font-mono text-[10px] uppercase tracking-widest text-mist">Email *</span>
        <input
          type="email"
          name="email"
          required
          className="h-11 rounded-sm border border-line bg-ink px-3 font-mono text-sm focus:border-phosphor/50 focus:outline-none"
        />
      </label>

      {state.error && (
        <p className="mt-4 rounded-sm border border-amber/40 bg-amber/10 p-3 text-xs text-amber">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="pixel-tag mt-6 flex h-14 w-full items-center justify-center rounded-sm bg-phosphor text-[10px] text-ink transition-colors hover:bg-bone disabled:opacity-50"
      >
        {pending ? "SENDING…" : "▶ GET MY OFFER"}
      </button>
    </form>
  );
}
