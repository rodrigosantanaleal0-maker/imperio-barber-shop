"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signInAction, type AuthActionState } from "@/application/auth/actions";
import { Button } from "@/presentation/components/ui/Button";
import type { StaffRole } from "@/domain/types/staff";

const initialState: AuthActionState = { error: null };

export function LoginForm({ role, forgotPasswordHref }: { role: StaffRole; forgotPasswordHref: string }) {
  const [state, formAction, pending] = useActionState(signInAction, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <input type="hidden" name="requiredRole" value={role} />

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

      <label className="flex flex-col gap-2 text-body-s text-ivory/80">
        Senha
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="border border-smoke bg-graphite/40 px-4 py-3 text-ivory focus-ring"
        />
      </label>

      {state.error && <p className="text-body-s text-red-400">{state.error}</p>}

      <Button type="submit" size="lg" disabled={pending} className="mt-2">
        {pending ? "Entrando…" : "Entrar"}
      </Button>

      <Link href={forgotPasswordHref} className="text-caption text-muted underline">
        Esqueci minha senha
      </Link>
    </form>
  );
}
