import type { Metadata } from "next";
import { JobLookupForm } from "./job-lookup-form";

export const metadata: Metadata = {
  title: "Respawn Log — Track Your Refurb Job",
  description:
    "Enter your RESPAWN job number and email to see live status of your console refurbishment.",
};

export default function RespawnLogPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <p className="pixel-tag text-[9px] text-phosphor">RESPAWN LOG</p>
      <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Track your job</h1>
      <p className="mt-3 max-w-lg text-sm leading-relaxed text-mist">
        Every refurb job gets a number like <span className="font-mono text-bone">RESPAWN-00128</span>.
        Enter it with your email to see exactly where your console is on the bench.
      </p>
      <div className="mt-8">
        <JobLookupForm />
      </div>
    </main>
  );
}
