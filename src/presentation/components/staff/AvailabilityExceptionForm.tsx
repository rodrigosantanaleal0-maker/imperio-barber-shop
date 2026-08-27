"use client";

import { useActionState, useState } from "react";
import { createAvailabilityExceptionAction, type StaffActionState } from "@/application/staff/actions";
import { Button } from "@/presentation/components/ui/Button";

const initialState: StaffActionState = { error: null };

export function AvailabilityExceptionForm() {
  const [state, formAction, pending] = useActionState(createAvailabilityExceptionAction, initialState);
  const [isFullDay, setIsFullDay] = useState(true);

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-4 border border-smoke bg-graphite/40 p-5">
      <label className="flex flex-col gap-2 text-body-s text-ivory/80">
        Data
        <input
          name="date"
          type="date"
          required
          className="border border-smoke bg-graphite/40 px-4 py-3 text-ivory focus-ring"
        />
      </label>

      <label className="flex items-center gap-2 self-center text-body-s text-ivory/80">
        <input
          name="isFullDay"
          type="checkbox"
          checked={isFullDay}
          onChange={(event) => setIsFullDay(event.target.checked)}
        />
        Dia inteiro
      </label>

      {!isFullDay && (
        <>
          <label className="flex flex-col gap-2 text-body-s text-ivory/80">
            Início do bloqueio
            <input
              name="startTime"
              type="time"
              required
              className="border border-smoke bg-graphite/40 px-4 py-3 text-ivory focus-ring"
            />
          </label>
          <label className="flex flex-col gap-2 text-body-s text-ivory/80">
            Fim do bloqueio
            <input
              name="endTime"
              type="time"
              required
              className="border border-smoke bg-graphite/40 px-4 py-3 text-ivory focus-ring"
            />
          </label>
        </>
      )}

      <label className="flex flex-col gap-2 text-body-s text-ivory/80">
        Motivo (opcional)
        <input
          name="reason"
          type="text"
          placeholder="Folga, viagem, feriado…"
          className="border border-smoke bg-graphite/40 px-4 py-3 text-ivory focus-ring"
        />
      </label>

      <Button type="submit" size="md" disabled={pending}>
        {pending ? "Salvando…" : "Bloquear"}
      </Button>

      {state.error && <p className="w-full text-caption text-red-400">{state.error}</p>}
    </form>
  );
}
