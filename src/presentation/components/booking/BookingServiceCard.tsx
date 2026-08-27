import Link from "next/link";
import { Clock } from "lucide-react";
import { ImageReveal } from "@/presentation/components/ui/ImageReveal";
import { formatCentsToBRL } from "@/infrastructure/formatting/currency";
import type { BookableService } from "@/domain/types/booking";

export function BookingServiceCard({ service }: { service: BookableService }) {
  return (
    <Link
      href={`/agendar/${service.id}`}
      data-cursor="Escolher"
      className="group relative block overflow-hidden border border-smoke"
    >
      <ImageReveal
        src={service.imageUrl ?? "/images/placeholder/detail.svg"}
        alt={service.name}
        fill
        sizes="(min-width: 1024px) 33vw, 100vw"
        wrapperClassName="aspect-[4/5]"
        imageClassName="transition-transform duration-700 ease-cinematic [@media(hover:hover)]:group-hover:scale-105"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/50 to-transparent"
      />
      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-6">
        <h3 className="font-display text-heading-m text-ivory">{service.name}</h3>
        {service.description && <p className="text-body-s text-ivory/70">{service.description}</p>}
        <div className="mt-2 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-caption text-muted">
            <Clock className="size-3.5" />
            {service.durationMinutes} min
          </span>
          <span className="font-display text-heading-m text-champagne">
            {formatCentsToBRL(service.priceCents)}
          </span>
        </div>
      </div>
    </Link>
  );
}
