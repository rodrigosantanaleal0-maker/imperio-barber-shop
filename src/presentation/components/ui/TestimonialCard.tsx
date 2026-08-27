import { Star } from "lucide-react";
import Image from "next/image";
import type { Testimonial } from "@/domain/types/site";

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="flex h-full flex-col justify-between gap-8 border border-smoke bg-graphite/40 p-9">
      <div>
        <div className="flex gap-1" aria-label={`${testimonial.rating} de 5 estrelas`}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`size-4 ${i < testimonial.rating ? "fill-gold text-gold" : "text-smoke"}`}
            />
          ))}
        </div>
        <p className="mt-6 text-body-l font-display text-ivory/90">“{testimonial.quote}”</p>
      </div>
      <div className="flex items-center gap-3">
        <Image
          src={testimonial.avatar}
          alt={testimonial.author}
          width={40}
          height={40}
          className="rounded-full object-cover"
        />
        <div>
          <p className="text-body-s text-ivory">{testimonial.author}</p>
          <p className="text-caption text-muted">{testimonial.service}</p>
        </div>
      </div>
    </div>
  );
}
