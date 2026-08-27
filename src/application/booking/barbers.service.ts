import "server-only";
import { createClient } from "@/infrastructure/supabase/server";
import type { BookableBarber } from "@/domain/types/booking";

const COLUMNS = "id, full_name, avatar_url, bio, specialties";

function toBookableBarber(row: {
  id: string;
  full_name: string;
  avatar_url: string | null;
  bio: string | null;
  specialties: string[];
}): BookableBarber {
  return {
    id: row.id,
    fullName: row.full_name,
    avatarUrl: row.avatar_url,
    bio: row.bio,
    specialties: row.specialties,
  };
}

export async function getActiveBarbers(): Promise<BookableBarber[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("barbers").select(COLUMNS).eq("active", true);

  if (error) throw new Error(`Falha ao carregar barbeiros: ${error.message}`);
  return (data ?? []).map(toBookableBarber);
}

export async function getBarbersForService(serviceId: string): Promise<BookableBarber[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("barber_services")
    .select(`barber:barbers!inner(${COLUMNS})`)
    .eq("service_id", serviceId)
    .eq("barber.active", true);

  if (error) throw new Error(`Falha ao carregar barbeiros do serviço: ${error.message}`);
  return ((data ?? []) as unknown as { barber: Parameters<typeof toBookableBarber>[0] }[]).map((row) =>
    toBookableBarber(row.barber),
  );
}

export async function getBarberById(barberId: string): Promise<BookableBarber | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("barbers")
    .select(COLUMNS)
    .eq("id", barberId)
    .eq("active", true)
    .maybeSingle();

  if (error) throw new Error(`Falha ao carregar barbeiro: ${error.message}`);
  return data ? toBookableBarber(data) : null;
}
