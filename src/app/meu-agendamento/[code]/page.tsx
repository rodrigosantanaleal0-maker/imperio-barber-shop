import Link from "next/link";
import { Heading } from "@/presentation/components/ui/Heading";
import { Badge } from "@/presentation/components/ui/Badge";
import { buttonVariants } from "@/presentation/components/ui/Button";
import { RescheduleForm } from "@/presentation/components/booking/RescheduleForm";
import { CancelForm } from "@/presentation/components/booking/CancelForm";
import { getAppointmentDetailsByToken } from "@/application/booking/appointments.service";
import { getPaymentByToken } from "@/application/booking/payments.service";
import { getWhatsAppLink } from "@/domain/content/site";
import { formatCentsToBRL } from "@/infrastructure/formatting/currency";

const STATUS_LABEL: Record<string, string> = {
  pending_payment: "Aguardando pagamento",
  confirmed: "Confirmado",
  completed: "Concluído",
  canceled: "Cancelado",
  no_show: "Não compareceu",
};

function buildGoogleCalendarLink(title: string, startsAt: string, endsAt: string): string {
  const format = (iso: string) => iso.replace(/[-:]/g, "").split(".")[0] + "Z";
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${format(startsAt)}/${format(endsAt)}`,
    details: "Império Barber Shop.",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export default async function MyAppointmentPage(props: PageProps<"/meu-agendamento/[code]">) {
  const { code } = await props.params;
  const searchParams = await props.searchParams;
  const token = String(searchParams.token ?? "");

  if (!token) {
    return (
      <div className="flex flex-col gap-6 text-center">
        <Heading variant="heading-l">Link inválido.</Heading>
        <p className="text-body-s text-muted">
          Acesse pelo link enviado no WhatsApp após o agendamento, ou consulte pelo telefone e código.
        </p>
        <Link href="/meu-agendamento" className={buttonVariants({ size: "sm", className: "self-center" })}>
          Consultar agendamento
        </Link>
      </div>
    );
  }

  const appointment = await getAppointmentDetailsByToken(code, token).catch(() => null);

  if (!appointment) {
    return (
      <div className="flex flex-col gap-6 text-center">
        <Heading variant="heading-l">Agendamento não encontrado.</Heading>
        <p className="text-body-s text-muted">O link pode ter expirado. Fale com a gente no WhatsApp.</p>
        <a
          href={getWhatsAppLink("Olá! Meu link de agendamento não está funcionando.")}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonVariants({ size: "sm", className: "self-center" })}
        >
          Falar no WhatsApp
        </a>
      </div>
    );
  }

  const payment = await getPaymentByToken(code, token).catch(() => null);
  const canManage = appointment.status === "pending_payment" || appointment.status === "confirmed";

  const formattedDate = new Date(appointment.startsAt).toLocaleString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Sao_Paulo",
  });

  return (
    <div className="flex flex-col gap-10">
      <div>
        <Badge>Seu agendamento</Badge>
        <Heading variant="heading-xl" className="mt-4">
          {appointment.service.name}
        </Heading>
      </div>

      <div className="border border-smoke bg-graphite/40 p-6 text-body-s text-ivory/80">
        <p>
          <span className="text-muted">Barbeiro</span> — {appointment.barber.fullName}
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
            {payment.status === "paid" ? "Aprovado" : payment.status === "pending" ? "Pendente" : payment.status}
          </p>
        )}
        <p className="mt-2">
          <span className="text-muted">Status</span> — {STATUS_LABEL[appointment.status] ?? appointment.status}
        </p>
        <p className="mt-4 font-display text-heading-m text-gold">{appointment.code}</p>
      </div>

      <div className="flex flex-wrap gap-4">
        <a
          href={buildGoogleCalendarLink(
            `${appointment.service.name} — Império Barber Shop`,
            appointment.startsAt,
            appointment.endsAt,
          )}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonVariants({ variant: "secondary", size: "sm" })}
        >
          Adicionar ao calendário
        </a>
        <a
          href={getWhatsAppLink(`Olá! Sobre meu agendamento ${appointment.code}.`)}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonVariants({ variant: "ghost", size: "sm" })}
        >
          Falar no WhatsApp
        </a>
      </div>

      {canManage && (
        <>
          <details className="group border border-smoke p-6">
            <summary className="cursor-pointer text-label text-gold uppercase">Remarcar</summary>
            <div className="mt-6">
              <RescheduleForm
                code={code}
                token={token}
                barberId={appointment.barberId}
                serviceId={appointment.serviceId}
              />
            </div>
          </details>

          <CancelForm code={code} token={token} startsAt={appointment.startsAt} />
        </>
      )}
    </div>
  );
}
