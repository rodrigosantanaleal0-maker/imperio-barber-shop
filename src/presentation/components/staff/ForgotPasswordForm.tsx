"use client";

import { useActionState } from "react";
import { requestPasswordResetAction, type AuthActionState } from "@/application/auth/actions";
import { Button } from "@/presentation/components/ui/Button";

const initialState: AuthActionState = { error: null };

export function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(requestPasswordResetAction, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <label className="flex flex-col gap-2 text-body-s text-ivory/80">
        E-mail
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className="border border-smoke bg-graphite/40 px-4 py-3 text-ivory focus-ring"
        />
      </label>

      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Enviando…" : "Enviar link de redefinição"}
      </Button>

      {state !== initialState && (
        <p className="text-body-s text-champagne">
          Se o e-mail existir, enviamos um link de redefinição de senha.
        </p>
      )}
    </form>
  );
}
