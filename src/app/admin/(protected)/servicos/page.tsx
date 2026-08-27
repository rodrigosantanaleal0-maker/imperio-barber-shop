import Link from "next/link";
import { Heading } from "@/presentation/components/ui/Heading";
import { Button } from "@/presentation/components/ui/Button";
import { ServiceTable } from "@/presentation/components/admin/ServiceTable";
import { listServicesAdmin } from "@/application/admin/services-admin.service";

export default async function AdminServicesPage() {
  const services = await listServicesAdmin();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Heading variant="heading-xl">Serviços</Heading>
        <Link href="/admin/servicos/novo">
          <Button>Novo serviço</Button>
        </Link>
      </div>

      {services.length === 0 ? (
        <p className="text-body-s text-muted">Nenhum serviço cadastrado.</p>
      ) : (
        <ServiceTable services={services} />
      )}
    </div>
  );
}
