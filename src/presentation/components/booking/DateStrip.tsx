"use client";

import { cn } from "@/infrastructure/styling/cn";

const WEEKDAY_LABEL = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

function nextDays(count: number): Date[] {
  const days: Date[] = [];
  const today = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push(d);
  }
  return days;
}

export function toDateISO(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function DateStrip({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (dateISO: string) => void;
}) {
  const days = nextDays(21);

  return (
    <div className="flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {days.map((day) => {
        const dateISO = toDateISO(day);
        const active = dateISO === selected;
        return (
          <button
            key={dateISO}
            type="button"
            onClick={() => onSelect(dateISO)}
            className={cn(
              "flex min-w-16 flex-col items-center gap-1 border px-3 py-3 text-center transition-colors duration-300",
              active
                ? "border-gold bg-gold text-obsidian"
                : "border-smoke text-ivory/80 hover:border-ivory/40",
            )}
          >
            <span className="text-caption uppercase">{WEEKDAY_LABEL[day.getDay()]}</span>
            <span className="font-display text-heading-m">{day.getDate()}</span>
          </button>
        );
      })}
    </div>
  );
}
