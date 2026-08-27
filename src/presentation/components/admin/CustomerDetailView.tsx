"use client";

import { useActionState } from "react";
import { updateCustomerAction, type AdminActionState } from "@/application/admin/actions";
import { Button } from "@/presentation/components/ui/Button";
import { formatCentsToBRL } from "@/infrastructure/formatting/currency";
import type { CustomerDetail } from "@/domain/types/admin";
import type { AppointmentStatus } from "@/domain/types/database";

const STATUS_LABEL: Record<AppointmentStatus, string> = {
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
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Sao_Paulo",
  });
}

export function CustomerDetailView({ customer }: { customer: CustomerDetail }) {
  const [state, formAction, pending] = useActionState(updateCustomerAction, initialState);

  return (
    <div className="flex flex-col gap-10">
      <form action={formAction} className="flex max-w-xl flex-col gap-5">
        <input type="hidden" name="customerId" value={customer.id} />

        <label className="flex flex-col gap-2 text-body-s text-ivory/80">
          Nome completo
          <input
            name="fullName"
            type="text"
            required
            defaultValue={customer.fullName}
            className="border border-smoke bg-graphite/40 px-4 py-3 text-ivory focus-ring"
          />
        </label>

        <label className="flex flex-col gap-2 text-body-s text-ivory/80">
          Telefone
          <input
            type="text"
            value={customer.phone}
            disabled
            className="border border-smoke bg-graphite/20 px-4 py-3 text-muted"
          />
        </label>

        <label className="flex flex-col gap-2 text-body-s text-ivory/80">
          E-mail
          <input
            name="email"
            type="email"
            defaultValue={customer.email ?? ""}
            className="border border-smoke bg-graphite/40 px-4 py-3 text-ivory focus-ring"
          />
        </label>

        {state.error && <p className="text-body-s text-red-400">{state.error}</p>}

        <Button type="submit" size="lg" disabled={pending} className="self-start">
          {pending ? "Salvando…" : "Salvar"}
        </Button>
      </form>

      <div className="flex flex-col gap-3">
        <p className="text-label uppercase text-muted">Histórico de agendamentos</p>
        {customer.appointments.length === 0 ? (
          <p className="text-body-s text-muted">Nenhum agendamento ainda.</p>
        ) : (
          customer.appointments.map((appointment) => (
            <div key={appointment.id} className="border border-smoke bg-graphite/40 p-5">
              <p className="text-body-s text-ivory">
                {formatDateTime(appointment.startsAt)} · {appointment.serviceName}
              </p>
              <p className="text-caption text-muted">
                {appointment.barberName} · {formatCentsToBRL(appointment.priceCents)} ·{" "}
                {STATUS_LABEL[appointment.status]}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
