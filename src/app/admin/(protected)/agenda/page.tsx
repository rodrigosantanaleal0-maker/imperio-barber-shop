import Link from "next/link";
import { Heading } from "@/presentation/components/ui/Heading";
import { Button } from "@/presentation/components/ui/Button";
import { AdminAppointmentRow } from "@/presentation/components/admin/AdminAppointmentRow";
import { listAllAppointments } from "@/application/admin/appointments-admin.service";
import { listBarbersAdmin } from "@/application/admin/barbers-admin.service";
import { cn } from "@/infrastructure/styling/cn";
import type { AppointmentStatus } from "@/domain/types/database";

type ViewMode = "day" | "week" | "month";

const STATUS_OPTIONS: { value: AppointmentStatus | ""; label: string }[] = [
  { value: "", label: "Todos os status" },
  { value: "pending_payment", label: "Aguardando pagamento" },
  { value: "confirmed", label: "Confirmado" },
  { value: "completed", label: "Concluído" },
  { value: "canceled", label: "Cancelado" },
  { value: "no_show", label: "Não compareceu" },
];

function toDateISO(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function getRange(view: ViewMode, dateISO: string): { from: Date; to: Date } {
  const base = new Date(`${dateISO}T00:00:00`);
  if (view === "day") {
    const to = new Date(base);
    to.setDate(to.getDate() + 1);
    return { from: base, to };
  }
  if (view === "week") {
    const from = new Date(base);
    from.setDate(from.getDate() - from.getDay());
    const to = new Date(from);
    to.setDate(to.getDate() + 7);
    return { from, to };
  }
  const from = new Date(base.getFullYear(), base.getMonth(), 1);
  const to = new Date(base.getFullYear(), base.getMonth() + 1, 1);
  return { from, to };
}

export default async function AdminAgendaPage(props: PageProps<"/admin/agenda">) {
  const searchParams = await props.searchParams;
  const view = (["day", "week", "month"] as const).includes(searchParams.view as ViewMode)
    ? (searchParams.view as ViewMode)
    : "day";
  const dateISO = typeof searchParams.date === "string" ? searchParams.date : toDateISO(new Date());
  const barberId = typeof searchParams.barberId === "string" ? searchParams.barberId : "";
  const status = typeof searchParams.status === "string" ? (searchParams.status as AppointmentStatus) : undefined;

  const { from, to } = getRange(view, dateISO);
  const [appointments, barbers] = await Promise.all([
    listAllAppointments({
      fromISO: from.toISOString(),
      toISO: to.toISOString(),
      barberId: barberId || undefined,
      status,
    }),
    listBarbersAdmin(),
  ]);

  const query = (overrides: Record<string, string>) => {
    const params = new URLSearchParams({ view, date: dateISO, barberId, status: status ?? "", ...overrides });
    for (const [key, value] of [...params.entries()]) if (!value) params.delete(key);
    return `/admin/agenda?${params.toString()}`;
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Heading variant="heading-xl">Agenda geral</Heading>
        <nav className="flex gap-2">
          {(["day", "week", "month"] as const).map((mode) => (
            <Link
              key={mode}
              href={query({ view: mode })}
              className={cn(
                "border px-4 py-2 text-caption uppercase transition-colors",
                view === mode ? "border-gold bg-gold text-obsidian" : "border-smoke text-ivory/70",
              )}
            >
              {mode === "day" ? "Dia" : mode === "week" ? "Semana" : "Mês"}
            </Link>
          ))}
        </nav>
      </div>

      <form className="flex flex-wrap gap-4">
        <input type="hidden" name="view" value={view} />
        <input type="hidden" name="date" value={dateISO} />
        <select
          name="barberId"
          defaultValue={barberId}
          className="border border-smoke bg-graphite/40 px-4 py-3 text-body-s text-ivory focus-ring"
        >
          <option value="">Todos os barbeiros</option>
          {barbers.map((barber) => (
            <option key={barber.id} value={barber.id}>
              {barber.fullName}
            </option>
          ))}
        </select>
        <select
          name="status"
          defaultValue={status ?? ""}
          className="border border-smoke bg-graphite/40 px-4 py-3 text-body-s text-ivory focus-ring"
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <Button type="submit">Filtrar</Button>
      </form>

      {appointments.length === 0 ? (
        <p className="text-body-s text-muted">Nenhum agendamento neste período.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {appointments.map((appointment) => (
            <AdminAppointmentRow key={appointment.id} appointment={appointment} />
          ))}
        </div>
      )}
    </div>
  );
}
