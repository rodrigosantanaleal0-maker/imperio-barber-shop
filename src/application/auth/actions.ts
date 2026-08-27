"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/infrastructure/supabase/server";
import type { StaffRole } from "@/domain/types/staff";

export type AuthActionState = { error: string | null };

const HOME_PATH: Record<StaffRole, string> = {
  barber: "/barbeiro",
  admin: "/admin",
};

export async function signInAction(
  _prev: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const requiredRole = String(formData.get("requiredRole") ?? "") as StaffRole;

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user) {
    return { error: "E-mail ou senha incorretos." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single();

  if (!profile || (profile.role !== requiredRole && profile.role !== "admin")) {
    await supabase.auth.signOut();
    return { error: "Esta conta não tem acesso a esta área." };
  }

  redirect(HOME_PATH[requiredRole]);
}

export async function requestPasswordResetAction(
  _prev: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "").trim();
  if (!email) return { error: "Informe o e-mail." };

  const supabase = await createClient();
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/redefinir-senha`,
  });

  // Não revelamos se o e-mail existe ou não — mesma resposta nos dois casos.
  return { error: null };
}

export async function updatePasswordAction(
  _prev: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const password = String(formData.get("password") ?? "");
  if (password.length < 8) {
    return { error: "A senha precisa ter pelo menos 8 caracteres." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: "Não foi possível atualizar a senha. Solicite um novo link." };

  redirect("/");
}

export async function signOutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
