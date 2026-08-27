"use client";

import { useActionState, useState } from "react";
import { payAction, type ActionState } from "@/application/booking/actions";
import { Button } from "@/presentation/components/ui/Button";
import { cn } from "@/infrastructure/styling/cn";
import type { PaymentMethod } from "@/infrastructure/payments/gateway.interface";

const METHODS: { value: PaymentMethod; label: string }[] = [
  { value: "pix", label: "PIX" },
  { value: "credit_card", label: "Cartão" },
  { value: "deposit", label: "Sinal (50%)" },
  { value: "local", label: "Pagar no local" },
];

const initialState: ActionState = { error: null };

export function PaymentForm({
  code,
  token,
  amountCents,
}: {
  code: string;
  token: string;
  amountCents: number;
}) {
  const [state, formAction, pending] = useActionState(payAction, initialState);
  const [method, setMethod] = useState<PaymentMethod>("pix");
  const chargedAmount = method === "deposit" ? Math.round(amountCents / 2) : amountCents;

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <input type="hidden" name="code" value={code} />
      <input type="hidden" name="token" value={token} />
      <input type="hidden" name="amountCents" value={chargedAmount} />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {METHODS.map((m) => (
          <button
            key={m.value}
            type="button"
            onClick={() => setMethod(m.value)}
            className={cn(
              "border px-4 py-3 text-body-s transition-colors duration-300",
              method === m.value ? "border-gold bg-gold text-obsidian" : "border-smoke text-ivory/80",
            )}
          >
            {m.label}
          </button>
        ))}
      </div>
      <input type="hidden" name="method" value={method} />

      {state.error && <p className="text-body-s text-red-400">{state.error}</p>}

      <Button type="submit" size="lg" disabled={pending} className="self-start">
        {pending ? "Processando…" : "Confirmar pagamento"}
      </Button>
    </form>
  );
}
