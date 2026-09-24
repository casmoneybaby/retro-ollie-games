"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { logAudit } from "@/lib/audit";
import { checkRateLimit } from "@/lib/auth";
import { ServiceStatus } from "@/generated/prisma/enums";

const schema = z.object({
  deviceFamily: z.string().min(1).max(60),
  deviceModel: z.string().max(120).optional().nullable(),
  serviceTierId: z.string().min(1).max(60),
  symptoms: z.string().max(4000).optional().nullable(),
  contactName: z.string().min(1).max(120),
  email: z.string().email().max(200),
  phone: z.string().max(40).optional().nullable(),
  shippingMethod: z.enum(["SHIP_TO_US", "LOCAL_DROP_OFF"]),
  photos: z.array(z.string().url().max(600)).max(8).optional(),
  termsAccepted: z.boolean(),
});

export type ServiceFormState = {
  ok?: boolean;
  jobNumber?: string;
  error?: string;
};

export async function createServiceRequestAction(
  _prev: ServiceFormState,
  formData: FormData
): Promise<ServiceFormState> {
  const raw = {
    deviceFamily: formData.get("deviceFamily"),
    deviceModel: formData.get("deviceModel") || undefined,
    serviceTierId: formData.get("serviceTierId"),
    symptoms: formData.get("symptoms") || undefined,
    contactName: formData.get("contactName"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    shippingMethod: formData.get("shippingMethod"),
    photos: formData.getAll("photos").filter((v): v is string => typeof v === "string" && v.length > 0),
    termsAccepted: formData.get("termsAccepted") === "on",
  };

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return { error: "Please fill in the required fields correctly." };
  }
  if (!parsed.data.termsAccepted) {
    return { error: "Please accept the service terms to continue." };
  }

  // Simple per-email flood guard.
  if (!checkRateLimit(`svc:${parsed.data.email.toLowerCase()}`, 5, 60 * 60 * 1000)) {
    return { error: "Too many requests from this email. Try again later." };
  }

  try {
    const tier = await db.serviceTier.findFirst({
      where: { id: parsed.data.serviceTierId, active: true },
    });
    if (!tier) {
      return { error: "That service tier isn't available. Refresh and try again." };
    }

    const count = await db.serviceRequest.count();
    const jobNumber = `RESPAWN-${String(count + 1).padStart(5, "0")}`;

    const request = await db.serviceRequest.create({
      data: {
        jobNumber,
        deviceFamily: parsed.data.deviceFamily,
        deviceModel: parsed.data.deviceModel ?? null,
        serviceTierId: tier.id,
        symptoms: parsed.data.symptoms ?? null,
        photos: parsed.data.photos ?? [],
        contactName: parsed.data.contactName,
        email: parsed.data.email.toLowerCase(),
        phone: parsed.data.phone ?? null,
        shippingMethod: parsed.data.shippingMethod,
        quotedCents: tier.priceCents,
        depositCents: tier.priceCents, // deposit = full tier price until inspection changes it
        status: ServiceStatus.REQUEST_RECEIVED,
        termsAcceptedAt: new Date(),
        statusEvents: {
          create: {
            status: ServiceStatus.REQUEST_RECEIVED,
            note: "Request created from website",
          },
        },
      },
    });

    await logAudit("service.request.created", `${request.jobNumber} tier=${tier.slug}`);
    return { ok: true, jobNumber: request.jobNumber };
  } catch (err) {
    console.error("service request failed", err);
    return { error: "Something went wrong submitting your request. Please try again." };
  }
}
