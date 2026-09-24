/**
 * Retro Ollie Games — intentional seed.
 * Creates: platforms, categories, 3 service tiers, 4 real products, 1 admin user.
 * Idempotent: existing records (by slug/email) are left untouched.
 *
 * Run: pnpm tsx scripts/seed.mts
 */
import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaNeon } from "@prisma/adapter-neon";
import bcrypt from "bcryptjs";
import { config as loadEnv } from "dotenv";

loadEnv({ path: ".env.local" });

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is not set");

const db = new PrismaClient({ adapter: new PrismaNeon({ connectionString }) });

const PLATFORMS = [
  { name: "PlayStation", slug: "playstation", blurb: "PS1 · PS2 · PS3 · PS4 · PS5", order: 1 },
  { name: "Xbox", slug: "xbox", blurb: "Original · 360 · One · Series", order: 2 },
  { name: "Nintendo", slug: "nintendo", blurb: "NES · SNES · N64 · GameCube · Wii · Switch", order: 3 },
  { name: "Retro", slug: "retro", blurb: "Pre-2000 classics", order: 4 },
  { name: "Handhelds", slug: "handhelds", blurb: "Game Boy · PSP · DS · Vita", order: 5 },
  { name: "Games", slug: "games", blurb: "Loose & complete games", order: 6 },
  { name: "Controllers", slug: "controllers", blurb: "Pads, sticks & FightSticks", order: 7 },
  { name: "Pokémon", slug: "pokemon", blurb: "Authentic carts & collectibles", order: 8 },
  { name: "PC & Mac", slug: "pc-mac", blurb: "Mini PCs, laptops & parts", order: 9 },
  { name: "Accessories", slug: "accessories", blurb: "Cables, memory & more", order: 10 },
];

const CATEGORIES = ["Consoles", "Handhelds", "Games", "Computers", "Controllers", "Accessories", "Collectibles"];

const TIERS = [
  {
    slug: "deep-clean",
    name: "Deep Clean & Service",
    description:
      "Full teardown, ultrasonic clean, new thermal paste, fan service, external port check and full function test.",
    deviceFamilies: "PlayStation,Xbox,Nintendo,Handheld,PC / Mac,Other",
    priceCents: 5900,
    sortOrder: 1,
  },
  {
    slug: "console-respawn",
    name: "Console Respawn",
    description:
      "Everything in Deep Clean plus thermal compound service, capacitor/laser work as needed, minor port repair and a 2-hour burn-in test.",
    deviceFamilies: "PlayStation,Xbox,Nintendo,Handheld,PC / Mac,Other",
    priceCents: 9900,
    sortOrder: 2,
  },
  {
    slug: "full-restoration",
    name: "Full Restoration",
    description:
      "Complete ground-up rebuild: parts replacement, port rework, shell de-yellowing, cosmetic restoration and extended burn-in. Quote confirmed after inspection.",
    deviceFamilies: "PlayStation,Xbox,Nintendo,Handheld,PC / Mac,Other",
    priceCents: 14900,
    sortOrder: 3,
  },
];

type SeedProduct = {
  inventoryId: string;
  slug: string;
  name: string;
  model: string;
  platform: string;
  category: string;
  condition: "PLAYER" | "RESTORED" | "VAULT";
  cosmeticGrade: string;
  storage: string | null;
  color: string | null;
  description: string;
  priceCents: number;
  compareAtCents: number | null;
  featured: boolean;
  accessories: string[];
  defectNotes: string | null;
  workPerformed: string;
  inspection: Array<[string, boolean]>;
  source: string;
  acquisitionCents: number;
  partsCents: number;
  otherCents: number;
};

