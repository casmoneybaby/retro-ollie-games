"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { logAudit } from "@/lib/audit";
import { getStripe } from "@/lib/stripe";
import {
  ProductStatus,
  OrderStatus,
  ServiceStatus,
  TradeStatus,
  SourceType,
  Condition,
} from "@/generated/prisma/enums";

async function assertAdmin() {
  const session = await getSession();
  if (!session) throw new Error("unauthorized");
  return session;
}

function dollarsToCents(v: FormDataEntryValue | null): number {
  if (typeof v !== "string" || v.trim() === "") return 0;
  const n = Number(v.replace(/[$,]/g, ""));
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.round(n * 100);
}

function optStr(v: FormDataEntryValue | null): string | null {
  if (typeof v !== "string" || v.trim() === "") return null;
  return v.trim();
}

// ---------------- Products ----------------

export async function saveProductAction(
  _prev: { ok?: boolean; error?: string; productId?: string },
  formData: FormData
): Promise<{ ok?: boolean; error?: string; productId?: string }> {
  try {
    await assertAdmin();
  } catch {
    return { error: "Unauthorized." };
  }

  const id = optStr(formData.get("id")); // present = update

  const name = optStr(formData.get("name"));
  const platformId = optStr(formData.get("platformId"));
  const categoryId = optStr(formData.get("categoryId"));
  const priceCents = dollarsToCents(formData.get("price"));
  const description = optStr(formData.get("description"));

  if (!name || !platformId || !categoryId || !description) {
    return { error: "Name, platform, category, description and price are required." };
  }
  if (priceCents <= 0) {
    return { error: "Enter a valid sale price." };
  }

  const slugInput = optStr(formData.get("slug"));
  const slug =
    slugInput ??
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 80);
  const inventoryId =
    optStr(formData.get("inventoryId")) ??
    `ROG-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

  const quantity = Math.max(0, Number(formData.get("quantity") ?? 1) || 0);
  const status = (optStr(formData.get("status")) ?? "DRAFT") as keyof typeof ProductStatus;
  const compareAtCents = dollarsToCents(formData.get("compareAt"));
  const accessories = (optStr(formData.get("accessories")) ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 20);

  const condition = (optStr(formData.get("condition")) ?? "RESTORED") as keyof typeof Condition;

  const data = {
    name,
    slug,
    inventoryId,
    platformId,
    categoryId,
    model: optStr(formData.get("model")),
    condition: Condition[condition] ?? Condition.RESTORED,
    cosmeticGrade: optStr(formData.get("cosmeticGrade")),
    storage: optStr(formData.get("storage")),
    color: optStr(formData.get("color")),
    description,
    priceCents,
    compareAtCents: compareAtCents > 0 ? compareAtCents : null,
    quantity,
    status: ProductStatus[status] ?? ProductStatus.DRAFT,
    featured: formData.get("featured") === "on",
    specialEdition: formData.get("specialEdition") === "on",
    collectible: formData.get("collectible") === "on",
    shippingWeightLbs: Number(formData.get("shippingWeightLbs") ?? 0) || null,
    defectNotes: optStr(formData.get("defectNotes")),
    seoTitle: optStr(formData.get("seoTitle")),
    seoDescription: optStr(formData.get("seoDescription")),
    publishedAt: status === "AVAILABLE" ? new Date() : null,
  };

  // Creating (no id): never silently overwrite an existing product with the same slug.
  if (!id) {
    const existing = await db.product.findUnique({ where: { slug } });
    if (existing) {
      return { error: `Slug "${slug}" is already used by ${existing.name}. Pick a unique slug.` };
    }
  }

  const product = await db.product.upsert({
    where: id ? { id } : { slug },
    create: {
      ...data,
      images: {
        create: formData.getAll("imageUrls")
          .filter((u): u is string => typeof u === "string" && u.trim() !== "")
          .slice(0, 10)
          .map((url, i) => ({ url: url.trim(), sort: i })),
      },
      accessories: {
        create: accessories.map((a) => ({ name: a })),
      },
      inspection: formData.get("workPerformed")
        ? {
            create: {
              workPerformed: optStr(formData.get("workPerformed")),
              completedAt: new Date(),
              items: {
                create: (optStr(formData.get("inspectionItems")) ?? "")
                  .split("\n")
                  .map((line) => line.trim())
                  .filter(Boolean)
                  .slice(0, 20)
                  .map((line, i) => ({
                    label: line.replace(/^!?/, ""),
                    passed: !line.startsWith("!"),
                    sort: i,
                  })),
              },
            },
          }
        : undefined,
      sourcingRecord: {
        create: {
          source: SourceType[(optStr(formData.get("source")) ?? "OTHER") as keyof typeof SourceType] ?? SourceType.OTHER,
          sourceNotes: optStr(formData.get("sourceNotes")),
          acquisitionCents: dollarsToCents(formData.get("acquisitionCost")),
          partsCents: dollarsToCents(formData.get("partsCost")),
          otherCents: dollarsToCents(formData.get("otherCost")),
          serialNumber: optStr(formData.get("serialNumber")),
        },
      },
    },
    update: {
      ...data,
      images: {
        deleteMany: {},
        create: formData.getAll("imageUrls")
          .filter((u): u is string => typeof u === "string" && u.trim() !== "")
          .slice(0, 10)
          .map((url, i) => ({ url: url.trim(), sort: i })),
      },
      accessories: {
        deleteMany: {},
        create: accessories.map((a) => ({ name: a })),
      },
      inspection: {
        upsert: {
          create: {
            workPerformed: optStr(formData.get("workPerformed")),
            completedAt: new Date(),
            items: {
              create: (optStr(formData.get("inspectionItems")) ?? "")
                .split("\n")
                .map((line) => line.trim())
                .filter(Boolean)
                .slice(0, 20)
                .map((line, i) => ({
                  label: line.replace(/^!/, ""),
                  passed: !line.startsWith("!"),
                  sort: i,
                })),
            },
          },
          update: {
            workPerformed: optStr(formData.get("workPerformed")),
            completedAt: new Date(),
            items: {
              deleteMany: {},
              create: (optStr(formData.get("inspectionItems")) ?? "")
                .split("\n")
                .map((line) => line.trim())
                .filter(Boolean)
                .slice(0, 20)
                .map((line, i) => ({
                  label: line.replace(/^!/, ""),
                  passed: !line.startsWith("!"),
                  sort: i,
                })),
            },
          },
        },
      },
      sourcingRecord: {
        upsert: {
          create: {
            source: SourceType[(optStr(formData.get("source")) ?? "OTHER") as keyof typeof SourceType] ?? SourceType.OTHER,
            sourceNotes: optStr(formData.get("sourceNotes")),
            acquisitionCents: dollarsToCents(formData.get("acquisitionCost")),
            partsCents: dollarsToCents(formData.get("partsCost")),
            otherCents: dollarsToCents(formData.get("otherCost")),
            serialNumber: optStr(formData.get("serialNumber")),
          },
          update: {
            source: SourceType[(optStr(formData.get("source")) ?? "OTHER") as keyof typeof SourceType] ?? SourceType.OTHER,
            sourceNotes: optStr(formData.get("sourceNotes")),
            acquisitionCents: dollarsToCents(formData.get("acquisitionCost")),
            partsCents: dollarsToCents(formData.get("partsCost")),
            otherCents: dollarsToCents(formData.get("otherCost")),
            serialNumber: optStr(formData.get("serialNumber")),
          },
        },
      },
    },
  });

  await logAudit("product.saved", `${product.inventoryId} status=${product.status}`);
  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath(`/shop/${product.slug}`);
  return { ok: true, productId: product.id };
}

export async function setProductStatusAction(formData: FormData): Promise<void> {
  await assertAdmin();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as keyof typeof ProductStatus;
  if (!id || !ProductStatus[status]) return;
  await db.product.update({
    where: { id },
    data: {
      status: ProductStatus[status],
      publishedAt: status === "AVAILABLE" ? new Date() : undefined,
    },
  });
  await logAudit("product.status", `${id} → ${status}`);
  revalidatePath("/admin/products");
  revalidatePath("/shop");
}

// ---------------- Orders ----------------

export async function updateOrderStatusAction(formData: FormData): Promise<void> {
  await assertAdmin();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as keyof typeof OrderStatus;
  if (!id || !OrderStatus[status]) return;
  await db.order.update({
    where: { id },
    data: { status: OrderStatus[status] },
  });
  await logAudit("order.status", `${id} → ${status}`);
  revalidatePath("/admin/orders");
}

export async function refundOrderAction(formData: FormData): Promise<void> {
  const session = await assertAdmin();
  const id = String(formData.get("id") ?? "");
  const confirm = String(formData.get("confirm") ?? "");
  if (!id || confirm !== "REFUND") return;

  const order = await db.order.findUnique({ where: { id } });
  if (!order?.stripePaymentIntentId) return;

  const stripe = getStripe();
  if (!stripe) return;

  try {
    await stripe.refunds.create({ payment_intent: order.stripePaymentIntentId });
    await db.order.update({
      where: { id },
      data: { status: OrderStatus.REFUNDED },
    });
    // Inventory is NOT auto-restocked — owner decides after physical return.
    await logAudit("order.refunded", `${order.number} by ${session.email}`);
  } catch (err) {
    console.error("refund failed", err);
  }
  revalidatePath("/admin/orders");
}

// ---------------- Service requests ----------------

export async function updateServiceStatusAction(formData: FormData): Promise<void> {
  await assertAdmin();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as keyof typeof ServiceStatus;
  const note = optStr(formData.get("note"));
  if (!id || !ServiceStatus[status]) return;

  await db.serviceRequest.update({
    where: { id },
    data: { status: ServiceStatus[status] },
  });
  await db.serviceStatusEvent.create({
    data: { serviceRequestId: id, status: ServiceStatus[status], note },
  });
  await logAudit("service.status", `${id} → ${status}`);
  revalidatePath("/admin/services");
}

export async function updateServiceQuoteAction(formData: FormData): Promise<void> {
  await assertAdmin();
  const id = String(formData.get("id") ?? "");
  const quotedCents = dollarsToCents(formData.get("quoted"));
  const depositCents = dollarsToCents(formData.get("deposit"));
  if (!id) return;
  await db.serviceRequest.update({
    where: { id },
    data: { quotedCents, depositCents },
  });
  await logAudit("service.quote", `${id} quote=${quotedCents} deposit=${depositCents}`);
  revalidatePath("/admin/services");
}

// ---------------- Trades ----------------

export async function updateTradeStatusAction(formData: FormData): Promise<void> {
  await assertAdmin();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as keyof typeof TradeStatus;
  if (!id || !TradeStatus[status]) return;
  await db.tradeSubmission.update({
    where: { id },
    data: { status: TradeStatus[status] },
  });
  await logAudit("trade.status", `${id} → ${status}`);
  revalidatePath("/admin/trades");
}
