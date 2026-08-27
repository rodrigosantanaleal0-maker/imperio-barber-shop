"use client";

import { useEffect, useRef, useState } from "react";
import { getGsap } from "@/infrastructure/motion/gsap";
import { useReducedMotion } from "@/application/hooks/useReducedMotion";
import { usePointerDevice } from "@/application/hooks/usePointerDevice";

/**
 * Cursor customizado. Ative em elementos interativos com `data-cursor="Ver"`,
 * `data-cursor="Agendar"` ou `data-cursor="Explorar"`. Desligado em touch e
 * quando prefers-reduced-motion está ativo.
 */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const [label, setLabel] = useState("");
  const reducedMotion = useReducedMotion();
  const isFinePointer = usePointerDevice();
  const active = isFinePointer && !reducedMotion;

  useEffect(() => {
    document.documentElement.dataset.customCursor = active ? "true" : "false";
    return () => {
      delete document.documentElement.dataset.customCursor;
    };
  }, [active]);

  useEffect(() => {
    if (!active || !dotRef.current) return;

    const gsap = getGsap();
    const el = dotRef.current;
    const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });

    const handleMove = (event: PointerEvent) => {
      xTo(event.clientX);
      yTo(event.clientY);
    };

    const handleOver = (event: PointerEvent) => {
      const target = (event.target as HTMLElement)?.closest<HTMLElement>("[data-cursor]");
      if (target) {
        setLabel(target.dataset.cursor ?? "");
        gsap.to(el, { scale: 2.6, duration: 0.35, ease: "power3.out" });
      }
    };

    const handleOut = (event: PointerEvent) => {
      const target = (event.target as HTMLElement)?.closest<HTMLElement>("[data-cursor]");
      if (target) {
        setLabel("");
        gsap.to(el, { scale: 1, duration: 0.35, ease: "power3.out" });
      }
    };

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerover", handleOver);
    window.addEventListener("pointerout", handleOut);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerover", handleOver);
      window.removeEventListener("pointerout", handleOut);
    };
  }, [active]);

  if (!active) return null;

  return (
    <div
      ref={dotRef}
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-(--z-index-cursor) flex h-3 w-3 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-(--color-gold) mix-blend-difference will-change-transform"
    >
      <span
        ref={labelRef}
        className={`whitespace-nowrap text-[0.5rem] font-medium tracking-[0.2em] text-(--color-obsidian) uppercase transition-opacity duration-200 ${
          label ? "opacity-100" : "opacity-0"
        }`}
        style={{ transform: "scale(0.4)" }}
      >
        {label}
      </span>
    </div>
  );
}
