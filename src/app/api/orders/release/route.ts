import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { releaseOrder } from "@/lib/order-lifecycle";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";

const schema = z.object({
  sessionId: z.string().min(1).max(300),
  secret: z.string().min(1).max(200),
});

/** Internal release hook (CRON_SECRET or admin session) to restock abandoned checkouts. */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const authorized =
    (process.env.CRON_SECRET && parsed.data.secret === process.env.CRON_SECRET) ||
    (await getSession()) !== null;

  if (!authorized) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { findPendingOrderBySession } = await import("@/lib/order-lifecycle");
  const order = await findPendingOrderBySession(parsed.data.sessionId);
  if (!order) {
    return NextResponse.json({ released: false, reason: "not_pending_or_missing" });
  }

  const ok = await releaseOrder(order.id);
  return NextResponse.json({ released: ok });
}
