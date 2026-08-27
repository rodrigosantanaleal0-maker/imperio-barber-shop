import Link from "next/link";
import { buttonVariants, type ButtonProps } from "@/presentation/components/ui/Button";
import { cn } from "@/infrastructure/styling/cn";
import { getWhatsAppLink } from "@/domain/content/site";

interface BookingCTAProps {
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  className?: string;
  message?: string;
  children: React.ReactNode;
}

/** CTA de agendamento. Aponta para o WhatsApp até a Etapa 02 (sistema de agendamento) existir. */
export function BookingCTA({ variant, size, className, message, children }: BookingCTAProps) {
  return (
    <Link
      href={getWhatsAppLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor="Agendar"
      className={cn(buttonVariants({ variant, size }), className)}
    >
      {children}
    </Link>
  );
}
