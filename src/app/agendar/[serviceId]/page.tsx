import { notFound } from "next/navigation";
import { Heading } from "@/presentation/components/ui/Heading";
import { Badge } from "@/presentation/components/ui/Badge";
import { BookingProgress } from "@/presentation/components/booking/BookingProgress";
import { BookingSelector } from "@/presentation/components/booking/BookingSelector";
import { getServiceById } from "@/application/booking/services.service";
import { getBarbersForService } from "@/application/booking/barbers.service";
import { formatCentsToBRL } from "@/infrastructure/formatting/currency";

export default async function ChooseBarberPage(props: PageProps<"/agendar/[serviceId]">) {
  const { serviceId } = await props.params;
  const [service, barbers] = await Promise.all([
    getServiceById(serviceId),
    getBarbersForService(serviceId),
  ]);

  if (!service) notFound();

  return (
    <div className="flex flex-col gap-10">
      <BookingProgress current={1} />
      <div>
        <Badge>{service.name}</Badge>
        <Heading variant="heading-xl" className="mt-4">
          Escolha barbeiro e horário.
        </Heading>
        <p className="mt-2 text-body-s text-muted">
          {service.durationMinutes} min · {formatCentsToBRL(service.priceCents)}
        </p>
      </div>
      <BookingSelector serviceId={service.id} barbers={barbers} />
    </div>
  );
}
