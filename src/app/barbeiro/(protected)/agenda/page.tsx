import Link from "next/link";
import { Heading } from "@/presentation/components/ui/Heading";
import { AgendaAppointmentCard } from "@/presentation/components/staff/AgendaAppointmentCard";
import { listMyAppointments } from "@/application/staff/agenda.service";
import { cn } from "@/infrastructure/styling/cn";

type ViewMode = "day" | "week" | "month";

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

export default async function BarberAgendaPage(props: PageProps<"/barbeiro/agenda">) {
  const searchParams = await props.searchParams;
  const view = (["day", "week", "month"] as const).includes(searchParams.view as ViewMode)
    ? (searchParams.view as ViewMode)
    : "day";
  const dateISO = typeof searchParams.date === "string" ? searchParams.date : toDateISO(new Date());

  const { from, to } = getRange(view, dateISO);
  const appointments = await listMyAppointments(from.toISOString(), to.toISOString());

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Heading variant="heading-xl">Agenda</Heading>
        <nav className="flex gap-2">
          {(["day", "week", "month"] as const).map((mode) => (
            <Link
              key={mode}
              href={`/barbeiro/agenda?view=${mode}&date=${dateISO}`}
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

      {appointments.length === 0 ? (
        <p className="text-body-s text-muted">Nenhum agendamento neste período.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {appointments.map((appointment) => (
            <AgendaAppointmentCard key={appointment.id} appointment={appointment} />
          ))}
        </div>
      )}
    </div>
  );
}
