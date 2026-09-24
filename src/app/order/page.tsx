import type { Metadata } from "next";
import { OrderLookupForm } from "./order-lookup-form";

export const metadata: Metadata = { title: "Track Your Order" };

export default function OrderLookupPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <p className="pixel-tag text-[9px] text-phosphor">ORDER STATUS</p>
      <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Track your order</h1>
      <p className="mt-3 max-w-lg text-sm leading-relaxed text-mist">
        Enter the order number from your confirmation (looks like{" "}
        <span className="font-mono text-bone">ROG-XXXXX</span>) and the email you used at
        checkout.
      </p>
      <div className="mt-8">
        <OrderLookupForm />
      </div>
    </main>
  );
}
