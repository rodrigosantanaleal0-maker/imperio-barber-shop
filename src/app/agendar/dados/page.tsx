import { notFound } from "next/navigation";
import { Heading } from "@/presentation/components/ui/Heading";
import { Badge } from "@/presentation/components/ui/Badge";
import { BookingProgress } from "@/presentation/components/booking/BookingProgress";
import { CustomerDataForm } from "@/presentation/components/booking/CustomerDataForm";
import { getServiceById } from "@/application/booking/services.service";
import { getBarberById } from "@/application/booking/barbers.service";
import { formatCentsToBRL } from "@/infrastructure/formatting/currency";

export default async function CustomerDataPage(props: PageProps<"/agendar/dados">) {
  const searchParams = await props.searchParams;
  const serviceId = String(searchParams.serviceId ?? "");
  const barberId = String(searchParams.barberId ?? "");
  const startsAt = String(searchParams.startsAt ?? "");

  if (!serviceId || !barberId || !startsAt) notFound();

  const [service, barber] = await Promise.all([getServiceById(serviceId), getBarberById(barberId)]);
  if (!service || !barber) notFound();

  const formattedDate = new Date(startsAt).toLocaleString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Sao_Paulo",
  });

  return (
    <div className="flex flex-col gap-10">
      <BookingProgress current={2} />
      <div>
        <Badge>Seus dados</Badge>
        <Heading variant="heading-xl" className="mt-4">
          Só o essencial.
        </Heading>
      </div>

      <div className="border border-smoke bg-graphite/40 p-6 text-body-s text-ivory/80">
        <p>
          <span className="text-gold">{service.name}</span> com {barber.fullName}
        </p>
        <p className="mt-1 capitalize">{formattedDate}</p>
        <p className="mt-1 text-champagne">{formatCentsToBRL(service.priceCents)}</p>
      </div>

      <CustomerDataForm serviceId={serviceId} barberId={barberId} startsAt={startsAt} />
    </div>
  );
}
