import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge não lê o @theme do CSS: sem isto, nomes customizados como
 * `text-obsidian` (cor) e `text-label` (tamanho de fonte) caem no mesmo grupo
 * de conflito e um apaga o outro. Manter em sincronia com src/styles/tokens.css.
 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      color: ["obsidian", "carbon", "graphite", "smoke", "gold", "champagne", "ivory", "muted"],
      text: [
        "display-xl",
        "display-l",
        "heading-xl",
        "heading-l",
        "heading-m",
        "body-l",
        "body-m",
        "body-s",
        "caption",
        "label",
      ],
      shadow: ["elevate", "gold"],
      ease: ["cinematic", "soft"],
      animate: ["marquee"],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
