import { Star } from "lucide-react";
import { ImageReveal } from "@/presentation/components/ui/ImageReveal";
import type { Barber } from "@/domain/types/site";

export function BarberCard({ barber }: { barber: Barber }) {
  return (
    <div className="group relative w-[78vw] shrink-0 sm:w-[46vw] lg:w-[26vw]" data-cursor="Ver">
      <ImageReveal
        src={barber.image}
        alt={barber.name}
        fill
        sizes="(min-width: 1024px) 26vw, 78vw"
        wrapperClassName="aspect-[3/4]"
        imageClassName="grayscale-[0.3] transition-all duration-700 ease-cinematic [@media(hover:hover)]:group-hover:scale-105 [@media(hover:hover)]:group-hover:grayscale-0"
      />
      <div className="mt-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-heading-m text-ivory">{barber.name}</h3>
          <p className="mt-1 text-caption tracking-[0.12em] text-gold uppercase">
            {barber.specialty}
          </p>
        </div>
        <span className="flex items-center gap-1 text-body-s text-muted">
          <Star className="size-3.5 fill-gold text-gold" />
          {barber.rating.toFixed(1)}
        </span>
      </div>
      <p className="mt-1 text-caption text-muted">{barber.experienceYears} anos de ofício</p>
    </div>
  );
}
