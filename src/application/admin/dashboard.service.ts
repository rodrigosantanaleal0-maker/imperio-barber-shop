import "server-only";
import { createClient } from "@/infrastructure/supabase/server";
import type {
  DashboardTotals,
  RevenueByDayPoint,
  StatusBreakdownPoint,
  TopServicePoint,
  BarberPerformancePoint,
} from "@/domain/types/admin";

export async function getDashboardTotals(fromDate: string, toDate: string): Promise<DashboardTotals> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .rpc("admin_dashboard_totals", { p_from: fromDate, p_to: toDate })
    .single();

  if (error) throw new Error(`Falha ao carregar totais: ${error.message}`);
  return {
    revenueCents: data.revenue_cents,
    appointmentsCount: data.appointments_count,
    completedCount: data.completed_count,
    canceledCount: data.canceled_count,
    noShowCount: data.no_show_count,
    newCustomersCount: data.new_customers_count,
  };
}

export async function getRevenueByDay(fromDate: string, toDate: string): Promise<RevenueByDayPoint[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("admin_revenue_by_day", { p_from: fromDate, p_to: toDate });

  if (error) throw new Error(`Falha ao carregar receita por dia: ${error.message}`);
  return (data ?? []).map((row) => ({ day: row.day, revenueCents: row.revenue_cents }));
}

export async function getAppointmentsByStatus(
  fromDate: string,
  toDate: string,
): Promise<StatusBreakdownPoint[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("admin_appointments_by_status", {
    p_from: fromDate,
    p_to: toDate,
  });

  if (error) throw new Error(`Falha ao carregar status: ${error.message}`);
  return (data ?? []).map((row) => ({ status: row.status, count: row.count }));
}

export async function getTopServices(
  fromDate: string,
  toDate: string,
  limit = 5,
): Promise<TopServicePoint[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("admin_top_services", {
    p_from: fromDate,
    p_to: toDate,
    p_limit: limit,
  });

  if (error) throw new Error(`Falha ao carregar serviços mais vendidos: ${error.message}`);
  return (data ?? []).map((row) => ({
    serviceId: row.service_id,
    serviceName: row.service_name,
    count: row.count,
    revenueCents: row.revenue_cents,
  }));
}

export async function getBarberPerformance(
  fromDate: string,
  toDate: string,
): Promise<BarberPerformancePoint[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("admin_barber_performance", {
    p_from: fromDate,
    p_to: toDate,
  });

  if (error) throw new Error(`Falha ao carregar performance dos barbeiros: ${error.message}`);
  return (data ?? []).map((row) => ({
    barberId: row.barber_id,
    barberName: row.barber_name,
    appointmentsCount: row.appointments_count,
    revenueCents: row.revenue_cents,
  }));
}
