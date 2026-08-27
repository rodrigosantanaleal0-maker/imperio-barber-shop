"use client";

import { useLayoutEffect, useRef } from "react";
import { getGsap, ScrollTrigger } from "@/infrastructure/motion/gsap";
import { useReducedMotion } from "@/application/hooks/useReducedMotion";

const PHRASES = [
  "Estilo não é sobre seguir tendências.",
  "É sobre saber quem você é.",
  "Império Barber Shop.",
];

export function Manifesto() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const phraseRefs = useRef<Array<HTMLParagraphElement | null>>([]);
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const phrases = phraseRefs.current.filter((el): el is HTMLParagraphElement => Boolean(el));
    if (reducedMotion) {
      phrases.forEach((el) => el.style.setProperty("opacity", "1"));
      return;
    }

    const gsap = getGsap();
    gsap.set(phrases, { autoAlpha: 0, y: 24 });

    const shown = phrases.map(() => false);
    const segment = 1 / phrases.length;

    const trigger = ScrollTrigger.create({
      trigger: wrapRef.current,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        phrases.forEach((el, i) => {
          const active = self.progress >= i * segment && self.progress < (i + 1) * segment + 0.02;
          if (active !== shown[i]) {
            shown[i] = active;
            gsap.to(el, { autoAlpha: active ? 1 : 0, y: active ? 0 : 24, duration: 0.7, ease: "power2.out" });
          }
        });
      },
    });

    return () => trigger.kill();
  }, [reducedMotion]);

  return (
    <section className="relative bg-obsidian">
      <div ref={wrapRef} className="relative" style={{ height: reducedMotion ? undefined : "300vh" }}>
        <div className="sticky top-0 flex h-screen items-center justify-center px-6 text-center">
          <div className={reducedMotion ? "flex flex-col gap-10 py-24" : "relative w-full max-w-4xl"}>
            {PHRASES.map((phrase, i) => (
              <p
                key={phrase}
                ref={(el) => {
                  phraseRefs.current[i] = el;
                }}
                className={`font-display text-display-l text-ivory ${
                  reducedMotion ? "" : "absolute inset-0 flex items-center justify-center"
                } ${i === PHRASES.length - 1 ? "text-champagne" : ""}`}
              >
                {phrase}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
