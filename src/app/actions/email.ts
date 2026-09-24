"use server";

import { z } from "zod";
import { db } from "@/lib/db";

const schema = z.object({
  email: z.string().email().max(200),
});

export async function subscribeAction(
  _prev: { ok?: boolean; error?: string },
  formData: FormData
): Promise<{ ok?: boolean; error?: string }> {
  const parsed = schema.safeParse(formData.get("email"));
  if (!parsed.success) {
    return { error: "Enter a valid email." };
  }
  const email = parsed.data.email.toLowerCase();
  try {
    await db.emailSubscriber.upsert({
      where: { email },
      update: {},
      create: { email },
    });
    return { ok: true };
  } catch {
    return { error: "Something went wrong. Try again." };
  }
}
