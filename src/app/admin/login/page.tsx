import { Heading } from "@/presentation/components/ui/Heading";
import { Badge } from "@/presentation/components/ui/Badge";
import { LoginForm } from "@/presentation/components/staff/LoginForm";

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-obsidian px-6 py-24">
      <div className="w-full max-w-sm">
        <Badge>Painel administrativo</Badge>
        <Heading variant="heading-l" className="mt-4">
          Entrar
        </Heading>
        <p className="mt-2 text-body-s text-muted">Acesso restrito ao dono/administrador.</p>
        <div className="mt-8">
          <LoginForm role="admin" forgotPasswordHref="/esqueci-senha" />
        </div>
      </div>
    </main>
  );
}
