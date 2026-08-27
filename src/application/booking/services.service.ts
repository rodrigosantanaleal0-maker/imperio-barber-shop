import "server-only";
import { createClient } from "@/infrastructure/supabase/server";
import type { BookableService } from "@/domain/types/booking";

const COLUMNS =
  "id, name, description, duration_minutes, price_cents, compare_at_price_cents, category, image_url";

function toBookableService(row: {
  id: string;
  name: string;
  description: string | null;
  duration_minutes: number;
  price_cents: number;
  compare_at_price_cents: number | null;
  category: BookableService["category"];
  image_url: string | null;
}): BookableService {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    durationMinutes: row.duration_minutes,
    priceCents: row.price_cents,
    compareAtPriceCents: row.compare_at_price_cents,
    category: row.category,
    imageUrl: row.image_url,
  };
}

export async function getActiveServices(): Promise<BookableService[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("services")
    .select(COLUMNS)
    .eq("active", true)
    .order("category", { ascending: true });

  if (error) throw new Error(`Falha ao carregar serviços: ${error.message}`);
  return (data ?? []).map(toBookableService);
}

export async function getServiceById(serviceId: string): Promise<BookableService | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("services")
    .select(COLUMNS)
    .eq("id", serviceId)
    .eq("active", true)
    .maybeSingle();

  if (error) throw new Error(`Falha ao carregar serviço: ${error.message}`);
  return data ? toBookableService(data) : null;
}
