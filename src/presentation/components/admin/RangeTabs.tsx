import Link from "next/link";
import { cn } from "@/infrastructure/styling/cn";

const PRESETS = [
  { value: "7", label: "7 dias" },
  { value: "30", label: "30 dias" },
  { value: "90", label: "90 dias" },
];

export function RangeTabs({ basePath, activeRange }: { basePath: string; activeRange: string }) {
  return (
    <nav className="flex gap-2">
      {PRESETS.map((preset) => (
        <Link
          key={preset.value}
          href={`${basePath}?range=${preset.value}`}
          className={cn(
            "border px-4 py-2 text-caption uppercase transition-colors",
            activeRange === preset.value ? "border-gold bg-gold text-obsidian" : "border-smoke text-ivory/70",
          )}
        >
          {preset.label}
        </Link>
      ))}
    </nav>
  );
}
