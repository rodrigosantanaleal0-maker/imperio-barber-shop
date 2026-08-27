import "server-only";
import { createClient } from "@/infrastructure/supabase/server";
import type { ServiceAdmin } from "@/domain/types/admin";
import type { ServiceCategory } from "@/domain/types/database";

type ServiceRow = {
  id: string;
  name: string;
  description: string | null;
  duration_minutes: number;
  price_cents: number;
  compare_at_price_cents: number | null;
  category: ServiceCategory;
  active: boolean;
  barber_services: { barber_id: string }[];
};

const COLUMNS =
  "id, name, description, duration_minutes, price_cents, compare_at_price_cents, category, active, barber_services(barber_id)";

function toServiceAdmin(row: ServiceRow): ServiceAdmin {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    durationMinutes: row.duration_minutes,
    priceCents: row.price_cents,
    compareAtPriceCents: row.compare_at_price_cents,
    category: row.category,
    active: row.active,
    barberIds: row.barber_services.map((bs) => bs.barber_id),
  };
}

export async function listServicesAdmin(): Promise<ServiceAdmin[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("services").select(COLUMNS).order("name", { ascending: true });

  if (error) throw new Error(`Falha ao carregar serviços: ${error.message}`);
  return ((data ?? []) as unknown as ServiceRow[]).map(toServiceAdmin);
}

export async function getServiceAdmin(id: string): Promise<ServiceAdmin | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("services").select(COLUMNS).eq("id", id).maybeSingle();

  if (error) throw new Error(`Falha ao carregar serviço: ${error.message}`);
  return data ? toServiceAdmin(data as unknown as ServiceRow) : null;
}

export interface ServiceInput {
  name: string;
  description: string | null;
  durationMinutes: number;
  priceCents: number;
  compareAtPriceCents: number | null;
  category: ServiceCategory;
}

export async function createService(input: ServiceInput): Promise<string> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("services")
    .insert({
      name: input.name,
      description: input.description,
      duration_minutes: input.durationMinutes,
      price_cents: input.priceCents,
      compare_at_price_cents: input.compareAtPriceCents,
      category: input.category,
    })
    .select("id")
    .single();

  if (error) throw new Error(`Falha ao criar serviço: ${error.message}`);
  return data.id;
}

export async function updateService(id: string, input: ServiceInput): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("services")
    .update({
      name: input.name,
      description: input.description,
      duration_minutes: input.durationMinutes,
      price_cents: input.priceCents,
      compare_at_price_cents: input.compareAtPriceCents,
      category: input.category,
    })
    .eq("id", id);

  if (error) throw new Error(`Falha ao atualizar serviço: ${error.message}`);
}

export async function setServiceActive(id: string, active: boolean): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("services").update({ active }).eq("id", id);
  if (error) throw new Error(`Falha ao atualizar serviço: ${error.message}`);
}

export async function setServiceBarbers(serviceId: string, barberIds: string[]): Promise<void> {
  const supabase = await createClient();

  const { data: current, error: readError } = await supabase
    .from("barber_services")
    .select("barber_id")
    .eq("service_id", serviceId);
  if (readError) throw new Error(`Falha ao carregar vínculos: ${readError.message}`);

  const currentIds = new Set((current ?? []).map((row) => row.barber_id));
  const nextIds = new Set(barberIds);

  const toInsert = barberIds.filter((id) => !currentIds.has(id));
  const toDelete = [...currentIds].filter((id) => !nextIds.has(id));

  if (toInsert.length > 0) {
    const { error } = await supabase
      .from("barber_services")
      .insert(toInsert.map((barberId) => ({ service_id: serviceId, barber_id: barberId })));
    if (error) throw new Error(`Falha ao vincular barbeiros: ${error.message}`);
  }

  if (toDelete.length > 0) {
    const { error } = await supabase
      .from("barber_services")
      .delete()
      .eq("service_id", serviceId)
      .in("barber_id", toDelete);
    if (error) throw new Error(`Falha ao desvincular barbeiros: ${error.message}`);
  }
}
