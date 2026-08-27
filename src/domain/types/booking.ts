import type { AppointmentStatus, PaymentStatus, ServiceCategory } from "@/domain/types/database";

export type { AppointmentStatus, PaymentStatus, ServiceCategory };

export interface BookableService {
  id: string;
  name: string;
  description: string | null;
  durationMinutes: number;
  priceCents: number;
  compareAtPriceCents: number | null;
  category: ServiceCategory;
  imageUrl: string | null;
}

export interface BookableBarber {
  id: string;
  fullName: string;
  avatarUrl: string | null;
  bio: string | null;
  specialties: string[];
}

export interface TimeSlot {
  startsAt: string;
  available: boolean;
}

export interface Appointment {
  id: string;
  code: string;
  barberId: string;
  serviceId: string;
  startsAt: string;
  endsAt: string;
  status: AppointmentStatus;
  createdAt: string;
}

export interface CustomerDetails {
  fullName: string;
  phone: string;
  email: string;
}

export interface AppointmentWithDetails extends Appointment {
  service: BookableService;
  barber: BookableBarber;
}

export interface PaymentRecord {
  status: PaymentStatus;
  method: string | null;
  amountCents: number;
  providerPaymentId: string | null;
}
