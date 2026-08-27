import type { ElementType } from "react";
import { cn } from "@/infrastructure/styling/cn";

type HeadingVariant = "display-xl" | "display-l" | "heading-xl" | "heading-l" | "heading-m";

const VARIANT_CLASS: Record<HeadingVariant, string> = {
  "display-xl": "text-display-xl font-display",
  "display-l": "text-display-l font-display",
  "heading-xl": "text-heading-xl font-display",
  "heading-l": "text-heading-l font-display",
  "heading-m": "text-heading-m font-display",
};

const DEFAULT_TAG: Record<HeadingVariant, ElementType> = {
  "display-xl": "h1",
  "display-l": "h1",
  "heading-xl": "h2",
  "heading-l": "h2",
  "heading-m": "h3",
};

interface HeadingProps {
  variant: HeadingVariant;
  as?: ElementType;
  className?: string;
  children: React.ReactNode;
}

export function Heading({ variant, as, className, children }: HeadingProps) {
  const Component = as ?? DEFAULT_TAG[variant];
  return (
    <Component className={cn(VARIANT_CLASS[variant], "text-ivory", className)}>
      {children}
    </Component>
  );
}
