import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ProductForm, type ProductFormValues } from "../product-form";
import type { Product, ProductImage, ProductAccessory, Inspection, SourcingRecord } from "@/generated/prisma/client";

type EditProductData = Product & {
  images: ProductImage[];
  accessories: ProductAccessory[];
  inspection: (Inspection & { items: Array<{ label: string; passed: boolean }> }) | null;
  sourcingRecord: SourcingRecord | null;
};

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await db.product.findUnique({
    where: { id },
    include: {
      images: { orderBy: { sort: "asc" } },
      accessories: true,
      inspection: { include: { items: { orderBy: { sort: "asc" } } } },
      sourcingRecord: true,
    },
  });
  if (!product) notFound();

  const [platforms, categories] = await Promise.all([
    db.platform.findMany({ orderBy: { order: "asc" } }),
    db.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black tracking-tight">Edit: {product.name}</h1>
        <Link href="/admin/products" className="font-mono text-[11px] uppercase tracking-widest text-mist hover:text-phosphor">
          ← All products
        </Link>
      </div>
      <div className="mt-6">
        <ProductForm platforms={platforms} categories={categories} product={serializeProduct(product)} />
      </div>
    </div>
  );
}

// Minimal serialization: pass plain data to the client form.
function serializeProduct(p: EditProductData): ProductFormValues {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    inventoryId: p.inventoryId,
    model: p.model,
    platformId: p.platformId,
    categoryId: p.categoryId,
    condition: p.condition,
    cosmeticGrade: p.cosmeticGrade,
    storage: p.storage,
    color: p.color,
    description: p.description,
    price: (p.priceCents / 100).toFixed(2),
    compareAt: p.compareAtCents ? (p.compareAtCents / 100).toFixed(2) : "",
    quantity: p.quantity,
    status: p.status,
    featured: p.featured,
    specialEdition: p.specialEdition,
    collectible: p.collectible,
    shippingWeightLbs: p.shippingWeightLbs,
    defectNotes: p.defectNotes,
    seoTitle: p.seoTitle,
    seoDescription: p.seoDescription,
    imageUrls: p.images.map((i) => i.url),
    accessories: p.accessories.map((a) => a.name).join(", "),
    workPerformed: p.inspection?.workPerformed ?? "",
    inspectionItems: p.inspection
      ? p.inspection.items
          .map((i) => `${i.passed ? "" : "!"}${i.label}`)
          .join("\n")
      : "",
    source: p.sourcingRecord?.source ?? "OTHER",
    sourceNotes: p.sourcingRecord?.sourceNotes ?? "",
    acquisitionCost: p.sourcingRecord ? (p.sourcingRecord.acquisitionCents / 100).toFixed(2) : "",
    partsCost: p.sourcingRecord ? (p.sourcingRecord.partsCents / 100).toFixed(2) : "",
    otherCost: p.sourcingRecord ? (p.sourcingRecord.otherCents / 100).toFixed(2) : "",
    serialNumber: p.sourcingRecord?.serialNumber ?? "",
  };
}
