"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { SERVICE_STATUS_LABELS } from "@/lib/site";

const schema = z.object({
  jobNumber: z.string().min(5).max(40),
  email: z.string().email().max(200),
});

export type JobStatusView = {
  jobNumber: string;
  email: string;
  deviceFamily: string;
  deviceModel: string | null;
  tierName: string;
  status: string;
  statusLabel: string;
  quotedCents: number;
  depositCents: number;
  depositPaid: boolean;
  timeline: Array<{ status: string; label: string; at: string; note: string | null }>;
};

export async function lookupJobAction(
  _prev: unknown,
  formData: FormData
): Promise<{ error: string } | { job: JobStatusView } | null> {
  const parsed = schema.safeParse({
    jobNumber: formData.get("jobNumber"),
    email: formData.get("email"),
  });
  if (!parsed.success) {
    return { error: "Enter your job number (RESPAWN-XXXXX) and your email." };
  }

  const request = await db.serviceRequest.findFirst({
    where: {
      jobNumber: parsed.data.jobNumber.trim().toUpperCase(),
      email: parsed.data.email.toLowerCase(),
    },
    include: {
      serviceTier: true,
      statusEvents: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!request) {
    return { error: "No job found with those details. Check the number and email." };
  }

  return {
    job: {
      jobNumber: request.jobNumber,
      email: request.email,
      deviceFamily: request.deviceFamily,
      deviceModel: request.deviceModel,
      tierName: request.serviceTier.name,
      status: request.status,
      statusLabel: SERVICE_STATUS_LABELS[request.status] ?? request.status,
      quotedCents: request.quotedCents,
      depositCents: request.depositCents,
      depositPaid: request.depositPaidAt !== null,
      timeline: request.statusEvents.map((e) => ({
        status: e.status,
        label: SERVICE_STATUS_LABELS[e.status] ?? e.status,
        at: e.createdAt.toISOString().slice(0, 16).replace("T", " "),
        // notes are internal-only; never render them publicly
        note: null,
      })),
    },
  };
}
