import Link from "next/link";
import type { CustomerAdmin } from "@/domain/types/admin";

export function CustomerTable({ customers }: { customers: CustomerAdmin[] }) {
  return (
    <div className="flex flex-col gap-2">
      {customers.map((customer) => (
        <Link
          key={customer.id}
          href={`/admin/clientes/${customer.id}`}
          className="flex flex-wrap items-center justify-between gap-4 border border-smoke bg-graphite/40 p-5 transition-colors hover:border-gold"
        >
          <div>
            <p className="text-body-s text-ivory">{customer.fullName}</p>
            <p className="text-caption text-muted">
              {customer.phone} {customer.email ? `· ${customer.email}` : ""}
            </p>
          </div>
          <span className="text-caption text-gold uppercase">{customer.appointmentsCount} agendamento(s)</span>
        </Link>
      ))}
    </div>
  );
}
