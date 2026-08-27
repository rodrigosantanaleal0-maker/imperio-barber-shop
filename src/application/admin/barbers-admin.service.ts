import "server-only";
import { createClient } from "@/infrastructure/supabase/server";
import type { BarberAdmin } from "@/domain/types/admin";

type BarberRow = {
  id: string;
  full_name: string;
  bio: string | null;
  avatar_url: string | null;
  specialties: string[];
  active: boolean;
  profile_id: string | null;
};

function toBarberAdmin(row: BarberRow): BarberAdmin {
  return {
    id: row.id,
    fullName: row.full_name,
    bio: row.bio,
    avatarUrl: row.avatar_url,
    specialties: row.specialties,
    active: row.active,
    hasLoginAccount: row.profile_id !== null,
  };
}

export async function listBarbersAdmin(): Promise<BarberAdmin[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("barbers")
    .select("id, full_name, bio, avatar_url, specialties, active, profile_id")
    .order("full_name", { ascending: true });

  if (error) throw new Error(`Falha ao carregar barbeiros: ${error.message}`);
  return (data ?? []).map(toBarberAdmin);
}

export async function getBarberAdmin(id: string): Promise<BarberAdmin | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("barbers")
    .select("id, full_name, bio, avatar_url, specialties, active, profile_id")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(`Falha ao carregar barbeiro: ${error.message}`);
  return data ? toBarberAdmin(data) : null;
}

export interface BarberProfileInput {
  fullName: string;
  bio: string | null;
  avatarUrl: string | null;
  specialties: string[];
}

export async function createBarberProfile(input: BarberProfileInput): Promise<string> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("barbers")
    .insert({
      full_name: input.fullName,
      bio: input.bio,
      avatar_url: input.avatarUrl,
      specialties: input.specialties,
    })
    .select("id")
    .single();

  if (error) throw new Error(`Falha ao criar barbeiro: ${error.message}`);
  return data.id;
}

export async function updateBarberProfile(id: string, input: BarberProfileInput): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("barbers")
    .update({
      full_name: input.fullName,
      bio: input.bio,
      avatar_url: input.avatarUrl,
      specialties: input.specialties,
    })
    .eq("id", id);

  if (error) throw new Error(`Falha ao atualizar barbeiro: ${error.message}`);
}

export async function setBarberActive(id: string, active: boolean): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("barbers").update({ active }).eq("id", id);
  if (error) throw new Error(`Falha ao atualizar barbeiro: ${error.message}`);
}
