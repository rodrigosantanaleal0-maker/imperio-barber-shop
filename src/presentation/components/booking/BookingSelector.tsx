"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BarberSelect, ANY_BARBER } from "@/presentation/components/booking/BarberSelect";
import { DateStrip, toDateISO } from "@/presentation/components/booking/DateStrip";
import { TimeSlotGrid } from "@/presentation/components/booking/TimeSlotGrid";
import { buttonVariants } from "@/presentation/components/ui/Button";
import { getSlotsAction, getResolvedSlotsAction } from "@/application/booking/actions";
import type { BookableBarber } from "@/domain/types/booking";

export function BookingSelector({ serviceId, barbers }: { serviceId: string; barbers: BookableBarber[] }) {
  const [barberChoice, setBarberChoice] = useState(ANY_BARBER);
  const [dateISO, setDateISO] = useState(() => toDateISO(new Date()));
  const [slots, setSlots] = useState<{ startsAt: string; available: boolean }[]>([]);
  const [resolvedBarberByStart, setResolvedBarberByStart] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setSelectedSlot(null);

      if (barberChoice === ANY_BARBER) {
        const resolved = await getResolvedSlotsAction(
          barbers.map((b) => b.id),
          serviceId,
          dateISO,
        );
        if (cancelled) return;
        setSlots(resolved.map((r) => ({ startsAt: r.startsAt, available: true })));
        setResolvedBarberByStart(Object.fromEntries(resolved.map((r) => [r.startsAt, r.barberId])));
      } else {
        const result = await getSlotsAction(barberChoice, serviceId, dateISO);
        if (cancelled) return;
        setSlots(result);
        setResolvedBarberByStart({});
      }
      if (!cancelled) setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [barberChoice, dateISO, serviceId, barbers]);

  const finalBarberId =
    selectedSlot && barberChoice === ANY_BARBER ? resolvedBarberByStart[selectedSlot] : barberChoice;

  return (
    <div className="flex flex-col gap-10">
      <section>
        <h2 className="mb-4 text-label text-gold uppercase">Barbeiro</h2>
        <BarberSelect barbers={barbers} selected={barberChoice} onSelect={setBarberChoice} />
      </section>

      <section>
        <h2 className="mb-4 text-label text-gold uppercase">Data</h2>
        <DateStrip selected={dateISO} onSelect={setDateISO} />
      </section>

      <section>
        <h2 className="mb-4 text-label text-gold uppercase">Horário</h2>
        <TimeSlotGrid slots={slots} loading={loading} selected={selectedSlot} onSelect={setSelectedSlot} />
      </section>

      {selectedSlot && finalBarberId && finalBarberId !== ANY_BARBER && (
        <Link
          href={`/agendar/dados?serviceId=${serviceId}&barberId=${finalBarberId}&startsAt=${encodeURIComponent(selectedSlot)}`}
          className={buttonVariants({ size: "lg", className: "self-start" })}
        >
          Continuar
        </Link>
      )}
    </div>
  );
}
