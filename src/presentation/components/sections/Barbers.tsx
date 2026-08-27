"use client";

import { useLayoutEffect, useRef } from "react";
import { getGsap } from "@/infrastructure/motion/gsap";
import { useReducedMotion } from "@/application/hooks/useReducedMotion";
import { Container } from "@/presentation/components/ui/Container";
import { Badge } from "@/presentation/components/ui/Badge";
import { Heading } from "@/presentation/components/ui/Heading";
import { BarberCard } from "@/presentation/components/ui/BarberCard";
import { barbers } from "@/domain/content/site";

/** Trilho horizontal controlado pelo scroll vertical (pin + scrub). Vira wrap em prefers-reduced-motion. */
export function Barbers() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track || reducedMotion) return;

    const gsap = getGsap();
    const distance = track.scrollWidth - section.clientWidth;
    if (distance <= 0) return;

    const tween = gsap.to(track, {
      x: -distance,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => `+=${distance}`,
        scrub: 1,
        pin: true,
        invalidateOnRefresh: true,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [reducedMotion]);

  return (
    <section
      id="barbeiros"
      ref={sectionRef}
      className="relative overflow-hidden bg-carbon py-24 sm:py-28 lg:py-32"
    >
      <Container className="mb-14">
        <Badge>Profissionais</Badge>
        <Heading variant="heading-xl" className="mt-4">
          Os mestres por trás do Império.
        </Heading>
      </Container>
      <div
        ref={trackRef}
        className={`flex gap-8 px-6 sm:px-10 lg:px-16 ${reducedMotion ? "flex-wrap" : "w-max"}`}
      >
        {barbers.map((barber) => (
          <BarberCard key={barber.id} barber={barber} />
        ))}
      </div>
    </section>
  );
}
