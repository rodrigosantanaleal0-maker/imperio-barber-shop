"use client";

import { cn } from "@/infrastructure/styling/cn";
import type { TimeSlot } from "@/domain/types/booking";

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Sao_Paulo",
  });
}

export function TimeSlotGrid({
  slots,
  loading,
  selected,
  onSelect,
}: {
  slots: TimeSlot[];
  loading: boolean;
  selected: string | null;
  onSelect: (startsAt: string) => void;
}) {
  if (loading) {
    return <p className="text-body-s text-muted">Carregando horários…</p>;
  }

  const available = slots.filter((slot) => slot.available);

  if (available.length === 0) {
    return <p className="text-body-s text-muted">Sem horários livres nesta data.</p>;
  }

  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
      {available.map((slot) => (
        <button
          key={slot.startsAt}
          type="button"
          onClick={() => onSelect(slot.startsAt)}
          className={cn(
            "focus-ring border px-3 py-2.5 text-body-s transition-colors duration-300",
            slot.startsAt === selected
              ? "border-gold bg-gold text-obsidian"
              : "border-smoke text-ivory/80 hover:border-ivory/40",
          )}
        >
          {formatTime(slot.startsAt)}
        </button>
      ))}
    </div>
  );
}
