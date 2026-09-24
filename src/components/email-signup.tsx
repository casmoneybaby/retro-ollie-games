"use client";

import { useActionState } from "react";
import { subscribeAction } from "@/app/actions/email";

export function EmailSignup() {
  const [state, action, pending] = useActionState(subscribeAction, {});

  if (state.ok) {
    return (
      <p className="pixel-tag mt-4 text-[9px] text-phosphor">✓ YOU&apos;RE ON THE LIST</p>
    );
  }

  return (
    <form action={action} className="mt-4">
      <div className="flex overflow-hidden rounded-sm border border-line bg-ink focus-within:border-phosphor/50">
        <input
          type="email"
          name="email"
          required
          placeholder="you@email.com"
          aria-label="Email address"
          className="h-10 min-w-0 flex-1 bg-transparent px-3 font-mono text-xs text-bone placeholder:text-mist/50 focus:outline-none"
        />
        <button
          type="submit"
          disabled={pending}
          className="h-10 shrink-0 bg-phosphor px-4 text-[11px] font-bold uppercase tracking-widest text-ink transition-colors hover:bg-phosphor-dim disabled:opacity-50"
        >
          {pending ? "…" : "Notify me"}
        </button>
      </div>
      {state.error && <p className="mt-2 text-[11px] text-amber">{state.error}</p>}
    </form>
  );
}
