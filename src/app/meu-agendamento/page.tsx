import { Heading } from "@/presentation/components/ui/Heading";
import { Badge } from "@/presentation/components/ui/Badge";
import { LookupForm } from "@/presentation/components/booking/LookupForm";

export default function LookupPage() {
  return (
    <div className="flex flex-col gap-10">
      <div>
        <Badge>Meu agendamento</Badge>
        <Heading variant="heading-xl" className="mt-4">
          Consulte seu agendamento.
        </Heading>
        <p className="mt-2 text-body-s text-muted">
          Já recebeu o link do WhatsApp? Acesse direto por ele — é mais rápido.
        </p>
      </div>
      <LookupForm />
    </div>
  );
}
