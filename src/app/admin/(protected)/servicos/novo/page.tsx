import { Heading } from "@/presentation/components/ui/Heading";
import { ServiceForm } from "@/presentation/components/admin/ServiceForm";
import { listBarbersAdmin } from "@/application/admin/barbers-admin.service";

export default async function AdminNewServicePage() {
  const barbers = await listBarbersAdmin();

  return (
    <div className="flex flex-col gap-8">
      <Heading variant="heading-xl">Novo serviço</Heading>
      <ServiceForm barbers={barbers} />
    </div>
  );
}
