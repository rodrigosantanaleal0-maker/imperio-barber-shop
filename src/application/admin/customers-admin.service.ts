import "server-only";
import { createClient } from "@/infrastructure/supabase/server";
import type { CustomerAdmin, CustomerDetail } from "@/domain/types/admin";
import type { AppointmentStatus } from "@/domain/types/database";

type CustomerRow = {
  id: string;
  full_name: string;
  phone: string;
  email: string | null;
  created_at: string;
  appointments: { count: number }[];
};

function toCustomerAdmin(row: CustomerRow): CustomerAdmin {
  return {
    id: row.id,
    fullName: row.full_name,
    phone: row.phone,
    email: row.email,
    createdAt: row.created_at,
    appointmentsCount: row.appointments[0]?.count ?? 0,
  };
}

export async function listCustomers(search?: string): Promise<CustomerAdmin[]> {
  const supabase = await createClient();
  let query = supabase
    .from("customers")
    .select("id, full_name, phone, email, created_at, appointments(count)")
    .order("created_at", { ascending: false });

  if (search) query = query.or(`full_name.ilike.%${search}%,phone.ilike.%${search}%`);

  const { data, error } = await query;
  if (error) throw new Error(`Falha ao carregar clientes: ${error.message}`);
  return ((data ?? []) as unknown as CustomerRow[]).map(toCustomerAdmin);
}

export async function getCustomerDetail(id: string): Promise<CustomerDetail | null> {
  const supabase = await createClient();
  const { data: customer, error: customerError } = await supabase
    .from("customers")
    .select("id, full_name, phone, email, created_at, appointments(count)")
    .eq("id", id)
    .maybeSingle();

  if (customerError) throw new Error(`Falha ao carregar cliente: ${customerError.message}`);
  if (!customer) return null;

  const { data: appointments, error: appointmentsError } = await supabase
    .from("appointments")
    .select("id, starts_at, status, service:services(name, price_cents), barber:barbers(full_name)")
    .eq("customer_id", id)
    .order("starts_at", { ascending: false });

  if (appointmentsError) throw new Error(`Falha ao carregar histórico: ${appointmentsError.message}`);

  type HistoryRow = {
    id: string;
    starts_at: string;
    status: AppointmentStatus;
    service: { name: string; price_cents: number } | null;
    barber: { full_name: string } | null;
  };

  return {
    ...toCustomerAdmin(customer as unknown as CustomerRow),
    appointments: ((appointments ?? []) as unknown as HistoryRow[]).map((row) => ({
      id: row.id,
      startsAt: row.starts_at,
      status: row.status,
      serviceName: row.service?.name ?? "Serviço",
      barberName: row.barber?.full_name ?? "Barbeiro",
      priceCents: row.service?.price_cents ?? 0,
    })),
  };
}

export async function updateCustomerContact(
  id: string,
  input: { fullName: string; email: string | null },
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("customers")
    .update({ full_name: input.fullName, email: input.email })
    .eq("id", id);

  if (error) throw new Error(`Falha ao atualizar cliente: ${error.message}`);
}
