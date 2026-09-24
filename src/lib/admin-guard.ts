import { redirect } from "next/navigation";
import { getSession, type AdminSession } from "@/lib/auth";

/** For server components: redirect to login when there's no admin session. */
export async function requireAdmin(): Promise<AdminSession> {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }
  return session;
}
