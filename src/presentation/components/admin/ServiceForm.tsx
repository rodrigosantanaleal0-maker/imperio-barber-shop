"use client";

import { useActionState } from "react";
import {
  createServiceAction,
  updateServiceAction,
  type AdminActionState,
} from "@/application/admin/actions";
import { Button } from "@/presentation/components/ui/Button";
import type { ServiceAdmin, BarberAdmin } from "@/domain/types/admin";
import type { ServiceCategory } from "@/domain/types/database";

const CATEGORY_LABEL: Record<ServiceCategory, string> = {
  corte: "Corte",
  barba: "Barba",
  combo: "Combo",
  acabamento: "Acabamento",
  sobrancelha: "Sobrancelha",
};

const initialState: AdminActionState = { error: null };

export function ServiceForm({ service, barbers }: { service?: ServiceAdmin; barbers: BarberAdmin[] }) {
  const action = service ? updateServiceAction : createServiceAction;
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-5">
      {service && <input type="hidden" name="serviceId" value={service.id} />}

      <label className="flex flex-col gap-2 text-body-s text-ivory/80">
        Nome
        <input
          name="name"
          type="text"
          required
          defaultValue={service?.name}
          className="border border-smoke bg-graphite/40 px-4 py-3 text-ivory focus-ring"
        />
      </label>

      <label className="flex flex-col gap-2 text-body-s text-ivory/80">
        Descrição (opcional)
        <textarea
          name="description"
          rows={3}
          defaultValue={service?.description ?? ""}
          className="border border-smoke bg-graphite/40 px-4 py-3 text-ivory focus-ring"
        />
      </label>

      <div className="flex gap-4">
        <label className="flex flex-1 flex-col gap-2 text-body-s text-ivory/80">
          Categoria
          <select
            name="category"
            defaultValue={service?.category ?? "corte"}
            className="border border-smoke bg-graphite/40 px-4 py-3 text-ivory focus-ring"
          >
            {Object.entries(CATEGORY_LABEL).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-1 flex-col gap-2 text-body-s text-ivory/80">
          Duração (min)
          <input
            name="durationMinutes"
            type="number"
            min={1}
            required
            defaultValue={service?.durationMinutes}
            className="border border-smoke bg-graphite/40 px-4 py-3 text-ivory focus-ring"
          />
        </label>
      </div>

      <div className="flex gap-4">
        <label className="flex flex-1 flex-col gap-2 text-body-s text-ivory/80">
          Preço (R$)
          <input
            name="price"
            type="number"
            min={0}
            step="0.01"
            required
            defaultValue={service ? service.priceCents / 100 : undefined}
            className="border border-smoke bg-graphite/40 px-4 py-3 text-ivory focus-ring"
          />
        </label>

        <label className="flex flex-1 flex-col gap-2 text-body-s text-ivory/80">
          Preço &ldquo;de&rdquo; (opcional)
          <input
            name="compareAtPrice"
            type="number"
            min={0}
            step="0.01"
            defaultValue={service?.compareAtPriceCents ? service.compareAtPriceCents / 100 : undefined}
            className="border border-smoke bg-graphite/40 px-4 py-3 text-ivory focus-ring"
          />
        </label>
      </div>

      <fieldset className="flex flex-col gap-2 text-body-s text-ivory/80">
        <legend className="mb-1">Barbeiros que atendem este serviço</legend>
        {barbers.map((barber) => (
          <label key={barber.id} className="flex items-center gap-2">
            <input
              type="checkbox"
              name="barberIds"
              value={barber.id}
              defaultChecked={service?.barberIds.includes(barber.id) ?? false}
            />
            {barber.fullName}
          </label>
        ))}
      </fieldset>

      {state.error && <p className="text-body-s text-red-400">{state.error}</p>}

      <Button type="submit" size="lg" disabled={pending} className="self-start">
        {pending ? "Salvando…" : "Salvar"}
      </Button>
    </form>
  );
}
