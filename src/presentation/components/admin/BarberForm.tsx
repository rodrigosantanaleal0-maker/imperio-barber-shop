"use client";

import { useActionState } from "react";
import {
  createBarberAction,
  updateBarberAction,
  type AdminActionState,
} from "@/application/admin/actions";
import { Button } from "@/presentation/components/ui/Button";
import type { BarberAdmin } from "@/domain/types/admin";

const initialState: AdminActionState = { error: null };

export function BarberForm({ barber }: { barber?: BarberAdmin }) {
  const action = barber ? updateBarberAction : createBarberAction;
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-5">
      {barber && <input type="hidden" name="barberId" value={barber.id} />}

      <label className="flex flex-col gap-2 text-body-s text-ivory/80">
        Nome completo
        <input
          name="fullName"
          type="text"
          required
          defaultValue={barber?.fullName}
          className="border border-smoke bg-graphite/40 px-4 py-3 text-ivory focus-ring"
        />
      </label>

      <label className="flex flex-col gap-2 text-body-s text-ivory/80">
        Bio (opcional)
        <textarea
          name="bio"
          rows={3}
          defaultValue={barber?.bio ?? ""}
          className="border border-smoke bg-graphite/40 px-4 py-3 text-ivory focus-ring"
        />
      </label>

      <label className="flex flex-col gap-2 text-body-s text-ivory/80">
        Foto (URL, opcional)
        <input
          name="avatarUrl"
          type="text"
          defaultValue={barber?.avatarUrl ?? ""}
          className="border border-smoke bg-graphite/40 px-4 py-3 text-ivory focus-ring"
        />
      </label>

      <label className="flex flex-col gap-2 text-body-s text-ivory/80">
        Especialidades (separadas por vírgula)
        <input
          name="specialties"
          type="text"
          placeholder="Fade, barba, navalha"
          defaultValue={barber?.specialties.join(", ") ?? ""}
          className="border border-smoke bg-graphite/40 px-4 py-3 text-ivory focus-ring"
        />
      </label>

      {barber && (
        <p className="text-caption text-muted">
          Conta de acesso: {barber.hasLoginAccount ? "vinculada." : "não vinculada."} O vínculo com uma conta
          de login é feito manualmente pelo desenvolvedor por enquanto.
        </p>
      )}

      {state.error && <p className="text-body-s text-red-400">{state.error}</p>}

      <Button type="submit" size="lg" disabled={pending} className="self-start">
        {pending ? "Salvando…" : "Salvar"}
      </Button>
    </form>
  );
}
