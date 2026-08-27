import "server-only";
import { createClient } from "@/infrastructure/supabase/server";
import type { AgendaAppointment } from "@/domain/types/staff";
import { AppointmentBusinessError } from "@/application/booking/appointments.service";

const COLUMNS =
  "id, starts_at, ends_at, status, service:services(name, price_cents), customer:customers(full_name, phone)";

type AppointmentRow = {
  id: string;
  starts_at: string;
  ends_at: string;
  status: AgendaAppointment["status"];
  service: { name: string; price_cents: number } | null;
  customer: { full_name: string; phone: string } | null;
};

function toAgendaAppointment(row: AppointmentRow): AgendaAppointment {
  return {
    id: row.id,
    startsAt: row.starts_at,
    endsAt: row.ends_at,
    status: row.status,
    serviceName: row.service?.name ?? "Serviço",
    customerName: row.customer?.full_name ?? "Cliente",
    customerPhone: row.customer?.phone ?? "",
    priceCents: row.service?.price_cents ?? 0,
  };
}

/** RLS restringe automaticamente aos agendamentos do barbeiro autenticado. */
export async function listMyAppointments(fromISO: string, toISO: string): Promise<AgendaAppointment[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("appointments")
    .select(COLUMNS)
    .gte("starts_at", fromISO)
    .lt("starts_at", toISO)
    .order("starts_at", { ascending: true });

  if (error) throw new Error(`Falha ao carregar agenda: ${error.message}`);
  return ((data ?? []) as unknown as AppointmentRow[]).map(toAgendaAppointment);
}

export interface DashboardStats {
  appointmentsToday: number;
  appointmentsMonth: number;
  revenueMonthCents: number;
  nextAppointment: AgendaAppointment | null;
}

export async function getMyDashboardStats(): Promise<DashboardStats> {
  const now = new Date();
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date(todayStart);
  todayEnd.setDate(todayEnd.getDate() + 1);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const [today, month] = await Promise.all([
    listMyAppointments(todayStart.toISOString(), todayEnd.toISOString()),
    listMyAppointments(monthStart.toISOString(), monthEnd.toISOString()),
  ]);

  const nextAppointment =
    today.find((a) => new Date(a.startsAt) > now && a.status === "confirmed") ?? null;

  const revenueMonthCents = month
    .filter((a) => a.status === "completed")
    .reduce((sum, a) => sum + a.priceCents, 0);

  return {
    appointmentsToday: today.length,
    appointmentsMonth: month.length,
    revenueMonthCents,
    nextAppointment,
  };
}

export async function updateMyAppointmentStatus(
  appointmentId: string,
  status: "completed" | "no_show",
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.rpc("barber_update_appointment_status", {
    p_appointment_id: appointmentId,
    p_status: status,
  });

  if (error) throw new AppointmentBusinessError(error.message.split(":")[0]?.trim() ?? error.message);
}
