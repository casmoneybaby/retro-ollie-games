import { db } from "@/lib/db";
import { ProductStatus, OrderStatus } from "@/generated/prisma/enums";
import { logAudit } from "@/lib/audit";

/**
 * Order lifecycle transitions. All transitions are guarded by the current
 * status so duplicate Stripe webhook deliveries are naturally idempotent.
 */

/** Mark an order PAID and its units SOLD. Returns true if this call did the work. */
export async function completeOrder(opts: {
  orderId: string;
  email?: string | null;
  name?: string | null;
  paymentIntentId?: string | null;
  address?: {
    line1?: string | null;
    line2?: string | null;
    city?: string | null;
    state?: string | null;
    postalCode?: string | null;
    country?: string | null;
  } | null;
}): Promise<boolean> {
  const order = await db.order.findUnique({
    where: { id: opts.orderId },
    include: { items: true },
  });
  if (!order) return false;
  if (order.status !== OrderStatus.PENDING) return false; // already processed

  await db.order.update({
    where: { id: order.id },
    data: {
      status: OrderStatus.PAID,
      email: opts.email ?? order.email,
      name: opts.name ?? order.name,
      stripePaymentIntentId: opts.paymentIntentId ?? order.stripePaymentIntentId,
      addressLine1: opts.address?.line1 ?? order.addressLine1,
      addressLine2: opts.address?.line2 ?? order.addressLine2,
      city: opts.address?.city ?? order.city,
      state: opts.address?.state ?? order.state,
      postalCode: opts.address?.postalCode ?? order.postalCode,
      country: opts.address?.country ?? order.country,
    },
  });

  // Units are now irreversibly sold.
  await db.product.updateMany({
    where: { id: { in: order.items.map((i) => i.productId) }, status: { not: ProductStatus.SOLD } },
    data: { status: ProductStatus.SOLD, publishedAt: undefined },
  });

  await logAudit("order.paid", `${order.number} pi=${opts.paymentIntentId ?? "n/a"}`);
  return true;
}

/** Release a pending order: restock units, mark CANCELLED. Idempotent. */
export async function releaseOrder(orderId: string): Promise<boolean> {
  const order = await db.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });
  if (!order) return false;
  if (order.status !== OrderStatus.PENDING) return false;

  await db.order.update({
    where: { id: order.id },
    data: { status: OrderStatus.CANCELLED },
  });

  for (const item of order.items) {
    const product = await db.product.findUnique({ where: { id: item.productId } });
    if (!product) continue;
    await db.product.update({
      where: { id: product.id },
      data: {
        quantity: { increment: item.quantity },
        status: ProductStatus.AVAILABLE,
      },
    });
  }

  await logAudit("order.released", order.number);
  return true;
}

/** Find a pending order by Stripe checkout session id. */
export async function findPendingOrderBySession(sessionId: string) {
  return db.order.findFirst({
    where: { stripeSessionId: sessionId, status: OrderStatus.PENDING },
    select: { id: true },
  });
}
