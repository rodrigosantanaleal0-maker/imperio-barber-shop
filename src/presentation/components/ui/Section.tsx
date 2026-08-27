import { cn } from "@/infrastructure/styling/cn";

interface SectionProps {
  id?: string;
  className?: string;
  bleed?: boolean;
  bg?: "obsidian" | "carbon" | "graphite";
  children: React.ReactNode;
}

const BG_CLASS: Record<NonNullable<SectionProps["bg"]>, string> = {
  obsidian: "bg-obsidian",
  carbon: "bg-carbon",
  graphite: "bg-graphite",
};

/** Wrapper de seção: cuida do ritmo vertical e do fundo. O conteúdo interno usa `Container`. */
export function Section({ id, className, bleed = false, bg = "obsidian", children }: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "relative",
        BG_CLASS[bg],
        !bleed && "py-24 sm:py-28 lg:py-32",
        className,
      )}
    >
      {children}
    </section>
  );
}
