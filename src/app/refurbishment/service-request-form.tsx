"use client";

import { useActionState } from "react";
import { createServiceRequestAction, type ServiceFormState } from "@/app/actions/service";
import { formatPrice } from "@/lib/utils";

type Tier = { id: string; name: string; description: string; priceCents: number };

const initial: ServiceFormState = {};

export function ServiceRequestForm({ tiers }: { tiers: Tier[] }) {
  const [state, action, pending] = useActionState(createServiceRequestAction, initial);

  if (state.ok && state.jobNumber) {
    return (
      <div className="rounded-surface border border-phosphor/40 bg-phosphor/5 p-8 text-center">
        <p className="pixel-tag text-[9px] text-phosphor">REQUEST RECEIVED</p>
        <h2 className="pixel-tag mt-3 text-lg leading-relaxed text-phosphor">
          JOB {state.jobNumber} CREATED
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-mist">
          Save your job number — it&apos;s your ticket at the workshop. We&apos;ll email you
          shipping instructions and keep you posted at every stage. If your tier requires a
          deposit, the payment link is in the email.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="rounded-surface border border-line bg-panel p-6 sm:p-8">
      <h2 className="pixel-tag text-[9px] text-phosphor">START A RESPAWN REQUEST</h2>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="font-mono text-[10px] uppercase tracking-widest text-mist">Device family *</span>
          <select
            name="deviceFamily"
            required
            defaultValue=""
            className="h-11 rounded-sm border border-line bg-ink px-3 text-sm focus:border-phosphor/50 focus:outline-none"
          >
            <option value="" disabled>Select…</option>
            {["PlayStation", "Xbox", "Nintendo", "Handheld", "PC / Mac", "Other"].map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="font-mono text-[10px] uppercase tracking-widest text-mist">Model (optional)</span>
          <input
            name="deviceModel"
            placeholder="e.g. PSP-1001, CECHA01"
            className="h-11 rounded-sm border border-line bg-ink px-3 font-mono text-sm placeholder:text-mist/40 focus:border-phosphor/50 focus:outline-none"
          />
        </label>
      </div>

      <div className="mt-4">
        <span className="font-mono text-[10px] uppercase tracking-widest text-mist">Service tier *</span>
        <div className="mt-2 grid gap-2">
          {tiers.map((tier) => (
            <label
              key={tier.id}
              className="flex cursor-pointer items-start gap-3 rounded-sm border border-line bg-ink p-3 transition-colors hover:border-phosphor/40 has-[:checked]:border-phosphor/60 has-[:checked]:bg-phosphor/5"
            >
              <input
                type="radio"
                name="serviceTierId"
                value={tier.id}
                required
                className="mt-1 accent-phosphor"
              />
              <span className="flex-1">
                <span className="flex items-center justify-between gap-2">
                  <span className="text-sm font-bold">{tier.name}</span>
                  <span className="font-mono text-sm font-bold text-phosphor">
                    {formatPrice(tier.priceCents)}
                  </span>
                </span>
                <span className="mt-1 block text-xs leading-relaxed text-mist">{tier.description}</span>
              </span>
            </label>
          ))}
        </div>
      </div>

      <label className="mt-4 flex flex-col gap-1.5">
        <span className="font-mono text-[10px] uppercase tracking-widest text-mist">Symptoms / what&apos;s wrong?</span>
        <textarea
          name="symptoms"
          rows={4}
          placeholder="Won't read discs, fan screams, overheats after 20 minutes…"
          className="rounded-sm border border-line bg-ink p-3 text-sm placeholder:text-mist/40 focus:border-phosphor/50 focus:outline-none"
        />
      </label>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="font-mono text-[10px] uppercase tracking-widest text-mist">Your name *</span>
          <input
            name="contactName"
            required
            className="h-11 rounded-sm border border-line bg-ink px-3 text-sm focus:border-phosphor/50 focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="font-mono text-[10px] uppercase tracking-widest text-mist">Email *</span>
          <input
            type="email"
            name="email"
            required
            className="h-11 rounded-sm border border-line bg-ink px-3 font-mono text-sm focus:border-phosphor/50 focus:outline-none"
          />
        </label>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="font-mono text-[10px] uppercase tracking-widest text-mist">Phone (optional)</span>
          <input
            type="tel"
            name="phone"
            className="h-11 rounded-sm border border-line bg-ink px-3 font-mono text-sm focus:border-phosphor/50 focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="font-mono text-[10px] uppercase tracking-widest text-mist">How does it get to us? *</span>
          <select
            name="shippingMethod"
            required
            defaultValue="SHIP_TO_US"
            className="h-11 rounded-sm border border-line bg-ink px-3 text-sm focus:border-phosphor/50 focus:outline-none"
          >
            <option value="SHIP_TO_US">I&apos;ll ship it to the workshop</option>
            <option value="LOCAL_DROP_OFF">Local drop-off</option>
          </select>
        </label>
      </div>

      <label className="mt-5 flex items-start gap-2.5">
        <input type="checkbox" name="termsAccepted" className="mt-1 accent-phosphor" />
        <span className="text-xs leading-relaxed text-mist">
          I understand inspection comes first, I&apos;ll approve any quote before extra work
          happens, and Retro Ollie Games isn&apos;t liable for data on the device.
        </span>
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
        {pending ? "SUBMITTING…" : "▶ REQUEST MY RESPAWN"}
      </button>
      <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-widest text-mist">
        Free inspection quote · No fix, no fee (just return shipping)
      </p>
    </form>
  );
}
