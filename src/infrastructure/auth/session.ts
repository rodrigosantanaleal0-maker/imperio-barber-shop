import "server-only";
import { cache } from "react";
import { createClient } from "@/infrastructure/supabase/server";
import type { Profile } from "@/domain/types/staff";

export const getCurrentProfile = cache(async (): Promise<Profile | null> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, role")
    .eq("id", user.id)
    .single();

  if (!profile) return null;

  return { id: profile.id, fullName: profile.full_name, role: profile.role };
});
