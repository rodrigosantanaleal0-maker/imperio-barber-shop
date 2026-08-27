"use client";

import { useActionState } from "react";
import { updatePasswordAction, type AuthActionState } from "@/application/auth/actions";
import { Button } from "@/presentation/components/ui/Button";

const initialState: AuthActionState = { error: null };

export function UpdatePasswordForm() {
  const [state, formAction, pending] = useActionState(updatePasswordAction, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <label className="flex flex-col gap-2 text-body-s text-ivory/80">
        Nova senha
        <input
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="border border-smoke bg-graphite/40 px-4 py-3 text-ivory focus-ring"
        />
      </label>

      {state.error && <p className="text-body-s text-red-400">{state.error}</p>}

      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Salvando…" : "Salvar nova senha"}
      </Button>
    </form>
  );
}