const PRODUCTS: SeedProduct[] = [
  {
    inventoryId: "ROG-PS3-0001",
    slug: "ps3-super-slim-500gb-restored",
    name: "PlayStation 3 Super Slim 500GB — Restored",
    model: "CECH-4201C",
    platform: "playstation",
    category: "Consoles",
    condition: "RESTORED",
    cosmeticGrade: "B+ (light wear)",
    storage: "500GB HDD",
    color: "Charcoal black",
    description:
      "Fully restored PS3 Super Slim with a fresh 500GB drive. Torn down to the board, ultrasonic-cleaned, re-pasted with Arctic MX-4 and burn-in tested for two hours with sustained temps in the low 60s. Reads PS1 and PS3 discs, Wi-Fi and Bluetooth verified, all ports tested. Ships with controller, power and HDMI cables — ready to play the day it arrives.",
    priceCents: 20000,
    compareAtCents: 24900,
    featured: true,
    accessories: ["DualShock 3 controller", "AC power cable", "HDMI cable"],
    defectNotes: "Hairline scuff on the top lid (see photos) — does not affect use.",
    workPerformed:
      "Full teardown & ultrasonic clean · new thermal paste (Arctic MX-4) · fan service · disc laser cleaned · HDMI port checked · 2h burn-in @ 61°C sustained",
    inspection: [
      ["Power", true],
      ["Video output (HDMI/AV)", true],
      ["Disc drive (PS1/PS3)", true],
      ["Fan & thermals", true],
      ["Wi-Fi + Bluetooth", true],
      ["USB ports ×2", true],
      ["Ethernet", true],
      ["Blu-ray drive firmware", true],
    ],
    source: "EBAY",
    acquisitionCents: 7000,
    partsCents: 2500,
    otherCents: 800,
  },
  {
    inventoryId: "ROG-PSP-0001",
    slug: "psp-1000-restored",
    name: "Sony PSP 1000 — Restored",
    model: "PSP-1001",
    platform: "handhelds",
    category: "Handhelds",
    condition: "RESTORED",
    cosmeticGrade: "A- (excellent)",
    storage: "Memory Stick Pro Duo",
    color: "Piano black",
    description:
      "The original heavyweight handheld, restored properly. Complete teardown and deep clean, new battery, UMD drive serviced and verified with multiple discs, screen polished with zero dead pixels, all buttons tested for responsiveness. Shell is an excellent example — minimal scuffing for a 20-year-old handheld. Ships with charger and 32MB Memory Stick.",
    priceCents: 30000,
    compareAtCents: 34900,
    featured: true,
    accessories: ["AC adapter", "32MB Memory Stick Pro Duo", "New battery"],
    defectNotes: "Faint polishing marks on the UMD door.",
    workPerformed:
      "Full teardown & deep clean · new battery · UMD drive service & laser clean · button contact service · screen polish · 1h burn-in",
    inspection: [
      ["Power & battery hold", true],
      ["UMD drive", true],
      ["Screen (no dead pixels)", true],
      ["All buttons & D-pad", true],
      ["Wi-Fi", true],
      ["Headphone jack", true],
      ["Memory stick slot", true],
    ],
    source: "FACEBOOK_MARKETPLACE",
    acquisitionCents: 12000,
    partsCents: 3000,
    otherCents: 600,
  },
  {
    inventoryId: "ROG-PS2-0001",
    slug: "ps2-fat-scsi-restored",
    name: "PlayStation 2 Fat (SCPH-39001) — Restored",
    model: "SCPH-39001",
    platform: "playstation",
    category: "Consoles",
    condition: "RESTORED",
    cosmeticGrade: "B (honest wear)",
    storage: null,
    color: "Black",
    description:
      "The best-selling console of all time, back on the bench and back in action. Full teardown, deep clean and re-paste, disc drive recalibrated to read both PS1 and PS2 media, controller ports tested with multiple pads. Classic Fat model with the Expansion Bay. Ships with controller, 8MB memory card and all cables.",
    priceCents: 15000,
    compareAtCents: 18900,
    featured: true,
    accessories: ["DualShock 2 controller", "8MB memory card", "AC adapter", "AV cable"],
    defectNotes: "Light yellowing on the rear ports panel — photos show it honestly.",
    workPerformed:
      "Full teardown & deep clean · new thermal paste · disc drive recalibration (PS1+PS2 media) · laser cleaned · controller port service · 90-min burn-in",
    inspection: [
      ["Power", true],
      ["Video output", true],
      ["Disc drive (PS1/PS2)", true],
      ["Controller ports ×2", true],
      ["Memory card slots", true],
      ["Expansion bay", true],
      ["Fan & thermals", true],
    ],
    source: "GARAGE_SALE",
    acquisitionCents: 4500,
    partsCents: 2000,
    otherCents: 700,
  },
  {
    inventoryId: "ROG-MAC-0001",
    slug: "mac-mini-m4-256gb-restored",
    name: "Apple Mac Mini M4 256GB — Restored",
    model: "Mac16,10 (2024)",
    platform: "pc-mac",
    category: "Computers",
    condition: "RESTORED",
    cosmeticGrade: "A (near mint)",
    storage: "256GB SSD · 16GB unified memory",
    color: "Silver",
    description:
      "Apple's mighty mini, professionally restored and reset to factory macOS with the latest supported update. Exterior near mint, all ports tested (Thunderbolt, HDMI, Ethernet, USB-C front ports), Wi-Fi/Bluetooth verified, Apple Diagnostics clean, battery-free desktop so zero cycle concerns. A perfect starter machine for retro emulation, a media hub, or a daily driver that sips power. Ships with original-style AC adapter.",
    priceCents: 70000,
    compareAtCents: 79900,
    featured: true,
    accessories: ["AC adapter"],
    defectNotes: null,
    workPerformed:
      "Factory reset & macOS reinstallation · Apple Diagnostics passed · all port function tested · thermal check under load · Wi-Fi/BT verified",
    inspection: [
      ["Power on & boot", true],
      ["Apple Diagnostics", true],
      ["Thunderbolt ports", true],
      ["HDMI output", true],
      ["Front USB-C ports", true],
      ["Ethernet", true],
      ["Wi-Fi + Bluetooth", true],
      ["Speakers & audio out", true],
    ],
    source: "EBAY",
    acquisitionCents: 52000,
    partsCents: 0,
    otherCents: 1500,
  },
];

