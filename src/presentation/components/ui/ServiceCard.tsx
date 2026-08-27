import { Clock } from "lucide-react";
import { ImageReveal } from "@/presentation/components/ui/ImageReveal";
import { BookingCTA } from "@/presentation/components/ui/BookingCTA";
import { formatCentsToBRL } from "@/infrastructure/formatting/currency";
import type { Service } from "@/domain/types/site";

const HOVER_HIDDEN =
  "[@media(hover:hover)]:translate-y-2 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:translate-y-0 [@media(hover:hover)]:group-hover:opacity-100";

export function ServiceCard({ service }: { service: Service }) {
  return (
    <div className="group relative overflow-hidden border border-smoke" data-cursor="Ver">
      <ImageReveal
        src={service.image}
        alt={service.name}
        fill
        sizes="(min-width: 1024px) 33vw, 100vw"
        wrapperClassName="aspect-[4/5]"
        imageClassName="transition-transform duration-[1.4s] ease-cinematic [@media(hover:hover)]:group-hover:scale-110"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/50 to-transparent"
      />
      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-6">
        <h3 className="font-display text-heading-m text-ivory">{service.name}</h3>
        <p className={`text-body-s text-ivory/70 transition-all duration-500 ease-cinematic ${HOVER_HIDDEN}`}>
          {service.description}
        </p>
        <div className={`flex items-center justify-between transition-all duration-500 ease-cinematic ${HOVER_HIDDEN}`}>
          <span className="flex items-center gap-1.5 text-caption text-muted">
            <Clock className="size-3.5" />
            {service.durationMinutes} min
          </span>
          <span className="font-display text-heading-m text-champagne">
            {formatCentsToBRL(service.priceCents)}
          </span>
        </div>
        <BookingCTA
          size="sm"
          variant="secondary"
          className={`mt-1 self-start transition-all delay-100 duration-500 ease-cinematic ${HOVER_HIDDEN}`}
        >
          Agendar
        </BookingCTA>
      </div>
    </div>
  );
}
