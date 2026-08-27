"use client";

import { useLayoutEffect, useRef, type ElementType } from "react";
import { getGsap, SplitText } from "@/infrastructure/motion/gsap";
import { useReducedMotion } from "@/application/hooks/useReducedMotion";

interface TextRevealProps {
  as?: ElementType;
  className?: string;
  delay?: number;
  children: string;
}

/** Revela o texto linha a linha (máscara + translateY) quando entra na viewport. */
export function TextReveal({ as = "div", className, delay = 0, children }: TextRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (reducedMotion) {
      el.style.opacity = "1";
      return;
    }

    const gsap = getGsap();
    const split = SplitText.create(el, { type: "lines", mask: "lines" });

    gsap.set(split.lines, { yPercent: 110 });
    const tween = gsap.to(split.lines, {
      yPercent: 0,
      duration: 0.9,
      ease: "expo.out",
      stagger: 0.08,
      delay,
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        toggleActions: "play none none none",
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      split.revert();
    };
  }, [reducedMotion, delay]);

  const Component = as as "div";
  return (
    <Component ref={ref as React.Ref<HTMLDivElement>} className={className}>
      {children}
    </Component>
  );
}
