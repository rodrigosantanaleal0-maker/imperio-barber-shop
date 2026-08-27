import Link from "next/link";
import { Heading } from "@/presentation/components/ui/Heading";
import { Button } from "@/presentation/components/ui/Button";
import { BarberTable } from "@/presentation/components/admin/BarberTable";
import { listBarbersAdmin } from "@/application/admin/barbers-admin.service";

export default async function AdminBarbersPage() {
  const barbers = await listBarbersAdmin();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Heading variant="heading-xl">Barbeiros</Heading>
        <Link href="/admin/barbeiros/novo">
          <Button>Novo barbeiro</Button>
        </Link>
      </div>

      {barbers.length === 0 ? (
        <p className="text-body-s text-muted">Nenhum barbeiro cadastrado.</p>
      ) : (
        <BarberTable barbers={barbers} />
      )}
    </div>
  );
}
