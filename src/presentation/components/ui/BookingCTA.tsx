import Link from "next/link";
import { buttonVariants, type ButtonProps } from "@/presentation/components/ui/Button";
import { cn } from "@/infrastructure/styling/cn";

interface BookingCTAProps {
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  className?: string;
  children: React.ReactNode;
}

/** CTA de agendamento. Leva ao fluxo de agendamento sem login (Etapa 02). */
export function BookingCTA({ variant, size, className, children }: BookingCTAProps) {
  return (
    <Link
      href="/agendar"
      data-cursor="Agendar"
      className={cn(buttonVariants({ variant, size }), className)}
    >
      {children}
    </Link>
  );
}
