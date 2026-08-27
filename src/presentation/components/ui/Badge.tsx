import { cn } from "@/infrastructure/styling/cn";

export function Badge({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-3 text-label font-sans text-gold uppercase",
        className,
      )}
    >
      <span className="h-px w-7 bg-gold" aria-hidden />
      {children}
    </span>
  );
}
