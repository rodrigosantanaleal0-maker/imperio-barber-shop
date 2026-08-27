export function StatCard({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="border border-smoke bg-graphite/40 p-6">
      <p className="text-label text-muted uppercase">{label}</p>
      <p className={`mt-2 font-display text-heading-l ${accent ? "text-champagne" : "text-ivory"}`}>
        {value}
      </p>
    </div>
  );
}
