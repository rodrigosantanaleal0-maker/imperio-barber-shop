import { Heading } from "@/presentation/components/ui/Heading";
import { Button } from "@/presentation/components/ui/Button";
import { CustomerTable } from "@/presentation/components/admin/CustomerTable";
import { listCustomers } from "@/application/admin/customers-admin.service";

export default async function AdminCustomersPage(props: PageProps<"/admin/clientes">) {
  const searchParams = await props.searchParams;
  const search = typeof searchParams.q === "string" ? searchParams.q : "";
  const customers = await listCustomers(search || undefined);

  return (
    <div className="flex flex-col gap-8">
      <Heading variant="heading-xl">Clientes</Heading>

      <form className="flex gap-4">
        <input
          name="q"
          type="text"
          defaultValue={search}
          placeholder="Buscar por nome ou telefone"
          className="w-full max-w-sm border border-smoke bg-graphite/40 px-4 py-3 text-ivory focus-ring"
        />
        <Button type="submit">Buscar</Button>
      </form>

      {customers.length === 0 ? (
        <p className="text-body-s text-muted">Nenhum cliente encontrado.</p>
      ) : (
        <CustomerTable customers={customers} />
      )}
    </div>
  );
}
