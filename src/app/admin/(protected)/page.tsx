import { Heading } from "@/presentation/components/ui/Heading";
import { StatCard } from "@/presentation/components/ui/StatCard";
import { RangeTabs } from "@/presentation/components/admin/RangeTabs";
import { RevenueChart } from "@/presentation/components/admin/RevenueChart";
import { getDashboardTotals, getRevenueByDay } from "@/application/admin/dashboard.service";
import { getDateRangeFromDays } from "@/infrastructure/formatting/date-range";
import { formatCentsToBRL } from "@/infrastructure/formatting/currency";

export default async function AdminDashboardPage(props: PageProps<"/admin">) {
  const searchParams = await props.searchParams;
  const range = typeof searchParams.range === "string" ? searchParams.range : "30";
  const { fromDate, toDate } = getDateRangeFromDays(Number(range) || 30);

  const [totals, revenue] = await Promise.all([
    getDashboardTotals(fromDate, toDate),
    getRevenueByDay(fromDate, toDate),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Heading variant="heading-xl">Painel administrativo</Heading>
        <RangeTabs basePath="/admin" activeRange={range} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Faturamento no período" value={formatCentsToBRL(totals.revenueCents)} accent />
        <StatCard label="Agendamentos" value={String(totals.appointmentsCount)} />
        <StatCard label="Concluídos" value={String(totals.completedCount)} />
        <StatCard label="Cancelados" value={String(totals.canceledCount)} />
        <StatCard label="Não compareceram" value={String(totals.noShowCount)} />
        <StatCard label="Clientes novos" value={String(totals.newCustomersCount)} />
      </div>

      <RevenueChart data={revenue} />
    </div>
  );
}
