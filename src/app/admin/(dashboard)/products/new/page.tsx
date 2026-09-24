import Link from "next/link";
import { db } from "@/lib/db";
import { ProductForm } from "../product-form";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const [platforms, categories] = await Promise.all([
    db.platform.findMany({ orderBy: { order: "asc" } }),
    db.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black tracking-tight">Add product</h1>
        <Link href="/admin/products" className="font-mono text-[11px] uppercase tracking-widest text-mist hover:text-phosphor">
          ← All products
        </Link>
      </div>
      <p className="mt-2 max-w-2xl text-xs leading-relaxed text-mist">
        Save as DRAFT to preview, set status to AVAILABLE to publish to the storefront. Costs
        (acquisition / parts / other) are private — they power your profit analytics and are
        never shown to customers.
      </p>
      <div className="mt-6">
        <ProductForm platforms={platforms} categories={categories} />
      </div>
    </div>
  );
}
