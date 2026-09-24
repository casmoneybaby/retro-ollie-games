"use client";

import { useActionState } from "react";
import { loginAction } from "@/lib/auth-actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, {});

  return (
    <form action={action} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5">
        <span className="font-mono text-[10px] uppercase tracking-widest text-mist">Email</span>
        <input
          type="email"
          name="email"
          required
          autoComplete="username"
          className="h-11 rounded-sm border border-line bg-panel px-3 font-mono text-sm focus:border-phosphor/50 focus:outline-none"
        />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="font-mono text-[10px] uppercase tracking-widest text-mist">Password</span>
        <input
          type="password"
          name="password"
          required
          autoComplete="current-password"
          className="h-11 rounded-sm border border-line bg-panel px-3 font-mono text-sm focus:border-phosphor/50 focus:outline-none"
        />
      </label>
      {state?.error && (
        <p className="rounded-sm border border-amber/40 bg-amber/10 p-3 text-xs text-amber">{state.error}</p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="pixel-tag flex h-12 items-center justify-center rounded-sm bg-phosphor text-[10px] text-ink disabled:opacity-50"
      >
        {pending ? "AUTHENTICATING…" : "▶ ENTER CONTROL CENTER"}
      </button>
    </form>
  );
}
