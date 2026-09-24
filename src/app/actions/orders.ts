"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { OrderStatus } from "@/generated/prisma/enums";

const schema = z.object({
  number: z.string().min(3).max(40),
  email: z.string().email().max(200),
});

export type CustomerOrderView = {
  number: string;
  status: keyof typeof OrderStatus;
  createdAt: string;
  totalCents: number;
  items: Array<{
    id: string;
    nameSnapshot: string;
    inventoryIdSnapshot: string;
    unitPriceCents: number;
  }>;
};

export async function lookupOrderAction(
  _prev: unknown,
  formData: FormData
): Promise<{ error: string } | { order: CustomerOrderView } | null> {
  const parsed = schema.safeParse({
    number: formData.get("number"),
    email: formData.get("email"),
  });
  if (!parsed.success) {
    return { error: "Enter your order number and the email you used at checkout." };
  }

  const order = await db.order.findFirst({
    where: {
      number: parsed.data.number.trim().toUpperCase(),
      email: parsed.data.email.toLowerCase(),
    },
    include: { items: true },
  });

  if (!order || order.status === OrderStatus.PENDING) {
    // PENDING orders aren't confirmed purchases; don't surface them.
    return { error: "No confirmed order found with those details." };
  }

  return {
    order: {
      number: order.number,
      status: order.status as keyof typeof OrderStatus,
      createdAt: order.createdAt.toISOString().slice(0, 10),
      totalCents: order.totalCents,
      items: order.items.map((i) => ({
        id: i.id,
        nameSnapshot: i.nameSnapshot,
        inventoryIdSnapshot: i.inventoryIdSnapshot,
        unitPriceCents: i.unitPriceCents,
      })),
    },
  };
}
