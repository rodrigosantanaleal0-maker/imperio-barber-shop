import "server-only";
import { createClient } from "@/infrastructure/supabase/server";
import type { Database } from "@/domain/types/database";

type AvailabilityWindow = Database["public"]["Tables"]["availability"]["Row"];
type AvailabilityException = Database["public"]["Tables"]["availability_exceptions"]["Row"];

async function getMyBarberId(): Promise<string> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado.");

  const { data, error } = await supabase
    .from("barbers")
    .select("id")
    .eq("profile_id", user.id)
    .single();

  if (error || !data) throw new Error("Conta não está vinculada a um barbeiro.");
  return data.id;
}

export async function listMyAvailability(): Promise<AvailabilityWindow[]> {
  const barberId = await getMyBarberId();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("availability")
    .select("*")
    .eq("barber_id", barberId)
    .order("weekday", { ascending: true })
    .order("start_time", { ascending: true });

  if (error) throw new Error(`Falha ao carregar disponibilidade: ${error.message}`);
  return data ?? [];
}

export async function createMyAvailabilityWindow(input: {
  weekday: number;
  startTime: string;
  endTime: string;
}): Promise<void> {
  if (input.endTime <= input.startTime) {
    throw new Error("O horário final precisa ser depois do horário inicial.");
  }

  const barberId = await getMyBarberId();
  const supabase = await createClient();
  const { error } = await supabase.from("availability").insert({
    barber_id: barberId,
    weekday: input.weekday,
    start_time: input.startTime,
    end_time: input.endTime,
  });

  if (error) throw new Error(`Falha ao criar janela de disponibilidade: ${error.message}`);
}

export async function deleteMyAvailabilityWindow(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("availability").delete().eq("id", id);
  if (error) throw new Error(`Falha ao remover janela de disponibilidade: ${error.message}`);
}

export async function listMyAvailabilityExceptions(): Promise<AvailabilityException[]> {
  const barberId = await getMyBarberId();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("availability_exceptions")
    .select("*")
    .eq("barber_id", barberId)
    .gte("date", new Date().toISOString().slice(0, 10))
    .order("date", { ascending: true });

  if (error) throw new Error(`Falha ao carregar folgas/bloqueios: ${error.message}`);
  return data ?? [];
}

export async function createMyAvailabilityException(input: {
  dateISO: string;
  isFullDay: boolean;
  startTime?: string;
  endTime?: string;
  reason?: string;
}): Promise<void> {
  const barberId = await getMyBarberId();
  const supabase = await createClient();
  const { error } = await supabase.from("availability_exceptions").insert({
    barber_id: barberId,
    date: input.dateISO,
    is_full_day: input.isFullDay,
    start_time: input.isFullDay ? null : (input.startTime ?? null),
    end_time: input.isFullDay ? null : (input.endTime ?? null),
    reason: input.reason ?? null,
  });

  if (error) throw new Error(`Falha ao criar folga/bloqueio: ${error.message}`);
}

export async function deleteMyAvailabilityException(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("availability_exceptions").delete().eq("id", id);
  if (error) throw new Error(`Falha ao remover folga/bloqueio: ${error.message}`);
}
