import Link from "next/link";
import { requireAdmin } from "@/lib/admin-guard";
import { logoutAction } from "@/lib/auth-actions";

export const dynamic = "force-dynamic";

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/services", label: "Respawn jobs" },
  { href: "/admin/trades", label: "Trades" },
  { href: "/admin/settings", label: "Settings" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-4rem)] max-w-6xl flex-col px-4 py-8 lg:flex-row lg:gap-8">
      <aside className="mb-6 flex shrink-0 flex-col gap-1 lg:mb-0 lg:w-52">
        <p className="pixel-tag mb-3 text-[9px] text-phosphor">CONTROL CENTER</p>
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="rounded-sm border border-transparent px-3 py-2 text-sm font-semibold text-mist transition-colors hover:border-line hover:bg-panel hover:text-bone"
          >
            {l.label}
          </Link>
        ))}
        <form action={logoutAction} className="mt-4">
          <button
            type="submit"
            className="w-full rounded-sm border border-line px-3 py-2 text-left text-sm text-mist transition-colors hover:border-amber/40 hover:text-amber"
          >
            Sign out ({session.email})
          </button>
        </form>
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
