import { notFound } from "next/navigation";
import { Heading } from "@/presentation/components/ui/Heading";
import { ServiceForm } from "@/presentation/components/admin/ServiceForm";
import { getServiceAdmin } from "@/application/admin/services-admin.service";
import { listBarbersAdmin } from "@/application/admin/barbers-admin.service";

export default async function AdminEditServicePage(props: PageProps<"/admin/servicos/[id]">) {
  const { id } = await props.params;
  const [service, barbers] = await Promise.all([getServiceAdmin(id), listBarbersAdmin()]);
  if (!service) notFound();

  return (
    <div className="flex flex-col gap-8">
      <Heading variant="heading-xl">{service.name}</Heading>
      <ServiceForm service={service} barbers={barbers} />
    </div>
  );
}
