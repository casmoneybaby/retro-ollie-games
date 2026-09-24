"use client";

import { useActionState, useState } from "react";
import { lookupJobAction } from "@/app/actions/service-status";
import { SERVICE_STATUS_FLOW, SERVICE_STATUS_LABELS } from "@/lib/site";
import { formatPrice } from "@/lib/utils";
import type { JobStatusView } from "@/app/actions/service-status";

export function JobLookupForm() {
  const [state, action, pending] = useActionState(lookupJobAction, null);
  const [paying, setPaying] = useState(false);

  return (
    <div>
      <form action={action} className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="font-mono text-[10px] uppercase tracking-widest text-mist">Job number</span>
          <input
            name="jobNumber"
            required
            placeholder="RESPAWN-00128"
            className="h-11 rounded-sm border border-line bg-panel px-3 font-mono text-sm placeholder:text-mist/40 focus:border-phosphor/50 focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="font-mono text-[10px] uppercase tracking-widest text-mist">Email</span>
          <input
            type="email"
            name="email"
            required
            className="h-11 rounded-sm border border-line bg-panel px-3 font-mono text-sm focus:border-phosphor/50 focus:outline-none"
          />
        </label>
        <button
          type="submit"
          disabled={pending}
          className="pixel-tag h-12 rounded-sm bg-phosphor text-[10px] text-ink disabled:opacity-50 sm:col-span-2"
        >
          {pending ? "SEARCHING…" : "FIND MY JOB"}
        </button>
      </form>

      {state && "error" in state && (
        <p className="mt-4 rounded-sm border border-amber/40 bg-amber/10 p-3 text-xs text-amber">
          {state.error}
        </p>
      )}

      {state && "job" in state && <JobCard job={state.job} paying={paying} setPaying={setPaying} />}
    </div>
  );
}

function JobCard({
  job,
  paying,
  setPaying,
}: {
  job: JobStatusView;
  paying: boolean;
  setPaying: (v: boolean) => void;
}) {
  const currentIndex = SERVICE_STATUS_FLOW.indexOf(job.status as (typeof SERVICE_STATUS_FLOW)[number]);

  async function payDeposit() {
    setPaying(true);
    try {
      const res = await fetch("/api/services/deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobNumber: job.jobNumber, email: job.email }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } finally {
      setPaying(false);
    }
  }

  return (
    <div className="mt-8 rounded-surface border border-phosphor/30 bg-panel">
      <div className="border-b border-line px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="font-mono text-sm font-bold">{job.jobNumber}</p>
          <span className="pixel-tag rounded-sm border border-phosphor/40 bg-phosphor/10 px-2 py-1 text-[8px] text-phosphor">
            {job.statusLabel.toUpperCase()}
          </span>
        </div>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-mist">
          {job.deviceFamily}
          {job.deviceModel ? ` · ${job.deviceModel}` : ""} · {job.tierName}
        </p>
      </div>

      {/* progress bar */}
      <div className="border-b border-line px-5 py-4">
        <div className="flex items-center">
          {SERVICE_STATUS_FLOW.map((s, i) => (
            <div key={s} className="flex flex-1 items-center last:flex-none">
              <div
                className={`h-2 w-2 shrink-0 rounded-full ${
                  i <= currentIndex ? "bg-phosphor" : "bg-line"
                }`}
                title={SERVICE_STATUS_LABELS[s]}
              />
              {i < SERVICE_STATUS_FLOW.length - 1 && (
                <div className={`h-0.5 flex-1 ${i < currentIndex ? "bg-phosphor/60" : "bg-line"}`} />
              )}
            </div>
          ))}
        </div>
        <div className="mt-2 flex justify-between font-mono text-[8px] uppercase tracking-widest text-mist">
          <span>Received</span>
          <span className="hidden sm:inline">Bench</span>
          <span>Ready</span>
        </div>
      </div>

      {/* deposit */}
      {job.depositCents > 0 && !job.depositPaid && (
        <div className="border-b border-line px-5 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-bone">Deposit due: {formatPrice(job.depositCents)}</p>
              <p className="text-[11px] text-mist">Applied to your final invoice.</p>
            </div>
            <button
              type="button"
              onClick={payDeposit}
              disabled={paying || !job.email}
              className="pixel-tag h-10 rounded-sm bg-phosphor px-4 text-[9px] text-ink disabled:opacity-50"
            >
              {paying ? "OPENING…" : "PAY DEPOSIT"}
            </button>
          </div>
        </div>
      )}

      {/* timeline */}
      <ul className="divide-y divide-line px-5">
        {job.timeline.map((t, i) => (
          <li key={i} className="flex items-center gap-3 py-3">
            <span className="h-1.5 w-1.5 rounded-full bg-phosphor" />
            <span className="flex-1 font-mono text-xs text-bone">{t.label}</span>
            <span className="font-mono text-[10px] text-mist">{t.at}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
