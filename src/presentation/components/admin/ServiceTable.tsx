import Link from "next/link";
import { toggleServiceActiveAction } from "@/application/admin/actions";
import { Button } from "@/presentation/components/ui/Button";
import { formatCentsToBRL } from "@/infrastructure/formatting/currency";
import type { ServiceAdmin } from "@/domain/types/admin";

export function ServiceTable({ services }: { services: ServiceAdmin[] }) {
  return (
    <div className="flex flex-col gap-2">
      {services.map((service) => (
        <div
          key={service.id}
          className="flex flex-wrap items-center justify-between gap-4 border border-smoke bg-graphite/40 p-5"
        >
          <div>
            <p className="text-body-s text-ivory">{service.name}</p>
            <p className="text-caption text-muted">
              {formatCentsToBRL(service.priceCents)} · {service.durationMinutes} min ·{" "}
              {service.barberIds.length} barbeiro(s)
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className={`text-caption uppercase ${service.active ? "text-gold" : "text-muted"}`}>
              {service.active ? "Ativo" : "Inativo"}
            </span>
            <Link href={`/admin/servicos/${service.id}`} className="text-caption text-ivory underline">
              Editar
            </Link>
            <form action={toggleServiceActiveAction}>
              <input type="hidden" name="serviceId" value={service.id} />
              <input type="hidden" name="active" value={(!service.active).toString()} />
              <Button type="submit" variant="ghost" size="sm">
                {service.active ? "Desativar" : "Ativar"}
              </Button>
            </form>
          </div>
        </div>
      ))}
    </div>
  );
}
