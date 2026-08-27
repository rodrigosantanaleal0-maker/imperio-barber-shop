import { notFound } from "next/navigation";
import { Heading } from "@/presentation/components/ui/Heading";
import { Badge } from "@/presentation/components/ui/Badge";
import { BookingProgress } from "@/presentation/components/booking/BookingProgress";
import { PaymentForm } from "@/presentation/components/booking/PaymentForm";
import { getAppointmentDetailsByToken } from "@/application/booking/appointments.service";
import { formatCentsToBRL } from "@/infrastructure/formatting/currency";

export default async function PaymentPage(props: PageProps<"/agendar/pagamento">) {
  const searchParams = await props.searchParams;
  const code = String(searchParams.code ?? "");
  const token = String(searchParams.token ?? "");
  if (!code || !token) notFound();

  const appointment = await getAppointmentDetailsByToken(code, token).catch(() => null);
  if (!appointment) notFound();

  return (
    <div className="flex flex-col gap-10">
      <BookingProgress current={3} />
      <div>
        <Badge>Pagamento</Badge>
        <Heading variant="heading-xl" className="mt-4">
          Como prefere pagar?
        </Heading>
      </div>

      <div className="border border-smoke bg-graphite/40 p-6 text-body-s text-ivory/80">
        <p>
          <span className="text-gold">{appointment.service.name}</span> com {appointment.barber.fullName}
        </p>
        <p className="mt-1 text-champagne">{formatCentsToBRL(appointment.service.priceCents)}</p>
      </div>

      <PaymentForm code={code} token={token} amountCents={appointment.service.priceCents} />
    </div>
  );
}
