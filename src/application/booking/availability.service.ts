import "server-only";
import { createClient } from "@/infrastructure/supabase/server";
import type { TimeSlot } from "@/domain/types/booking";

// Brasil não observa horário de verão desde 2019 — offset fixo -03:00 é seguro
// para esta fase. Se a barbearia operar em outro fuso, mover para date-fns-tz.
const TIMEZONE_OFFSET = "-03:00";
const SLOT_STEP_MINUTES = 30;

function timeStringToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function buildDateTime(dateISO: string, minutesFromMidnight: number): Date {
  const hours = String(Math.floor(minutesFromMidnight / 60)).padStart(2, "0");
  const minutes = String(minutesFromMidnight % 60).padStart(2, "0");
  return new Date(`${dateISO}T${hours}:${minutes}:00${TIMEZONE_OFFSET}`);
}

export async function getAvailableSlots({
  barberId,
  serviceId,
  dateISO,
}: {
  barberId: string;
  serviceId: string;
  dateISO: string;
}): Promise<TimeSlot[]> {
  const supabase = await createClient();

  const [{ data: service }, { data: windows }, { data: exceptions }, { data: busy }] = await Promise.all([
    supabase.from("services").select("duration_minutes").eq("id", serviceId).single(),
    supabase.from("availability").select("start_time, end_time, weekday").eq("barber_id", barberId),
    supabase
      .from("availability_exceptions")
      .select("is_full_day, start_time, end_time")
      .eq("barber_id", barberId)
      .eq("date", dateISO),
    supabase.rpc("get_busy_ranges_public", { p_barber_id: barberId, p_date: dateISO }),
  ]);

  if (!service) return [];

  const weekday = new Date(`${dateISO}T12:00:00${TIMEZONE_OFFSET}`).getUTCDay();
  const todaysWindows = (windows ?? []).filter((w) => w.weekday === weekday);

  if (todaysWindows.length === 0) return [];
  if ((exceptions ?? []).some((e) => e.is_full_day)) return [];

  const busyRanges = (busy ?? []).map((appt) => ({
    start: new Date(appt.starts_at).getTime(),
    end: new Date(appt.ends_at).getTime(),
  }));

  const partialBlocks = (exceptions ?? [])
    .filter((e) => !e.is_full_day && e.start_time && e.end_time)
    .map((e) => ({
      start: buildDateTime(dateISO, timeStringToMinutes(e.start_time!)).getTime(),
      end: buildDateTime(dateISO, timeStringToMinutes(e.end_time!)).getTime(),
    }));

  const now = Date.now();
  const slots: TimeSlot[] = [];

  for (const window of todaysWindows) {
    const windowStart = timeStringToMinutes(window.start_time);
    const windowEnd = timeStringToMinutes(window.end_time);

    for (
      let cursor = windowStart;
      cursor + service.duration_minutes <= windowEnd;
      cursor += SLOT_STEP_MINUTES
    ) {
      const slotStart = buildDateTime(dateISO, cursor);
      const slotEnd = new Date(slotStart.getTime() + service.duration_minutes * 60_000);

      if (slotStart.getTime() <= now) continue;

      const overlapsBusy = [...busyRanges, ...partialBlocks].some(
        (range) => slotStart.getTime() < range.end && slotEnd.getTime() > range.start,
      );

      slots.push({ startsAt: slotStart.toISOString(), available: !overlapsBusy });
    }
  }

  return slots;
}

export type ResolvedSlot = { startsAt: string; barberId: string };

// Fluxo "qualquer profissional": mescla a disponibilidade de vários barbeiros
// e associa cada horário livre ao primeiro barbeiro disponível nele.
export async function getResolvedSlotsAcrossBarbers({
  barberIds,
  serviceId,
  dateISO,
}: {
  barberIds: string[];
  serviceId: string;
  dateISO: string;
}): Promise<ResolvedSlot[]> {
  const perBarber = await Promise.all(
    barberIds.map(async (barberId) => ({
      barberId,
      slots: await getAvailableSlots({ barberId, serviceId, dateISO }),
    })),
  );

  const resolved = new Map<string, string>();
  for (const { barberId, slots } of perBarber) {
    for (const slot of slots) {
      if (slot.available && !resolved.has(slot.startsAt)) {
        resolved.set(slot.startsAt, barberId);
      }
    }
  }

  return Array.from(resolved.entries())
    .map(([startsAt, barberId]) => ({ startsAt, barberId }))
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt));
}
