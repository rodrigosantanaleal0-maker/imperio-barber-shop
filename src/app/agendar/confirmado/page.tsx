import { notFound } from "next/navigation";
import Link from "next/link";
import { Heading } from "@/presentation/components/ui/Heading";
import { buttonVariants } from "@/presentation/components/ui/Button";
import { getAppointmentDetailsByToken } from "@/application/booking/appointments.service";
import { getPaymentByToken } from "@/application/booking/payments.service";
import { getWhatsAppLink } from "@/domain/content/site";
import { formatCentsToBRL } from "@/infrastructure/formatting/currency";

function buildGoogleCalendarLink(title: string, startsAt: string, endsAt: string): string {
  const format = (iso: string) => iso.replace(/[-:]/g, "").split(".")[0] + "Z";
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${format(startsAt)}/${format(endsAt)}`,
    details: "Império Barber Shop — seu horário está confirmado.",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export default async function ConfirmedPage(props: PageProps<"/agendar/confirmado">) {
  const searchParams = await props.searchParams;
  const code = String(searchParams.code ?? "");
  const token = String(searchParams.token ?? "");
  if (!code || !token) notFound();

  const appointment = await getAppointmentDetailsByToken(code, token).catch(() => null);
  if (!appointment) notFound();

  const payment = await getPaymentByToken(code, token).catch(() => null);

  const formattedDate = new Date(appointment.startsAt).toLocaleString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Sao_Paulo",
  });

  return (
    <div className="flex flex-col items-center gap-10 py-16 text-center">
      <Heading variant="display-l">
        Seu horário está
        <br />
        <span className="text-champagne">confirmado.</span>
      </Heading>

      <div className="w-full max-w-md border border-smoke bg-graphite/40 p-8 text-left text-body-s text-ivory/80">
        <p>
          <span className="text-muted">Barbeiro</span> — {appointment.barber.fullName}
        </p>
        <p className="mt-2">
          <span className="text-muted">Serviço</span> — {appointment.service.name}
        </p>
        <p className="mt-2 capitalize">
          <span className="text-muted">Quando</span> — {formattedDate}
        </p>
        <p className="mt-2">
          <span className="text-muted">Valor</span> — {formatCentsToBRL(appointment.service.priceCents)}
        </p>
        {payment && (
          <p className="mt-2">
            <span className="text-muted">Pagamento</span> —{" "}
            {payment.status === "paid" ? "Aprovado" : "Pendente"}
          </p>
        )}
        <p className="mt-4 font-display text-heading-m text-gold">{appointment.code}</p>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        <Link
          href={`/meu-agendamento/${appointment.code}?token=${token}`}
          className={buttonVariants({ size: "lg" })}
        >
          Ver meu agendamento
        </Link>
        <a
          href={buildGoogleCalendarLink(
            `${appointment.service.name} — Império Barber Shop`,
            appointment.startsAt,
            appointment.endsAt,
          )}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonVariants({ variant: "secondary", size: "lg" })}
        >
          Adicionar ao calendário
        </a>
        <a
          href={getWhatsAppLink(`Olá! Meu código de agendamento é ${appointment.code}.`)}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonVariants({ variant: "ghost", size: "lg" })}
        >
          Falar no WhatsApp
        </a>
      </div>
    </div>
  );
}
