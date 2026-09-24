"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { logAudit } from "@/lib/audit";
import { checkRateLimit } from "@/lib/auth";

const schema = z.object({
  device: z.string().min(1).max(120),
  model: z.string().max(120).optional().nullable(),
  conditionDesc: z.string().max(4000).optional().nullable(),
  accessories: z.string().max(400).optional().nullable(),
  askingPrice: z.string().max(40).optional().nullable(),
  contactName: z.string().min(1).max(120),
  email: z.string().email().max(200),
});

export type TradeFormState = { ok?: boolean; error?: string };

export async function createTradeAction(
  _prev: TradeFormState,
  formData: FormData
): Promise<TradeFormState> {
  const parsed = schema.safeParse({
    device: formData.get("device"),
    model: formData.get("model") || undefined,
    conditionDesc: formData.get("conditionDesc") || undefined,
    accessories: formData.get("accessories") || undefined,
    askingPrice: formData.get("askingPrice") || undefined,
    contactName: formData.get("contactName"),
    email: formData.get("email"),
  });
  if (!parsed.success) {
    return { error: "Please fill in the required fields correctly." };
  }

  if (!checkRateLimit(`trade:${parsed.data.email.toLowerCase()}`, 5, 60 * 60 * 1000)) {
    return { error: "Too many requests from this email. Try again later." };
  }

  try {
    await db.tradeSubmission.create({
      data: {
        device: parsed.data.device,
        model: parsed.data.model ?? null,
        conditionDesc: parsed.data.conditionDesc ?? null,
        accessories: parsed.data.accessories ?? null,
        askingPrice: parsed.data.askingPrice ?? null,
        contactName: parsed.data.contactName,
        email: parsed.data.email.toLowerCase(),
      },
    });
    await logAudit("trade.submitted", `${parsed.data.device} from ${parsed.data.email}`);
    return { ok: true };
  } catch (err) {
    console.error("trade submission failed", err);
    return { error: "Something went wrong. Please try again." };
  }
}
