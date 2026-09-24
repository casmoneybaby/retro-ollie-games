"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { checkRateLimit } from "@/lib/auth";

const schema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email().max(200),
  subject: z.string().max(120).optional().nullable(),
  message: z.string().min(1).max(5000),
});

export type ContactFormState = { ok?: boolean; error?: string };

export async function sendContactAction(
  _prev: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const parsed = schema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    subject: formData.get("subject") || undefined,
    message: formData.get("message"),
  });
  if (!parsed.success) {
    return { error: "Please fill in all required fields." };
  }

  if (!checkRateLimit(`contact:${parsed.data.email.toLowerCase()}`, 5, 60 * 60 * 1000)) {
    return { error: "Too many messages from this email. Try again later." };
  }

  try {
    await db.contactMessage.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email.toLowerCase(),
        subject: parsed.data.subject ?? null,
        message: parsed.data.message,
      },
    });
    return { ok: true };
  } catch (err) {
    console.error("contact message failed", err);
    return { error: "Something went wrong. Please try again." };
  }
}
