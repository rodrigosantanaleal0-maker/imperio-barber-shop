import Link from "next/link";
import { toggleBarberActiveAction } from "@/application/admin/actions";
import { Button } from "@/presentation/components/ui/Button";
import type { BarberAdmin } from "@/domain/types/admin";

export function BarberTable({ barbers }: { barbers: BarberAdmin[] }) {
  return (
    <div className="flex flex-col gap-2">
      {barbers.map((barber) => (
        <div
          key={barber.id}
          className="flex flex-wrap items-center justify-between gap-4 border border-smoke bg-graphite/40 p-5"
        >
          <div>
            <p className="text-body-s text-ivory">{barber.fullName}</p>
            <p className="text-caption text-muted">
              {barber.specialties.join(", ") || "Sem especialidades cadastradas"} ·{" "}
              {barber.hasLoginAccount ? "conta vinculada" : "sem conta de login"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className={`text-caption uppercase ${barber.active ? "text-gold" : "text-muted"}`}>
              {barber.active ? "Ativo" : "Inativo"}
            </span>
            <Link href={`/admin/barbeiros/${barber.id}`} className="text-caption text-ivory underline">
              Editar
            </Link>
            <form action={toggleBarberActiveAction}>
              <input type="hidden" name="barberId" value={barber.id} />
              <input type="hidden" name="active" value={(!barber.active).toString()} />
              <Button type="submit" variant="ghost" size="sm">
                {barber.active ? "Desativar" : "Ativar"}
              </Button>
            </form>
          </div>
        </div>
      ))}
    </div>
  );
}
