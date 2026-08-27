"use client";

import { useEffect, useRef } from "react";
import { getGsap } from "@/infrastructure/motion/gsap";
import { useReducedMotion } from "@/application/hooks/useReducedMotion";
import { usePointerDevice } from "@/application/hooks/usePointerDevice";

interface MagneticButtonProps {
  strength?: number;
  className?: string;
  children: React.ReactNode;
}

/** Atrai o conteúdo em direção ao cursor dentro dos próprios limites. Só desktop. */
export function MagneticButton({ strength = 0.35, className, children }: MagneticButtonProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const isFinePointer = usePointerDevice();
  const active = isFinePointer && !reducedMotion;

  useEffect(() => {
    const el = wrapRef.current;
    if (!active || !el) return;

    const gsap = getGsap();
    const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });

    const handleMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const relX = event.clientX - (rect.left + rect.width / 2);
      const relY = event.clientY - (rect.top + rect.height / 2);
      xTo(relX * strength);
      yTo(relY * strength);
    };

    const handleLeave = () => {
      xTo(0);
      yTo(0);
    };

    el.addEventListener("pointermove", handleMove);
    el.addEventListener("pointerleave", handleLeave);

    return () => {
      el.removeEventListener("pointermove", handleMove);
      el.removeEventListener("pointerleave", handleLeave);
    };
  }, [active, strength]);

  return (
    <div ref={wrapRef} className={className}>
      {children}
    </div>
  );
}
