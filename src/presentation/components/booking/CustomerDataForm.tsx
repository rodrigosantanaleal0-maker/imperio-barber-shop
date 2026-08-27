"use client";

import { useActionState } from "react";
import { createBookingAction, type ActionState } from "@/application/booking/actions";
import { Button } from "@/presentation/components/ui/Button";

const initialState: ActionState = { error: null };

export function CustomerDataForm({
  serviceId,
  barberId,
  startsAt,
}: {
  serviceId: string;
  barberId: string;
  startsAt: string;
}) {
  const [state, formAction, pending] = useActionState(createBookingAction, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <input type="hidden" name="serviceId" value={serviceId} />
      <input type="hidden" name="barberId" value={barberId} />
      <input type="hidden" name="startsAt" value={startsAt} />

      <label className="flex flex-col gap-2 text-body-s text-ivory/80">
        Nome completo
        <input
          name="fullName"
          required
          className="border border-smoke bg-graphite/40 px-4 py-3 text-ivory focus-ring"
        />
      </label>

      <label className="flex flex-col gap-2 text-body-s text-ivory/80">
        Telefone / WhatsApp
        <input
          name="phone"
          type="tel"
          required
          placeholder="(11) 99999-9999"
          className="border border-smoke bg-graphite/40 px-4 py-3 text-ivory focus-ring"
        />
      </label>

      <label className="flex flex-col gap-2 text-body-s text-ivory/80">
        E-mail (opcional)
        <input
          name="email"
          type="email"
          className="border border-smoke bg-graphite/40 px-4 py-3 text-ivory focus-ring"
        />
      </label>

      {state.error && <p className="text-body-s text-red-400">{state.error}</p>}

      <Button type="submit" size="lg" disabled={pending} className="self-start">
        {pending ? "Enviando…" : "Continuar para pagamento"}
      </Button>
    </form>
  );
}
