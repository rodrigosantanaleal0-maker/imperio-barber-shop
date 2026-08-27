"use client";

import { useActionState } from "react";
import { markAppointmentAction, type StaffActionState } from "@/application/staff/actions";
import { Button } from "@/presentation/components/ui/Button";
import { formatCentsToBRL } from "@/infrastructure/formatting/currency";
import type { AgendaAppointment } from "@/domain/types/staff";

const STATUS_LABEL: Record<AgendaAppointment["status"], string> = {
  pending_payment: "Aguardando pagamento",
  confirmed: "Confirmado",
  completed: "Concluído",
  canceled: "Cancelado",
  no_show: "Não compareceu",
};

const initialState: StaffActionState = { error: null };

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Sao_Paulo",
  });
}

export function AgendaAppointmentCard({ appointment }: { appointment: AgendaAppointment }) {
  const [state, formAction, pending] = useActionState(markAppointmentAction, initialState);

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border border-smoke bg-graphite/40 p-5">
      <div>
        <p className="font-display text-heading-m text-champagne">{formatTime(appointment.startsAt)}</p>
        <p className="text-body-s text-ivory">{appointment.customerName}</p>
        <p className="text-caption text-muted">
          {appointment.serviceName} · {formatCentsToBRL(appointment.priceCents)}
        </p>
      </div>

      <div className="flex flex-col items-end gap-2">
        <span className="text-caption text-gold uppercase">{STATUS_LABEL[appointment.status]}</span>

        {appointment.status === "confirmed" && (
          <form action={formAction} className="flex gap-2">
            <input type="hidden" name="appointmentId" value={appointment.id} />
            <input type="hidden" name="status" value="completed" />
            <Button type="submit" size="sm" disabled={pending}>
              Concluir
            </Button>
          </form>
        )}
        {appointment.status === "confirmed" && (
          <form action={formAction}>
            <input type="hidden" name="appointmentId" value={appointment.id} />
            <input type="hidden" name="status" value="no_show" />
            <Button type="submit" variant="ghost" size="sm" disabled={pending}>
              Marcar não compareceu
            </Button>
          </form>
        )}
        {state.error && <p className="text-caption text-red-400">{state.error}</p>}
      </div>
    </div>
  );
}
