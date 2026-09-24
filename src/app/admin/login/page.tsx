import { Suspense } from "react";
import type { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Control Center Login" };
export const dynamic = "force-dynamic";

export default function AdminLoginPage() {
  return (
    <main className="mx-auto flex max-w-sm flex-col px-4 py-24">
      <p className="pixel-tag text-[9px] text-phosphor">CONTROL CENTER</p>
      <h1 className="mt-2 text-2xl font-black tracking-tight">Operator login</h1>
      <p className="mt-2 text-xs text-mist">
        Workshop access only. Authorized operators have a browser session cookie.
      </p>
      <div className="mt-8">
        <Suspense fallback={<div className="h-48 animate-pulse rounded-surface bg-panel" />}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
