import { cn } from "@/infrastructure/styling/cn";

export function Divider({ className }: { className?: string }) {
  return <div className={cn("h-px w-full bg-smoke", className)} aria-hidden />;
}
