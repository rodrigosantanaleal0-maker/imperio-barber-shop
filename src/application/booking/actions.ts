"use server";

import { redirect } from "next/navigation";
import { getAvailableSlots, getResolvedSlotsAcrossBarbers } from "@/application/booking/availability.service";
import {
  createAppointment,
  rescheduleAppointment,
  cancelAppointment,
  findAppointmentByPhoneAndCode,
  AppointmentBusinessError,
} from "@/application/booking/appointments.service";
import { payForAppointment } from "@/application/booking/payments.service";
import type { PaymentMethod } from "@/infrastructure/payments/gateway.interface";
import type { Appointment, TimeSlot } from "@/domain/types/booking";

export async function getSlotsAction(
  barberId: string,
  serviceId: string,
  dateISO: string,
): Promise<TimeSlot[]> {
  return getAvailableSlots({ barberId, serviceId, dateISO });
}

export async function getResolvedSlotsAction(
  barberIds: string[],
  serviceId: string,
  dateISO: string,
) {
  return getResolvedSlotsAcrossBarbers({ barberIds, serviceId, dateISO });
}

export type ActionState = { error: string | null };

export async function createBookingAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const barberId = String(formData.get("barberId") ?? "");
  const serviceId = String(formData.get("serviceId") ?? "");
  const startsAtISO = String(formData.get("startsAt") ?? "");
  const fullName = String(formData.get("fullName") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();

  if (!fullName || !phone) {
    return { error: "Preencha nome e telefone." };
  }

  let appointment: Appointment;
  let accessToken: string;
  try {
    ({ appointment, accessToken } = await createAppointment({
      customer: { fullName, phone, email },
      barberId,
      serviceId,
      startsAtISO,
    }));
  } catch (error) {
    if (error instanceof AppointmentBusinessError) return { error: error.message };
    throw error;
  }

  redirect(`/agendar/pagamento?code=${appointment.code}&token=${accessToken}`);
}

export async function payAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const code = String(formData.get("code") ?? "");
  const token = String(formData.get("token") ?? "");
  const method = String(formData.get("method") ?? "") as PaymentMethod;
  const amountCents = Number(formData.get("amountCents") ?? 0);
  const fullName = String(formData.get("fullName") ?? "");
  const email = String(formData.get("email") ?? "");

  try {
    await payForAppointment({
      code,
      token,
      amountCents,
      method,
      customer: { fullName, phone: "", email },
    });
  } catch (error) {
    if (error instanceof AppointmentBusinessError) return { error: error.message };
    throw error;
  }

  redirect(`/agendar/confirmado?code=${code}&token=${token}`);
}

export async function rescheduleAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const code = String(formData.get("code") ?? "");
  const token = String(formData.get("token") ?? "");
  const newStartsAt = String(formData.get("newStartsAt") ?? "");

  try {
    await rescheduleAppointment(code, token, newStartsAt);
  } catch (error) {
    if (error instanceof AppointmentBusinessError) return { error: error.message };
    throw error;
  }

  redirect(`/meu-agendamento/${code}?token=${token}`);
}

export async function cancelAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const code = String(formData.get("code") ?? "");
  const token = String(formData.get("token") ?? "");

  try {
    await cancelAppointment(code, token);
  } catch (error) {
    if (error instanceof AppointmentBusinessError) return { error: error.message };
    throw error;
  }

  redirect(`/meu-agendamento/${code}?token=${token}`);
}

export type LookupState = { error: string | null; result: Appointment | null };

export async function lookupAction(_prev: LookupState, formData: FormData): Promise<LookupState> {
  const phone = String(formData.get("phone") ?? "").trim();
  const code = String(formData.get("code") ?? "").trim();

  if (!phone || !code) {
    return { error: "Preencha telefone e código do agendamento.", result: null };
  }

  try {
    const result = await findAppointmentByPhoneAndCode(phone, code);
    return { error: null, result };
  } catch (error) {
    if (error instanceof AppointmentBusinessError) return { error: error.message, result: null };
    throw error;
  }
}
