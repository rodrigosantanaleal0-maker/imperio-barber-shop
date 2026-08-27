import { Heading } from "@/presentation/components/ui/Heading";
import { Badge } from "@/presentation/components/ui/Badge";
import { UpdatePasswordForm } from "@/presentation/components/staff/UpdatePasswordForm";

export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-obsidian px-6 py-24">
      <div className="w-full max-w-sm">
        <Badge>Nova senha</Badge>
        <Heading variant="heading-l" className="mt-4">
          Definir nova senha
        </Heading>
        <div className="mt-8">
          <UpdatePasswordForm />
        </div>
      </div>
    </main>
  );
}
