import type { Metadata } from "next";
import { site } from "@/lib/site";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Questions about an order, a refurb job, or selling your gear? Reach the Retro Ollie Games workshop.",
};

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <p className="cursor-blink font-mono text-xs text-phosphor">{"// TRANSMISSION CHANNEL"}</p>
      <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">Contact the workshop</h1>
      <p className="mt-4 max-w-xl text-sm leading-relaxed text-mist">
        Order questions, refurb status, trade offers, anything else — we answer fast. You can
        also email <a href={`mailto:${site.email}`} className="text-phosphor hover:underline">{site.email}</a> directly.
      </p>
      <div className="mt-10">
        <ContactForm />
      </div>
    </main>
  );
}
