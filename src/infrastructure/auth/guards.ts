import "server-only";
import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/infrastructure/auth/session";
import type { Profile, StaffRole } from "@/domain/types/staff";

const LOGIN_PATH: Record<StaffRole, string> = {
  barber: "/barbeiro/login",
  admin: "/admin/login",
};

/** Chamar no topo de todo layout/page protegida. Revalida a role a cada request. */
export async function requireRole(role: StaffRole): Promise<Profile> {
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect(LOGIN_PATH[role]);
  }

  if (profile.role !== role && profile.role !== "admin") {
    redirect("/");
  }

  return profile;
}
