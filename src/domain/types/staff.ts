export type StaffRole = "barber" | "admin";

export interface Profile {
  id: string;
  fullName: string;
  role: StaffRole;
}

export interface AgendaAppointment {
  id: string;
  startsAt: string;
  endsAt: string;
  status: "pending_payment" | "confirmed" | "completed" | "canceled" | "no_show";
  serviceName: string;
  customerName: string;
  customerPhone: string;
  priceCents: number;
}
