import "server-only";
import { createClient } from "@/infrastructure/supabase/server";
import type { AdminAppointmentRow } from "@/domain/types/admin";
import type { AppointmentStatus } from "@/domain/types/database";

const COLUMNS =
  "id, starts_at, ends_at, status, service:services(name, price_cents), barber:barbers(id, full_name), customer:customers(full_name, phone)";

type AppointmentRow = {
  id: string;
  starts_at: string;
  ends_at: string;
  status: AppointmentStatus;
  service: { name: string; price_cents: number } | null;
  barber: { id: string; full_name: string } | null;
  customer: { full_name: string; phone: string } | null;
};

function toAdminAppointmentRow(row: AppointmentRow): AdminAppointmentRow {
  return {
    id: row.id,
    startsAt: row.starts_at,
    endsAt: row.ends_at,
    status: row.status,
    serviceName: row.service?.name ?? "Serviço",
    priceCents: row.service?.price_cents ?? 0,
    barberId: row.barber?.id ?? "",
    barberName: row.barber?.full_name ?? "Barbeiro",
    customerName: row.customer?.full_name ?? "Cliente",
    customerPhone: row.customer?.phone ?? "",
  };
}

export async function listAllAppointments(filters: {
  fromISO: string;
  toISO: string;
  barberId?: string;
  status?: AppointmentStatus;
}): Promise<AdminAppointmentRow[]> {
  const supabase = await createClient();
  let query = supabase
    .from("appointments")
    .select(COLUMNS)
    .gte("starts_at", filters.fromISO)
    .lt("starts_at", filters.toISO)
    .order("starts_at", { ascending: true });

  if (filters.barberId) query = query.eq("barber_id", filters.barberId);
  if (filters.status) query = query.eq("status", filters.status);

  const { data, error } = await query;
  if (error) throw new Error(`Falha ao carregar agenda geral: ${error.message}`);
  return ((data ?? []) as unknown as AppointmentRow[]).map(toAdminAppointmentRow);
}

export async function updateAppointmentStatusAsAdmin(
  appointmentId: string,
  status: AppointmentStatus,
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("appointments").update({ status }).eq("id", appointmentId);
  if (error) throw new Error(`Falha ao atualizar agendamento: ${error.message}`);
}
