"use client";

import { useActionState } from "react";
import { createAvailabilityWindowAction, type StaffActionState } from "@/application/staff/actions";
import { Button } from "@/presentation/components/ui/Button";

const WEEKDAYS = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
const initialState: StaffActionState = { error: null };

export function AvailabilityWindowForm() {
  const [state, formAction, pending] = useActionState(createAvailabilityWindowAction, initialState);

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-4 border border-smoke bg-graphite/40 p-5">
      <label className="flex flex-col gap-2 text-body-s text-ivory/80">
        Dia da semana
        <select
          name="weekday"
          required
          defaultValue=""
          className="border border-smoke bg-graphite/40 px-4 py-3 text-ivory focus-ring"
        >
          <option value="" disabled>
            Selecione
          </option>
          {WEEKDAYS.map((label, index) => (
            <option key={label} value={index}>
              {label}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-2 text-body-s text-ivory/80">
        Início
        <input
          name="startTime"
          type="time"
          required
          className="border border-smoke bg-graphite/40 px-4 py-3 text-ivory focus-ring"
        />
      </label>

      <label className="flex flex-col gap-2 text-body-s text-ivory/80">
        Fim
        <input
          name="endTime"
          type="time"
          required
          className="border border-smoke bg-graphite/40 px-4 py-3 text-ivory focus-ring"
        />
      </label>

      <Button type="submit" size="md" disabled={pending}>
        {pending ? "Salvando…" : "Adicionar"}
      </Button>

      {state.error && <p className="w-full text-caption text-red-400">{state.error}</p>}
    </form>
  );
}
