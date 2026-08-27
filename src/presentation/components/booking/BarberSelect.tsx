"use client";

import Image from "next/image";
import { cn } from "@/infrastructure/styling/cn";
import type { BookableBarber } from "@/domain/types/booking";

export const ANY_BARBER = "qualquer";

export function BarberSelect({
  barbers,
  selected,
  onSelect,
}: {
  barbers: BookableBarber[];
  selected: string;
  onSelect: (barberId: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <button
        type="button"
        onClick={() => onSelect(ANY_BARBER)}
        className={cn(
          "flex flex-col items-center gap-2 border p-4 text-center transition-colors duration-300",
          selected === ANY_BARBER ? "border-gold bg-graphite" : "border-smoke hover:border-ivory/40",
        )}
      >
        <div className="flex size-14 items-center justify-center rounded-full border border-gold/40 text-gold">
          ?
        </div>
        <span className="text-body-s text-ivory">Qualquer profissional</span>
      </button>

      {barbers.map((barber) => (
        <button
          key={barber.id}
          type="button"
          onClick={() => onSelect(barber.id)}
          className={cn(
            "flex flex-col items-center gap-2 border p-4 text-center transition-colors duration-300",
            selected === barber.id ? "border-gold bg-graphite" : "border-smoke hover:border-ivory/40",
          )}
        >
          <div className="relative size-14 overflow-hidden rounded-full">
            <Image
              src={barber.avatarUrl ?? "/images/placeholder/portrait.svg"}
              alt={barber.fullName}
              fill
              className="object-cover"
            />
          </div>
          <span className="text-body-s text-ivory">{barber.fullName}</span>
        </button>
      ))}
    </div>
  );
}
