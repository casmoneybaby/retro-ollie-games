import { db } from "@/lib/db";

/** Record sensitive admin operations. Never log secrets. */
export async function logAudit(action: string, detail?: string): Promise<void> {
  try {
    await db.auditLog.create({ data: { action, detail } });
  } catch (err) {
    console.error("audit log failed", err);
  }
}
