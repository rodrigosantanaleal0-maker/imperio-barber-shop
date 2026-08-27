function toDateISO(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function getDateRangeFromDays(days: number): { fromDate: string; toDate: string } {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - (days - 1));
  return { fromDate: toDateISO(from), toDate: toDateISO(to) };
}
