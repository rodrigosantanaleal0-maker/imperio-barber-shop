import { Heading } from "@/presentation/components/ui/Heading";
import { BarberForm } from "@/presentation/components/admin/BarberForm";

export default function AdminNewBarberPage() {
  return (
    <div className="flex flex-col gap-8">
      <Heading variant="heading-xl">Novo barbeiro</Heading>
      <BarberForm />
    </div>
  );
}
