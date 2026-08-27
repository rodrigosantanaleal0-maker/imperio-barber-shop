import "server-only";
import { createClient } from "@/infrastructure/supabase/server";
import { generateAccessToken, hashToken } from "@/infrastructure/security/token";
import { getServiceById } from "@/application/booking/services.service";
import { getBarberById } from "@/application/booking/barbers.service";
import type { Appointment, AppointmentWithDetails, CustomerDetails } from "@/domain/types/booking";
import type { Database } from "@/domain/types/database";

const RPC_ERROR_MESSAGES: Record<string, string> = {
  SERVICE_NOT_FOUND: "Serviço não encontrado ou inativo.",
  BARBER_NOT_FOUND: "Barbeiro não encontrado ou inativo.",
  STARTS_IN_PAST: "Não é possível agendar em um horário que já passou.",
  SLOT_ALREADY_BOOKED: "Este horário acabou de ser reservado. Escolha outro horário.",
  NOT_FOUND_OR_EXPIRED: "Agendamento não encontrado ou link expirado.",
  ALREADY_FINALIZED: "Este agendamento já foi concluído ou cancelado.",
};

export class AppointmentBusinessError extends Error {
  constructor(public code: string) {
    super(RPC_ERROR_MESSAGES[code] ?? "Não foi possível concluir a operação.");
  }
}

function extractRpcErrorCode(message: string): string {
  return message.split(":")[0]?.trim() ?? message;
}

type AppointmentRow = Database["public"]["Tables"]["appointments"]["Row"];

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

export async function createAppointment(input: {
  customer: CustomerDetails;
  barberId: string;
  serviceId: string;
  startsAtISO: string;
}): Promise<{ appointment: Appointment; accessToken: string }> {
  const supabase = await createClient();
  const accessToken = generateAccessToken();

  const { data, error } = await supabase.rpc("create_appointment_public", {
    p_full_name: input.customer.fullName,
    p_phone: input.customer.phone,
    p_email: input.customer.email || null,
    p_barber_id: input.barberId,
    p_service_id: input.serviceId,
    p_starts_at: input.startsAtISO,
    p_access_token_hash: hashToken(accessToken),
  });

  if (error) throw new AppointmentBusinessError(extractRpcErrorCode(error.message));

  return { appointment: toAppointment(data as AppointmentRow), accessToken };
}

export async function getAppointmentByToken(code: string, token: string): Promise<Appointment> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_appointment_by_token", {
    p_code: code,
    p_token_hash: hashToken(token),
  });

  if (error) throw new AppointmentBusinessError(extractRpcErrorCode(error.message));
  return toAppointment(data as AppointmentRow);
}

export async function rescheduleAppointment(
  code: string,
  token: string,
  newStartsAtISO: string,
): Promise<Appointment> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("reschedule_appointment_public", {
    p_code: code,
    p_token_hash: hashToken(token),
    p_new_starts_at: newStartsAtISO,
  });

  if (error) throw new AppointmentBusinessError(extractRpcErrorCode(error.message));
  return toAppointment(data as AppointmentRow);
}

export async function getAppointmentDetailsByToken(
  code: string,
  token: string,
): Promise<AppointmentWithDetails> {
  const appointment = await getAppointmentByToken(code, token);
  const [service, barber] = await Promise.all([
    getServiceById(appointment.serviceId),
    getBarberById(appointment.barberId),
  ]);

  if (!service || !barber) {
    throw new AppointmentBusinessError("NOT_FOUND_OR_EXPIRED");
  }

  return { ...appointment, service, barber };
}

/**
 * Consulta de conveniência sem token (telefone + código). Só leitura — o
 * chamador não deve oferecer remarcar/cancelar a partir deste resultado.
 */
export async function findAppointmentByPhoneAndCode(phone: string, code: string): Promise<Appointment> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("find_appointment_public", {
    p_phone: phone,
    p_code: code,
  });

  if (error) throw new AppointmentBusinessError(extractRpcErrorCode(error.message));
  return toAppointment(data as AppointmentRow);
}

export async function cancelAppointment(code: string, token: string): Promise<Appointment> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("cancel_appointment_public", {
    p_code: code,
    p_token_hash: hashToken(token),
  });

  if (error) throw new AppointmentBusinessError(extractRpcErrorCode(error.message));
  return toAppointment(data as AppointmentRow);
}
