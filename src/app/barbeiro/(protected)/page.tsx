import { requireRole } from "@/infrastructure/auth/guards";
import { getMyDashboardStats } from "@/application/staff/agenda.service";
import { Heading } from "@/presentation/components/ui/Heading";
import { StatCard } from "@/presentation/components/ui/StatCard";
import { formatCentsToBRL } from "@/infrastructure/formatting/currency";

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Sao_Paulo",
  });
}

export default async function BarberDashboardPage() {
  const profile = await requireRole("barber");
  const stats = await getMyDashboardStats();

  return (
    <div className="flex flex-col gap-10">
      <Heading variant="heading-xl">Bom dia, {profile.fullName.split(" ")[0]}.</Heading>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Atendimentos hoje" value={String(stats.appointmentsToday)} />
        <StatCard label="Atendimentos no mês" value={String(stats.appointmentsMonth)} />
        <StatCard
          label="Faturamento do mês"
          value={formatCentsToBRL(stats.revenueMonthCents)}
          accent
        />
      </div>

      <div className="border border-smoke bg-graphite/40 p-6">
        <p className="text-label text-gold uppercase">Próximo cliente</p>
        {stats.nextAppointment ? (
          <div className="mt-3 text-body-m text-ivory/80">
            <p className="text-ivory">{stats.nextAppointment.customerName}</p>
            <p>{stats.nextAppointment.serviceName}</p>
            <p className="text-champagne">{formatTime(stats.nextAppointment.startsAt)}</p>
          </div>
        ) : (
          <p className="mt-3 text-body-s text-muted">Nenhum atendimento confirmado pra hoje.</p>
        )}
      </div>
    </div>
  );
}
