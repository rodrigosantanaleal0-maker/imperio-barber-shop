import { cn } from "@/infrastructure/styling/cn";

const STEPS = ["Serviço", "Horário", "Dados", "Pagamento", "Confirmação"];

export function BookingProgress({ current }: { current: number }) {
  return (
    <nav aria-label="Progresso do agendamento" className="flex items-center gap-2 text-caption uppercase">
      {STEPS.map((step, i) => (
        <div key={step} className="flex items-center gap-2">
          <span
            className={cn(
              "flex size-6 items-center justify-center rounded-full border text-[0.65rem]",
              i <= current ? "border-gold bg-gold text-obsidian" : "border-smoke text-muted",
            )}
          >
            {i + 1}
          </span>
          <span className={i <= current ? "text-ivory" : "text-muted"}>{step}</span>
          {i < STEPS.length - 1 && <span className="mx-1 h-px w-6 bg-smoke" aria-hidden />}
        </div>
      ))}
    </nav>
  );
}
