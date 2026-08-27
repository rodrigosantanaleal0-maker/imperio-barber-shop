"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createBarberProfile,
  updateBarberProfile,
  setBarberActive,
  type BarberProfileInput,
} from "@/application/admin/barbers-admin.service";
import {
  createService,
  updateService,
  setServiceActive,
  setServiceBarbers,
  type ServiceInput,
} from "@/application/admin/services-admin.service";
import { updateCustomerContact } from "@/application/admin/customers-admin.service";
import { updateAppointmentStatusAsAdmin } from "@/application/admin/appointments-admin.service";
import { reaisToCents } from "@/infrastructure/formatting/currency";
import type { AppointmentStatus, ServiceCategory } from "@/domain/types/database";

export type AdminActionState = { error: string | null };
const OK: AdminActionState = { error: null };

function parseSpecialties(raw: string): string[] {
  return raw
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function toBarberInput(formData: FormData): BarberProfileInput {
  return {
    fullName: String(formData.get("fullName") ?? ""),
    bio: String(formData.get("bio") ?? "").trim() || null,
    avatarUrl: String(formData.get("avatarUrl") ?? "").trim() || null,
    specialties: parseSpecialties(String(formData.get("specialties") ?? "")),
  };
}

export async function createBarberAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  try {
    await createBarberProfile(toBarberInput(formData));
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Falha ao criar barbeiro." };
  }

  revalidatePath("/admin/barbeiros");
  redirect("/admin/barbeiros");
}

export async function updateBarberAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const barberId = String(formData.get("barberId") ?? "");

  try {
    await updateBarberProfile(barberId, toBarberInput(formData));
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Falha ao atualizar barbeiro." };
  }

  revalidatePath("/admin/barbeiros");
  revalidatePath(`/admin/barbeiros/${barberId}`);
  return OK;
}

export async function toggleBarberActiveAction(formData: FormData): Promise<void> {
  const barberId = String(formData.get("barberId") ?? "");
  const active = formData.get("active") === "true";
  await setBarberActive(barberId, active);
  revalidatePath("/admin/barbeiros");
}

function toServiceInput(formData: FormData): ServiceInput {
  const compareAtRaw = String(formData.get("compareAtPrice") ?? "").trim();
  return {
    name: String(formData.get("name") ?? ""),
    description: String(formData.get("description") ?? "").trim() || null,
    durationMinutes: Number(formData.get("durationMinutes")),
    priceCents: reaisToCents(Number(formData.get("price"))),
    compareAtPriceCents: compareAtRaw ? reaisToCents(Number(compareAtRaw)) : null,
    category: String(formData.get("category") ?? "corte") as ServiceCategory,
  };
}

export async function createServiceAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const barberIds = formData.getAll("barberIds").map(String);

  try {
    const serviceId = await createService(toServiceInput(formData));
    await setServiceBarbers(serviceId, barberIds);
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Falha ao criar serviço." };
  }

  revalidatePath("/admin/servicos");
  redirect("/admin/servicos");
}

export async function updateServiceAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const serviceId = String(formData.get("serviceId") ?? "");
  const barberIds = formData.getAll("barberIds").map(String);

  try {
    await updateService(serviceId, toServiceInput(formData));
    await setServiceBarbers(serviceId, barberIds);
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Falha ao atualizar serviço." };
  }

  revalidatePath("/admin/servicos");
  revalidatePath(`/admin/servicos/${serviceId}`);
  return OK;
}

export async function toggleServiceActiveAction(formData: FormData): Promise<void> {
  const serviceId = String(formData.get("serviceId") ?? "");
  const active = formData.get("active") === "true";
  await setServiceActive(serviceId, active);
  revalidatePath("/admin/servicos");
}

export async function updateCustomerAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const customerId = String(formData.get("customerId") ?? "");
  const fullName = String(formData.get("fullName") ?? "");
  const email = String(formData.get("email") ?? "").trim() || null;

  try {
    await updateCustomerContact(customerId, { fullName, email });
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Falha ao atualizar cliente." };
  }

  revalidatePath("/admin/clientes");
  revalidatePath(`/admin/clientes/${customerId}`);
  return OK;
}

export async function updateAppointmentStatusAdminAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const appointmentId = String(formData.get("appointmentId") ?? "");
  const status = String(formData.get("status") ?? "") as AppointmentStatus;

  try {
    await updateAppointmentStatusAsAdmin(appointmentId, status);
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Falha ao atualizar agendamento." };
  }

  revalidatePath("/admin/agenda");
  return OK;
}
