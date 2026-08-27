"use client";

import { useActionState, useState } from "react";
import { cancelAction, type ActionState } from "@/application/booking/actions";
import { Button } from "@/presentation/components/ui/Button";

const initialState: ActionState = { error: null };

export function CancelForm({
  code,
  token,
  startsAt,
}: {
  code: string;
  token: string;
  startsAt: string;
}) {
  const [withinFreeWindow, setWithinFreeWindow] = useState<boolean | null>(null);
  const [state, formAction, pending] = useActionState(cancelAction, initialState);

  if (withinFreeWindow === null) {
    return (
      <Button
        variant="secondary"
        size="sm"
        onClick={() => {
          const hoursUntilStart = (new Date(startsAt).getTime() - Date.now()) / (1000 * 60 * 60);
          setWithinFreeWindow(hoursUntilStart >= 4);
        }}
      >
        Cancelar agendamento
      </Button>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4 border border-smoke bg-graphite/40 p-6">
      <input type="hidden" name="code" value={code} />
      <input type="hidden" name="token" value={token} />
      <p className="text-body-s text-ivory/80">
        {withinFreeWindow
          ? "Cancelamento gratuito, você está fora da janela de cobrança."
          : "Faltam menos de 4 horas para o horário — pode haver retenção do sinal, conforme a política da barbearia."}
      </p>
      {state.error && <p className="text-body-s text-red-400">{state.error}</p>}
      <div className="flex gap-3">
        <Button type="submit" variant="secondary" size="sm" disabled={pending}>
          {pending ? "Cancelando…" : "Confirmar cancelamento"}
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => setWithinFreeWindow(null)}>
          Voltar
        </Button>
      </div>
    </form>
  );
}
