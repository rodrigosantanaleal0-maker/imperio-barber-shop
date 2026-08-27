"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Container } from "@/presentation/components/ui/Container";
import { Badge } from "@/presentation/components/ui/Badge";
import { Heading } from "@/presentation/components/ui/Heading";
import { TestimonialCard } from "@/presentation/components/ui/TestimonialCard";
import { testimonials } from "@/domain/content/site";

export function Testimonials() {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollBy = (direction: 1 | -1) => {
    trackRef.current?.scrollBy({ left: direction * 380, behavior: "smooth" });
  };

  return (
    <section id="avaliacoes" className="bg-obsidian py-24 sm:py-28 lg:py-32">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Badge>Depoimentos</Badge>
            <Heading variant="heading-xl" className="mt-4">
              Quem passa pelo Império,
              <br />
              volta.
            </Heading>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => scrollBy(-1)}
              aria-label="Depoimento anterior"
              className="focus-ring flex size-11 items-center justify-center border border-smoke text-ivory transition-colors hover:border-gold hover:text-gold"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              onClick={() => scrollBy(1)}
              aria-label="Próximo depoimento"
              className="focus-ring flex size-11 items-center justify-center border border-smoke text-ivory transition-colors hover:border-gold hover:text-gold"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        </div>

        <div
          ref={trackRef}
          className="mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="w-[85vw] shrink-0 snap-start sm:w-[380px]">
              <TestimonialCard testimonial={testimonial} />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
