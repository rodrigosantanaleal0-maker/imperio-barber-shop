"use client";

import Image, { type ImageProps } from "next/image";
import { useLayoutEffect, useRef } from "react";
import { getGsap } from "@/infrastructure/motion/gsap";
import { useReducedMotion } from "@/application/hooks/useReducedMotion";
import { cn } from "@/infrastructure/styling/cn";

interface ImageRevealProps extends Omit<ImageProps, "className"> {
  wrapperClassName?: string;
  imageClassName?: string;
}

/** Reveal cinematográfico: máscara clip-path sobe + leve zoom-out da imagem ao entrar na viewport. */
export function ImageReveal({
  wrapperClassName,
  imageClassName,
  alt,
  ...imageProps
}: ImageRevealProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    const img = imgRef.current;
    if (!wrap || !img || reducedMotion) return;

    const gsap = getGsap();
    gsap.set(wrap, { clipPath: "inset(0% 0 100% 0)" });
    gsap.set(img, { scale: 1.15 });

    const timeline = gsap
      .timeline({
        scrollTrigger: {
          trigger: wrap,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      })
      .to(wrap, { clipPath: "inset(0% 0 0% 0)", duration: 1.1, ease: "power4.out" })
      .to(img, { scale: 1, duration: 1.4, ease: "power3.out" }, 0);

    return () => {
      timeline.scrollTrigger?.kill();
      timeline.kill();
    };
  }, [reducedMotion]);

  return (
    <div ref={wrapRef} className={cn("relative overflow-hidden", wrapperClassName)}>
      <Image
        ref={imgRef}
        alt={alt}
        className={cn("object-cover", imageClassName)}
        {...imageProps}
      />
    </div>
  );
}
