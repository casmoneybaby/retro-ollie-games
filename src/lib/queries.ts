import { db } from "@/lib/db";
import { Condition, ProductStatus } from "@/generated/prisma/enums";

export type StorefrontProduct = Awaited<ReturnType<typeof getProducts>>[number];

/** Published products for the storefront grid, optionally filtered by platform slug. */
export async function getProducts(opts?: { platform?: string; limit?: number }) {
  return db.product.findMany({
    where: {
      status: ProductStatus.AVAILABLE,
      ...(opts?.platform ? { platform: { slug: opts.platform } } : {}),
    },
    include: {
      platform: true,
      images: { orderBy: { sort: "asc" } },
      accessories: true,
    },
    orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
    take: opts?.limit,
  });
}

/** Single published product by slug, with everything the detail page needs. */
export async function getProductBySlug(slug: string) {
  return db.product.findFirst({
    where: { slug, status: { not: ProductStatus.DRAFT } },
    include: {
      platform: true,
      category: true,
      images: { orderBy: { sort: "asc" } },
      accessories: true,
      inspection: { include: { items: { orderBy: { sort: "asc" } } } },
    },
  });
}

export async function getPlatformBySlug(slug: string) {
  return db.platform.findUnique({ where: { slug } });
}

/** All platforms in display order (for the SHOP BY SYSTEM grid). */
export async function getPlatforms() {
  return db.platform.findMany({ orderBy: { order: "asc" } });
}

/** Read an admin-editable SiteSetting JSON value with a fallback. */
export async function getSiteSettingJSON<T>(key: string, fallback: T): Promise<T> {
  try {
    const row = await db.siteSetting.findUnique({ where: { key } });
    if (!row) return fallback;
    return JSON.parse(row.value) as T;
  } catch {
    return fallback;
  }
}

export async function getFeatured(limit = 4) {
  return db.product.findMany({
    where: { status: ProductStatus.AVAILABLE },
    include: { platform: true, images: { orderBy: { sort: "asc" } }, accessories: true },
    orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
    take: limit,
  });
}

/** Service tiers for the refurbish page, cheapest first. */
export async function getServiceTiers(deviceFamily?: string) {
  return db.serviceTier.findMany({
    where: {
      active: true,
      ...(deviceFamily ? { deviceFamilies: { contains: deviceFamily } } : {}),
    },
    orderBy: { sortOrder: "asc" },
  });
}
