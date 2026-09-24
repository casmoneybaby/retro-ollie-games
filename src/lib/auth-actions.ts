"use server";

import bcrypt from "bcryptjs";
import { z } from "zod";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import {
  createSessionToken,
  setSessionCookie,
  clearSessionCookie,
  verifyPassword,
  checkRateLimit,
  clearRateLimit,
} from "@/lib/auth";
import { logAudit } from "@/lib/audit";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function loginAction(
  _prev: { error?: string },
  formData: FormData
): Promise<{ error?: string }> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: "Enter a valid email and password." };
  }

  const ipKey = `login:${parsed.data.email.toLowerCase()}`;
  if (!checkRateLimit(ipKey, 5, 10 * 60 * 1000)) {
    return { error: "Too many attempts. Try again in a few minutes." };
  }

  const admin = await db.adminUser.findUnique({
    where: { email: parsed.data.email.toLowerCase() },
  });

  const valid =
    admin?.isActive === true &&
    verifyPassword(parsed.data.password, admin.passwordHash);

  if (!valid) {
    return { error: "Invalid credentials." };
  }

  clearRateLimit(ipKey);
  const token = await createSessionToken(admin.email);
  await setSessionCookie(token);
  await logAudit("admin.login", admin.email);
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  await clearSessionCookie();
  redirect("/admin/login");
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}
