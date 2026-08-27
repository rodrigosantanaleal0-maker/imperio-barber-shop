import { notFound } from "next/navigation";
import { Heading } from "@/presentation/components/ui/Heading";
import { BarberForm } from "@/presentation/components/admin/BarberForm";
import { getBarberAdmin } from "@/application/admin/barbers-admin.service";

export default async function AdminEditBarberPage(props: PageProps<"/admin/barbeiros/[id]">) {
  const { id } = await props.params;
  const barber = await getBarberAdmin(id);
  if (!barber) notFound();

  return (
    <div className="flex flex-col gap-8">
      <Heading variant="heading-xl">{barber.fullName}</Heading>
      <BarberForm barber={barber} />
    </div>
  );
}
