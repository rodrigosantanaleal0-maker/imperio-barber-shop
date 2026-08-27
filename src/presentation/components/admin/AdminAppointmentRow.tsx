"use client";

import { useActionState } from "react";
import { updateAppointmentStatusAdminAction, type AdminActionState } from "@/application/admin/actions";
import { Button } from "@/presentation/components/ui/Button";
import { formatCentsToBRL } from "@/infrastructure/formatting/currency";
import type { AdminAppointmentRow as AdminAppointmentRowData } from "@/domain/types/admin";

const STATUS_LABEL: Record<AdminAppointmentRowData["status"], string> = {
  pending_payment: "Aguardando pagamento",
  confirmed: "Confirmado",
  completed: "Concluído",
  canceled: "Cancelado",
  no_show: "Não compareceu",
};

const initialState: AdminActionState = { error: null };

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Sao_Paulo",
  });
}

export function AdminAppointmentRow({ appointment }: { appointment: AdminAppointmentRowData }) {
  const [state, formAction, pending] = useActionState(updateAppointmentStatusAdminAction, initialState);
  const canCancel = appointment.status === "confirmed" || appointment.status === "pending_payment";
  const canFinalize = appointment.status === "confirmed";

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border border-smoke bg-graphite/40 p-5">
      <div>
        <p className="font-display text-heading-m text-champagne">{formatDateTime(appointment.startsAt)}</p>
        <p className="text-body-s text-ivory">{appointment.customerName}</p>
        <p className="text-caption text-muted">
          {appointment.serviceName} · {formatCentsToBRL(appointment.priceCents)} · {appointment.barberName}
        </p>
      </div>

      <div className="flex flex-col items-end gap-2">
        <span className="text-caption text-gold uppercase">{STATUS_LABEL[appointment.status]}</span>

        <div className="flex gap-2">
          {canFinalize && (
            <form action={formAction}>
              <input type="hidden" name="appointmentId" value={appointment.id} />
              <input type="hidden" name="status" value="completed" />
              <Button type="submit" size="sm" disabled={pending}>
                Concluir
              </Button>
            </form>
          )}
          {canFinalize && (
            <form action={formAction}>
              <input type="hidden" name="appointmentId" value={appointment.id} />
              <input type="hidden" name="status" value="no_show" />
              <Button type="submit" variant="ghost" size="sm" disabled={pending}>
                Não compareceu
              </Button>
            </form>
          )}
          {canCancel && (
            <form action={formAction}>
              <input type="hidden" name="appointmentId" value={appointment.id} />
              <input type="hidden" name="status" value="canceled" />
              <Button type="submit" variant="ghost" size="sm" disabled={pending}>
                Cancelar
              </Button>
            </form>
          )}
        </div>
        {state.error && <p className="text-caption text-red-400">{state.error}</p>}
      </div>
    </div>
  );
}
