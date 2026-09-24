import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

const POLICIES: Record<string, { title: string; updated: string; body: string[] }> = {
  shipping: {
    title: "Shipping",
    updated: "2026-09-24",
    body: [
      "Every order ships tracked from the USA, usually within 2 business days of payment clearing. Consoles are packed double-boxed with the disc/cover secured and ports protected.",
      "Standard shipping is 3–5 business days after dispatch. Orders over $300 ship free; flat-rate shipping applies below that.",
      "You'll receive a tracking number by email the moment your label is printed.",
    ],
  },
  returns: {
    title: "Returns",
    updated: "2026-09-24",
    body: [
      "Every console ships working as described, backed by its Respawn Report. If a unit arrives not matching its report, contact us within 30 days and we'll make it right: repair, replace, or full refund — your choice.",
      "Buyer's remorse returns are accepted within 14 days in the same condition, minus return shipping.",
      "Start a return through the contact page with your order number.",
    ],
  },
  warranty: {
    title: "Warranty",
    updated: "2026-09-24",
    body: [
      "Restored units carry a 90-day warranty covering the work performed in the Respawn Report: power, video, drives, ports, thermals and controls.",
      "The warranty covers functional failure under normal use. It does not cover new physical damage, liquid intrusion, or unauthorized modification after delivery.",
      "Warranty claims start with the contact page — ship it back, we fix it or replace it.",
    ],
  },
  privacy: {
    title: "Privacy",
    updated: "2026-09-24",
    body: [
      "We collect only what's needed to run the store: order details, contact info you give us, and site analytics. Payments are processed entirely by Stripe — card details never touch our servers.",
      "We never sell your data. Email subscribers can unsubscribe at any time from any mailing.",
      "Questions about your data? Contact us and we'll sort it within 30 days.",
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(POLICIES).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const policy = POLICIES[slug];
  return { title: policy ? policy.title : "Not found" };
}

export default async function PolicyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const policy = POLICIES[slug];
  if (!policy) notFound();

  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <p className="cursor-blink font-mono text-xs text-phosphor">{"// POLICY"}</p>
      <h1 className="mt-2 text-4xl font-black tracking-tight">{policy.title}</h1>
      <p className="mt-2 font-mono text-[11px] uppercase tracking-widest text-mist">
        Last updated {policy.updated}
      </p>
      <div className="mt-8 space-y-4">
        {policy.body.map((para, i) => (
          <p key={i} className="text-sm leading-relaxed text-mist">{para}</p>
        ))}
      </div>
      <p className="mt-10 text-sm text-mist">
        Questions? <Link href="/contact" className="text-phosphor hover:underline">Contact the workshop</Link>.
      </p>
    </main>
  );
}
