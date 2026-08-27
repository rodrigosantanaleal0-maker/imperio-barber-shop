import { Heading } from "@/presentation/components/ui/Heading";
import { Badge } from "@/presentation/components/ui/Badge";
import { ForgotPasswordForm } from "@/presentation/components/staff/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-obsidian px-6 py-24">
      <div className="w-full max-w-sm">
        <Badge>Recuperar acesso</Badge>
        <Heading variant="heading-l" className="mt-4">
          Esqueci minha senha
        </Heading>
        <p className="mt-2 text-body-s text-muted">
          Informe o e-mail cadastrado para receber o link de redefinição.
        </p>
        <div className="mt-8">
          <ForgotPasswordForm />
        </div>
      </div>
    </main>
  );
}
