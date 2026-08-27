"use server";

import { revalidatePath } from "next/cache";
import {
  updateMyAppointmentStatus,
} from "@/application/staff/agenda.service";
import {
  createMyAvailabilityWindow,
  deleteMyAvailabilityWindow,
  createMyAvailabilityException,
  deleteMyAvailabilityException,
} from "@/application/staff/availability-admin.service";

export type StaffActionState = { error: string | null };
const OK: StaffActionState = { error: null };

export async function markAppointmentAction(
  _prev: StaffActionState,
  formData: FormData,
): Promise<StaffActionState> {
  const appointmentId = String(formData.get("appointmentId") ?? "");
  const status = String(formData.get("status") ?? "") as "completed" | "no_show";

  try {
    await updateMyAppointmentStatus(appointmentId, status);
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Falha ao atualizar." };
  }

  revalidatePath("/barbeiro/agenda");
  revalidatePath("/barbeiro");
  return OK;
}

export async function createAvailabilityWindowAction(
  _prev: StaffActionState,
  formData: FormData,
): Promise<StaffActionState> {
  const weekday = Number(formData.get("weekday"));
  const startTime = String(formData.get("startTime") ?? "");
  const endTime = String(formData.get("endTime") ?? "");

  try {
    await createMyAvailabilityWindow({ weekday, startTime, endTime });
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Falha ao salvar." };
  }

  revalidatePath("/barbeiro/disponibilidade");
  return OK;
}

export async function deleteAvailabilityWindowAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  await deleteMyAvailabilityWindow(id);
  revalidatePath("/barbeiro/disponibilidade");
}

export async function createAvailabilityExceptionAction(
  _prev: StaffActionState,
  formData: FormData,
): Promise<StaffActionState> {
  const dateISO = String(formData.get("date") ?? "");
  const isFullDay = formData.get("isFullDay") === "on";
  const startTime = String(formData.get("startTime") ?? "");
  const endTime = String(formData.get("endTime") ?? "");
  const reason = String(formData.get("reason") ?? "");

  try {
    await createMyAvailabilityException({ dateISO, isFullDay, startTime, endTime, reason });
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Falha ao salvar." };
  }

  revalidatePath("/barbeiro/disponibilidade");
  return OK;
}

export async function deleteAvailabilityExceptionAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  await deleteMyAvailabilityException(id);
  revalidatePath("/barbeiro/disponibilidade");
}
