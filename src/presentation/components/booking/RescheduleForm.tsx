"use client";

import { useActionState, useEffect, useState } from "react";
import { rescheduleAction, getSlotsAction, type ActionState } from "@/application/booking/actions";
import { DateStrip, toDateISO } from "@/presentation/components/booking/DateStrip";
import { TimeSlotGrid } from "@/presentation/components/booking/TimeSlotGrid";
import { Button } from "@/presentation/components/ui/Button";

const initialState: ActionState = { error: null };

export function RescheduleForm({
  code,
  token,
  barberId,
  serviceId,
}: {
  code: string;
  token: string;
  barberId: string;
  serviceId: string;
}) {
  const [state, formAction, pending] = useActionState(rescheduleAction, initialState);
  const [dateISO, setDateISO] = useState(() => toDateISO(new Date()));
  const [slots, setSlots] = useState<{ startsAt: string; available: boolean }[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setSelectedSlot(null);
      const result = await getSlotsAction(barberId, serviceId, dateISO);
      if (!cancelled) {
        setSlots(result);
        setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [barberId, serviceId, dateISO]);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <input type="hidden" name="code" value={code} />
      <input type="hidden" name="token" value={token} />
      <input type="hidden" name="newStartsAt" value={selectedSlot ?? ""} />

      <DateStrip selected={dateISO} onSelect={setDateISO} />
      <TimeSlotGrid slots={slots} loading={loading} selected={selectedSlot} onSelect={setSelectedSlot} />

      {state.error && <p className="text-body-s text-red-400">{state.error}</p>}

      <Button type="submit" size="lg" disabled={pending || !selectedSlot} className="self-start">
        {pending ? "Remarcando…" : "Confirmar novo horário"}
      </Button>
    </form>
  );
}
