import { notFound } from "next/navigation";
import { Heading } from "@/presentation/components/ui/Heading";
import { CustomerDetailView } from "@/presentation/components/admin/CustomerDetailView";
import { getCustomerDetail } from "@/application/admin/customers-admin.service";

export default async function AdminCustomerDetailPage(props: PageProps<"/admin/clientes/[id]">) {
  const { id } = await props.params;
  const customer = await getCustomerDetail(id);
  if (!customer) notFound();

  return (
    <div className="flex flex-col gap-8">
      <Heading variant="heading-xl">{customer.fullName}</Heading>
      <CustomerDetailView customer={customer} />
    </div>
  );
}