async function main() {
  console.log("== Retro Ollie Games seed ==");

  // Platforms + categories
  for (const p of PLATFORMS) {
    await db.platform.upsert({ where: { slug: p.slug }, update: {}, create: p });
  }
  for (const c of CATEGORIES) {
    await db.category.upsert({
      where: { slug: c.toLowerCase().replace(/[^a-z0-9]+/g, "-") },
      update: {},
      create: { name: c, slug: c.toLowerCase().replace(/[^a-z0-9]+/g, "-") },
    });
  }
  console.log(`platforms: ${await db.platform.count()} · categories: ${await db.category.count()}`);

  // Service tiers
  for (const t of TIERS) {
    await db.serviceTier.upsert({
      where: { slug: t.slug },
      update: { description: t.description, priceCents: t.priceCents, sortOrder: t.sortOrder },
      create: { ...t, active: true },
    });
  }
  console.log(`service tiers: ${await db.serviceTier.count()}`);

  // Products (idempotent by slug)
  for (const p of PRODUCTS) {
    const platform = await db.platform.findUnique({ where: { slug: p.platform } });
    const category = await db.category.findUnique({
      where: { slug: p.category.toLowerCase().replace(/[^a-z0-9]+/g, "-") },
    });
    if (!platform || !category) throw new Error(`Missing platform/category for ${p.name}`);

    const existing = await db.product.findUnique({ where: { slug: p.slug } });
    if (existing) {
      console.log(`product exists, skipping: ${p.slug}`);
      continue;
    }

    await db.product.create({
      data: {
        inventoryId: p.inventoryId,
        slug: p.slug,
        name: p.name,
        model: p.model,
        platformId: platform.id,
        categoryId: category.id,
        condition: p.condition,
        cosmeticGrade: p.cosmeticGrade,
        storage: p.storage,
        color: p.color,
        description: p.description,
        priceCents: p.priceCents,
        compareAtCents: p.compareAtCents,
        quantity: 1,
        status: "AVAILABLE",
        featured: p.featured,
        defectNotes: p.defectNotes,
        publishedAt: new Date(),
        // Real photo URLs are added via the admin Control Center after the
        // units are photographed (paste absolute https URLs there).
        accessories: { create: p.accessories.map((name) => ({ name })) },
        inspection: {
          create: {
            workPerformed: p.workPerformed,
            completedAt: new Date(),
            items: {
              create: p.inspection.map(([label, passed], i) => ({ label, passed, sort: i })),
            },
          },
        },
        sourcingRecord: {
          create: {
            source: p.source as never,
            acquisitionCents: p.acquisitionCents,
            partsCents: p.partsCents,
            otherCents: p.otherCents,
          },
        },
      },
    });
    console.log(`product created: ${p.name} — $${(p.priceCents / 100).toFixed(0)}`);
  }

  // Admin user (credentials from env, never hardcoded)
  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (adminEmail && adminPassword) {
    const exists = await db.adminUser.findUnique({ where: { email: adminEmail } });
    if (!exists) {
      await db.adminUser.create({
        data: { email: adminEmail, passwordHash: await bcrypt.hash(adminPassword, 12) },
      });
      console.log(`admin user created: ${adminEmail}`);
    } else {
      console.log(`admin user exists: ${adminEmail}`);
    }
  } else {
    console.log("ADMIN_EMAIL / ADMIN_PASSWORD not set — skipping admin user (set them and re-run).");
  }

  console.log("== seed complete ==");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
