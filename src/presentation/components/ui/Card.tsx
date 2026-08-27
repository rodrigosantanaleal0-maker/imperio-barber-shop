import { cn } from "@/infrastructure/styling/cn";

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "border border-smoke bg-graphite/40 transition-colors duration-300 ease-cinematic",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CardBody({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("p-8", className)}>{children}</div>;
}
