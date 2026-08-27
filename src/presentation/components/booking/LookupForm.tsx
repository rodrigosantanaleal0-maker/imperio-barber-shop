"use client";

import { useActionState } from "react";
import { lookupAction, type LookupState } from "@/application/booking/actions";
import { Button } from "@/presentation/components/ui/Button";
import { getWhatsAppLink } from "@/domain/content/site";

const initialState: LookupState = { error: null, result: null };

export function LookupForm() {
  const [state, formAction, pending] = useActionState(lookupAction, initialState);

  return (
    <div className="flex flex-col gap-8">
      <form action={formAction} className="flex flex-col gap-5">
        <label className="flex flex-col gap-2 text-body-s text-ivory/80">
          Telefone usado no agendamento
          <input
            name="phone"
            type="tel"
            required
            placeholder="(11) 99999-9999"
            className="border border-smoke bg-graphite/40 px-4 py-3 text-ivory focus-ring"
          />
        </label>
        <label className="flex flex-col gap-2 text-body-s text-ivory/80">
          Código do agendamento
          <input
            name="code"
            required
            placeholder="IMP-8F42K"
            className="border border-smoke bg-graphite/40 px-4 py-3 text-ivory uppercase focus-ring"
          />
        </label>

        {state.error && <p className="text-body-s text-red-400">{state.error}</p>}

        <Button type="submit" size="lg" disabled={pending} className="self-start">
          {pending ? "Consultando…" : "Consultar agendamento"}
        </Button>
      </form>

      {state.result && (
        <div className="border border-gold/40 bg-graphite/40 p-6 text-body-s text-ivory/80">
          <p>
            Código <span className="text-gold">{state.result.code}</span> — status:{" "}
            <span className="text-champagne">{state.result.status}</span>
          </p>
          <p className="mt-3 text-muted">
            Por segurança, remarcar ou cancelar só é possível pelo link enviado no WhatsApp após o
            agendamento. Perdeu o link?
          </p>
          <a
            href={getWhatsAppLink(`Olá! Preciso do link do meu agendamento ${state.result.code}.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-gold underline"
          >
            Falar no WhatsApp
          </a>
        </div>
      )}
    </div>
  );
}
