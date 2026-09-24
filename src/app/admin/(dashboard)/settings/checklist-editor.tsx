"use client";

import { useActionState } from "react";
import { saveRefurbChecklistAction } from "@/app/actions/settings";

export function ChecklistEditor({ items }: { items: string[] }) {
  const [state, action, pending] = useActionState(saveRefurbChecklistAction, {});

  return (
    <form action={action} className="rounded-surface border border-line bg-panel p-5">
      {state.ok && (
        <p className="mb-3 rounded-sm border border-phosphor/40 bg-phosphor/10 p-2.5 text-xs text-phosphor">
          ✓ Checklist saved — live on the homepage.
        </p>
      )}
      {state.error && (
        <p className="mb-3 rounded-sm border border-orange/40 bg-orange/10 p-2.5 text-xs text-orange">
          {state.error}
        </p>
      )}
      <div className="space-y-2">
        {items.map((item, i) => (
          <input
            key={i}
            name="checklistItem"
            defaultValue={item}
            maxLength={120}
            className="h-10 w-full rounded-sm border border-line bg-ink px-3 text-sm focus:border-phosphor/50 focus:outline-none"
          />
        ))}
        <input
          name="checklistItem"
          placeholder="+ Add another service…"
          maxLength={120}
          className="h-10 w-full rounded-sm border border-dashed border-line bg-ink px-3 text-sm placeholder:text-mist/40 focus:border-phosphor/50 focus:outline-none"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="mt-4 h-10 rounded-sm bg-phosphor px-5 text-xs font-bold uppercase tracking-widest text-ink disabled:opacity-50"
      >
        {pending ? "SAVING…" : "SAVE CHECKLIST"}
      </button>
    </form>
  );
}
