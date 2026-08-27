"use client";

import { useLayoutEffect, useRef } from "react";
import { getGsap } from "@/infrastructure/motion/gsap";
import { useReducedMotion } from "@/application/hooks/useReducedMotion";
import { cn } from "@/infrastructure/styling/cn";

interface VideoRevealProps {
  src: string;
  poster: string;
  className?: string;
  videoClassName?: string;
}

/** Vídeo ambiente em loop: reveal por clip-path e play/pause por IntersectionObserver (economiza recursos fora da viewport). */
export function VideoReveal({ src, poster, className, videoClassName }: VideoRevealProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap || reducedMotion) return;

    const gsap = getGsap();
    gsap.set(wrap, { clipPath: "inset(0% 0 100% 0)" });
    const tween = gsap.to(wrap, {
      clipPath: "inset(0% 0 0% 0)",
      duration: 1.2,
      ease: "power4.out",
      scrollTrigger: {
        trigger: wrap,
        start: "top 85%",
        toggleActions: "play none none none",
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [reducedMotion]);

  useLayoutEffect(() => {
    const video = videoRef.current;
    if (!video || reducedMotion) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.25 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [reducedMotion]);

  return (
    <div ref={wrapRef} className={cn("relative overflow-hidden", className)}>
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="metadata"
        poster={poster}
        className={cn("h-full w-full object-cover", videoClassName)}
      >
        <source src={src} type="video/mp4" />
      </video>
    </div>
  );
}
