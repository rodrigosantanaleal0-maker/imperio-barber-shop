"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";
import { getGsap, ScrollTrigger } from "@/infrastructure/motion/gsap";
import { useReducedMotion } from "@/application/hooks/useReducedMotion";
import { BookingCTA } from "@/presentation/components/ui/BookingCTA";
import { buttonVariants } from "@/presentation/components/ui/Button";
import Link from "next/link";

const PHASES = [
  "A máquina",
  "A tesoura",
  "O corte",
  "O fade",
  "A navalha",
  "A barba",
  "O resultado",
];

const TITLE_LINES = ["Seu estilo.", "Sua presença.", "Seu Império."];

export function Hero() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const titleRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctasRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const titleLines = titleRefs.current.filter((el): el is HTMLSpanElement => Boolean(el));

    if (reducedMotion) {
      if (barRef.current) barRef.current.style.width = "100%";
      return;
    }

    const gsap = getGsap();
    gsap.set(titleLines, { yPercent: 110 });
    gsap.set([eyebrowRef.current, subRef.current, ctasRef.current], { autoAlpha: 0, y: 14 });

    let lastPhase = 0;
    let eyebrowShown = false;
    let subShown = false;
    let ctasShown = false;
    const lineShown = titleLines.map(() => false);

    const trigger = ScrollTrigger.create({
      trigger: wrapRef.current,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        const progress = self.progress;

        const idx = Math.min(PHASES.length - 1, Math.floor(progress * PHASES.length));
        if (idx !== lastPhase) {
          lastPhase = idx;
          setPhaseIndex(idx);
        }

        if (barRef.current) barRef.current.style.width = `${progress * 100}%`;
        gsap.to(lightRef.current, {
          xPercent: -20 + progress * 160,
          yPercent: -10 + Math.sin(progress * Math.PI) * 20,
          rotate: progress * 35,
          duration: 0.4,
          ease: "power1.out",
          overwrite: "auto",
        });

        const showEyebrow = progress > 0.03;
        if (showEyebrow !== eyebrowShown) {
          eyebrowShown = showEyebrow;
          gsap.to(eyebrowRef.current, {
            autoAlpha: showEyebrow ? 1 : 0,
            y: showEyebrow ? 0 : 14,
            duration: 0.6,
          });
        }

        titleLines.forEach((line, i) => {
          const threshold = 0.08 + i * 0.08;
          const show = progress > threshold;
          if (show !== lineShown[i]) {
            lineShown[i] = show;
            gsap.to(line, { yPercent: show ? 0 : 110, duration: 0.9, ease: "expo.out" });
          }
        });

        const showSub = progress > 0.42;
        if (showSub !== subShown) {
          subShown = showSub;
          gsap.to(subRef.current, { autoAlpha: showSub ? 1 : 0, y: showSub ? 0 : 14, duration: 0.6 });
        }

        const showCtas = progress > 0.55;
        if (showCtas !== ctasShown) {
          ctasShown = showCtas;
          gsap.to(ctasRef.current, { autoAlpha: showCtas ? 1 : 0, y: showCtas ? 0 : 14, duration: 0.6 });
        }
      },
    });

    return () => trigger.kill();
  }, [reducedMotion]);

  return (
    <section id="top" className="relative border-b border-smoke">
      <div ref={wrapRef} className="relative" style={{ height: reducedMotion ? undefined : "600vh" }}>
        <div className="sticky top-0 relative h-screen w-full overflow-hidden bg-obsidian">
          <Image
            src="/images/placeholder/scene.svg"
            alt=""
            aria-hidden
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-30"
          />
          <div
            ref={lightRef}
            aria-hidden
            className="pointer-events-none absolute top-1/3 left-[-10%] h-[60vh] w-[45vw] rounded-full bg-gold/20 blur-[110px]"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/60 to-obsidian/40"
          />

          <div className="relative z-10 flex h-full flex-col justify-end px-6 pb-16 sm:px-10 sm:pb-24 lg:px-16">
            <div className="max-w-3xl">
              <div
                ref={eyebrowRef}
                className="mb-5 flex items-center gap-3 text-label text-champagne uppercase"
              >
                <span className="h-px w-7 bg-gold" aria-hidden />
                Império Barber Shop — Precisão em cada detalhe
              </div>
              <h1 className="font-display text-display-l text-ivory">
                {TITLE_LINES.map((line, i) => (
                  <span key={line} className="block overflow-hidden">
                    <span
                      ref={(el) => {
                        titleRefs.current[i] = el;
                      }}
                      className={`block ${i === TITLE_LINES.length - 1 ? "text-champagne" : ""}`}
                    >
                      {line}
                    </span>
                  </span>
                ))}
              </h1>
              <p ref={subRef} className="mt-8 max-w-[34ch] text-body-l text-ivory/70">
                Mais do que um corte.
                <br />
                Uma experiência.
              </p>
              <div ref={ctasRef} className="mt-11 flex flex-wrap gap-4">
                <BookingCTA size="lg">Agendar horário</BookingCTA>
                <Link href="#experiencia" className={buttonVariants({ variant: "secondary", size: "lg" })}>
                  Conhecer o Império
                </Link>
              </div>
            </div>
          </div>

          <div className="absolute right-6 bottom-9 z-10 flex items-center gap-3 text-caption text-ivory/60 sm:right-10 lg:right-16">
            <span className="text-champagne">
              {PHASES[reducedMotion ? PHASES.length - 1 : phaseIndex]}
            </span>
            <span className="text-muted">
              {String((reducedMotion ? PHASES.length - 1 : phaseIndex) + 1).padStart(2, "0")}/
              {String(PHASES.length).padStart(2, "0")}
            </span>
            <div className="relative h-px w-28 overflow-hidden bg-ivory/20">
              <div ref={barRef} className="absolute top-0 left-0 h-full w-0 bg-gold" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
