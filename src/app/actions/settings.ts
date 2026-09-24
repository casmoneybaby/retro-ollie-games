"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { logAudit } from "@/lib/audit";

async function assertAdmin() {
  const session = await getSession();
  if (!session) throw new Error("unauthorized");
  return session;
}

const checklistSchema = z.object({
  items: z.array(z.string().min(1).max(120)).min(1).max(15),
});

export async function saveRefurbChecklistAction(
  _prev: { ok?: boolean; error?: string },
  formData: FormData
): Promise<{ ok?: boolean; error?: string }> {
  try {
    await assertAdmin();
  } catch {
    return { error: "Unauthorized." };
  }

  const items = formData
    .getAll("checklistItem")
    .map((v) => String(v).trim())
    .filter(Boolean)
    .slice(0, 15);

  const parsed = checklistSchema.safeParse({ items });
  if (!parsed.success) {
    return { error: "Keep at least one service item, each under 120 characters." };
  }

  await db.siteSetting.upsert({
    where: { key: "refurb_checklist" },
    update: { value: JSON.stringify(parsed.data.items) },
    create: { key: "refurb_checklist", value: JSON.stringify(parsed.data.items) },
  });

  await logAudit("settings.refurb_checklist", `${parsed.data.items.length} items`);
  revalidatePath("/");
  revalidatePath("/admin/settings");
  return { ok: true };
}

export async function updateTierAction(formData: FormData): Promise<void> {
  await assertAdmin();
  const id = String(formData.get("id") ?? "");
  const dollars = Number(formData.get("price") ?? -1);
  const active = formData.get("active") === "on";
  if (!id || !Number.isFinite(dollars) || dollars < 0) return;

  await db.serviceTier.update({
    where: { id },
    data: { priceCents: Math.round(dollars * 100), active },
  });
  await logAudit("settings.tier", `${id} price=${Math.round(dollars * 100)} active=${active}`);
  revalidatePath("/admin/settings");
  revalidatePath("/refurbishment");
  revalidatePath("/");
}
