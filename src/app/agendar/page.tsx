import { Heading } from "@/presentation/components/ui/Heading";
import { Badge } from "@/presentation/components/ui/Badge";
import { BookingProgress } from "@/presentation/components/booking/BookingProgress";
import { BookingServiceCard } from "@/presentation/components/booking/BookingServiceCard";
import { getActiveServices } from "@/application/booking/services.service";

export default async function AgendarPage() {
  const services = await getActiveServices();

  return (
    <div className="flex flex-col gap-10">
      <BookingProgress current={0} />
      <div>
        <Badge>Agendar horário</Badge>
        <Heading variant="heading-xl" className="mt-4">
          Escolha o serviço.
        </Heading>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        {services.map((service) => (
          <BookingServiceCard key={service.id} service={service} />
        ))}
      </div>
    </div>
  );
}
