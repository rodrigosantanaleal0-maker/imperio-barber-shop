import { cn } from "@/infrastructure/styling/cn";

interface MarqueeProps {
  items: string[];
  className?: string;
  durationSeconds?: number;
}

/** Ticker horizontal infinito, pausa no hover e respeita prefers-reduced-motion. */
export function Marquee({ items, className, durationSeconds = 24 }: MarqueeProps) {
  return (
    <div className={cn("group relative w-full overflow-hidden", className)}>
      <div
        className="flex w-max animate-marquee gap-16 group-hover:[animation-play-state:paused] motion-reduce:animate-none"
        style={{ animationDuration: `${durationSeconds}s` }}
      >
        {[...items, ...items].map((item, index) => (
          <span
            key={`${item}-${index}`}
            aria-hidden={index >= items.length}
            className="whitespace-nowrap font-display text-heading-l text-ivory/15"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
