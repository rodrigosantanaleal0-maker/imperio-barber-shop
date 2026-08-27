import "server-only";
import { createClient } from "@/infrastructure/supabase/server";
import { hashToken } from "@/infrastructure/security/token";
import { getPaymentGateway } from "@/infrastructure/payments/payment-gateway.factory";
import type { PaymentMethod } from "@/infrastructure/payments/gateway.interface";
import { AppointmentBusinessError } from "@/application/booking/appointments.service";
import type { Appointment, CustomerDetails, PaymentRecord } from "@/domain/types/booking";
import type { Database } from "@/domain/types/database";

type AppointmentRow = Database["public"]["Tables"]["appointments"]["Row"];

function extractRpcErrorCode(message: string): string {
  return message.split(":")[0]?.trim() ?? message;
}

function toAppointment(row: AppointmentRow): Appointment {
  return {
    id: row.id,
    code: row.code,
    barberId: row.barber_id,
    serviceId: row.service_id,
    startsAt: row.starts_at,
    endsAt: row.ends_at,
    status: row.status,
    createdAt: row.created_at,
  };
}

/** Cria o pagamento no gateway (mock por enquanto) e registra o resultado via RPC. */
export async function payForAppointment(input: {
  code: string;
  token: string;
  amountCents: number;
  method: PaymentMethod;
  customer: CustomerDetails;
}): Promise<Appointment> {
  const gateway = getPaymentGateway();

  const result =
    input.method === "local"
      ? { providerPaymentId: null, status: "pending" as const }
      : await gateway.createPayment({
          appointmentId: input.code,
          amountCents: input.amountCents,
          method: input.method,
          description: "Império Barber Shop",
          payer: { name: input.customer.fullName, email: input.customer.email || undefined },
        });

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("record_payment_public", {
    p_code: input.code,
    p_token_hash: hashToken(input.token),
    p_provider: input.method === "local" ? "local" : gateway.providerName,
    p_provider_payment_id: result.providerPaymentId,
    p_amount_cents: input.amountCents,
    p_method: input.method,
    p_status: input.method === "local" ? "pending" : result.status === "approved" ? "paid" : "failed",
  });

  if (error) throw new AppointmentBusinessError(extractRpcErrorCode(error.message));
  return toAppointment(data as AppointmentRow);
}

export async function getPaymentByToken(code: string, token: string): Promise<PaymentRecord | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_payment_by_token", {
    p_code: code,
    p_token_hash: hashToken(token),
  });

  if (error) throw new AppointmentBusinessError(extractRpcErrorCode(error.message));
  if (!data) return null;

  const row = data as Database["public"]["Tables"]["payments"]["Row"];
  return {
    status: row.status,
    method: row.method,
    amountCents: row.amount_cents,
    providerPaymentId: row.provider_payment_id,
  };
}
