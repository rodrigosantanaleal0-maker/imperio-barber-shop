import { Heading } from "@/presentation/components/ui/Heading";
import { Button } from "@/presentation/components/ui/Button";
import { AvailabilityWindowForm } from "@/presentation/components/staff/AvailabilityWindowForm";
import { AvailabilityExceptionForm } from "@/presentation/components/staff/AvailabilityExceptionForm";
import {
  deleteAvailabilityWindowAction,
  deleteAvailabilityExceptionAction,
} from "@/application/staff/actions";
import {
  listMyAvailability,
  listMyAvailabilityExceptions,
} from "@/application/staff/availability-admin.service";

const WEEKDAYS = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

function formatDate(dateISO: string): string {
  return new Date(`${dateISO}T00:00:00`).toLocaleDateString("pt-BR");
}

export default async function BarberAvailabilityPage() {
  const [windows, exceptions] = await Promise.all([
    listMyAvailability(),
    listMyAvailabilityExceptions(),
  ]);

  return (
    <div className="flex flex-col gap-12">
      <section className="flex flex-col gap-6">
        <Heading variant="heading-xl">Horários de trabalho</Heading>
        <AvailabilityWindowForm />

        {windows.length === 0 ? (
          <p className="text-body-s text-muted">Nenhum horário cadastrado.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {windows.map((window) => (
              <div
                key={window.id}
                className="flex items-center justify-between border border-smoke bg-graphite/40 px-5 py-4"
              >
                <p className="text-body-s text-ivory">
                  {WEEKDAYS[window.weekday]} · {window.start_time.slice(0, 5)} às{" "}
                  {window.end_time.slice(0, 5)}
                </p>
                <form action={deleteAvailabilityWindowAction}>
                  <input type="hidden" name="id" value={window.id} />
                  <Button type="submit" variant="ghost" size="sm">
                    Remover
                  </Button>
                </form>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="flex flex-col gap-6">
        <Heading variant="heading-xl">Folgas e bloqueios</Heading>
        <AvailabilityExceptionForm />

        {exceptions.length === 0 ? (
          <p className="text-body-s text-muted">Nenhuma folga ou bloqueio futuro.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {exceptions.map((exception) => (
              <div
                key={exception.id}
                className="flex items-center justify-between border border-smoke bg-graphite/40 px-5 py-4"
              >
                <p className="text-body-s text-ivory">
                  {formatDate(exception.date)}
                  {exception.is_full_day
                    ? " · dia inteiro"
                    : ` · ${exception.start_time?.slice(0, 5)} às ${exception.end_time?.slice(0, 5)}`}
                  {exception.reason && <span className="text-muted"> · {exception.reason}</span>}
                </p>
                <form action={deleteAvailabilityExceptionAction}>
                  <input type="hidden" name="id" value={exception.id} />
                  <Button type="submit" variant="ghost" size="sm">
                    Remover
                  </Button>
                </form>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
