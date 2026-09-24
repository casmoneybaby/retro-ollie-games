"use client";

import { useActionState } from "react";
import { sendContactAction } from "@/app/actions/contact";

export function ContactForm() {
  const [state, action, pending] = useActionState(sendContactAction, {});

  if (state.ok) {
    return (
      <div className="rounded-surface border border-phosphor/40 bg-phosphor/5 p-8 text-center">
        <p className="pixel-tag text-[9px] text-phosphor">MESSAGE SENT</p>
        <p className="mt-3 text-sm text-mist">
          Got it — we&apos;ll reply from the workshop shortly.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="rounded-surface border border-line bg-panel p-6 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="font-mono text-[10px] uppercase tracking-widest text-mist">Name *</span>
          <input
            name="name"
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
      <label className="mt-4 flex flex-col gap-1.5">
        <span className="font-mono text-[10px] uppercase tracking-widest text-mist">Subject</span>
        <select
          name="subject"
          defaultValue="General"
          className="h-11 rounded-sm border border-line bg-ink px-3 text-sm focus:border-phosphor/50 focus:outline-none"
        >
          {["General", "Order question", "Refurb job", "Sell / trade", "Something else"].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </label>
      <label className="mt-4 flex flex-col gap-1.5">
        <span className="font-mono text-[10px] uppercase tracking-widest text-mist">Message *</span>
        <textarea
          name="message"
          required
          rows={5}
          className="rounded-sm border border-line bg-ink p-3 text-sm focus:border-phosphor/50 focus:outline-none"
        />
      </label>

      {state.error && (
        <p className="mt-4 rounded-sm border border-orange/40 bg-orange/10 p-3 text-xs text-orange">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-6 flex h-13 w-full items-center justify-center rounded-sm bg-phosphor text-[13px] font-bold text-ink transition-colors hover:bg-bone disabled:opacity-50"
      >
        {pending ? "SENDING…" : "SEND MESSAGE →"}
      </button>
    </form>
  );
}
