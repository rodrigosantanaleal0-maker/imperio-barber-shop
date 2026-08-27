import type { AppointmentStatus, ServiceCategory } from "@/domain/types/database";

export interface AdminAppointmentRow {
  id: string;
  startsAt: string;
  endsAt: string;
  status: AppointmentStatus;
  serviceName: string;
  priceCents: number;
  barberId: string;
  barberName: string;
  customerName: string;
  customerPhone: string;
}

export interface BarberAdmin {
  id: string;
  fullName: string;
  bio: string | null;
  avatarUrl: string | null;
  specialties: string[];
  active: boolean;
  hasLoginAccount: boolean;
}

export interface ServiceAdmin {
  id: string;
  name: string;
  description: string | null;
  durationMinutes: number;
  priceCents: number;
  compareAtPriceCents: number | null;
  category: ServiceCategory;
  active: boolean;
  barberIds: string[];
}

export interface CustomerAdmin {
  id: string;
  fullName: string;
  phone: string;
  email: string | null;
  createdAt: string;
  appointmentsCount: number;
}

export interface CustomerDetail extends CustomerAdmin {
  appointments: {
    id: string;
    startsAt: string;
    status: AppointmentStatus;
    serviceName: string;
    barberName: string;
    priceCents: number;
  }[];
}

export interface DashboardTotals {
  revenueCents: number;
  appointmentsCount: number;
  completedCount: number;
  canceledCount: number;
  noShowCount: number;
  newCustomersCount: number;
}

export interface RevenueByDayPoint {
  day: string;
  revenueCents: number;
}

export interface StatusBreakdownPoint {
  status: AppointmentStatus;
  count: number;
}

export interface TopServicePoint {
  serviceId: string;
  serviceName: string;
  count: number;
  revenueCents: number;
}

export interface BarberPerformancePoint {
  barberId: string;
  barberName: string;
  appointmentsCount: number;
  revenueCents: number;
}
