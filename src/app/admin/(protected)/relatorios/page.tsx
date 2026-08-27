import { Heading } from "@/presentation/components/ui/Heading";
import { RangeTabs } from "@/presentation/components/admin/RangeTabs";
import { RevenueChart } from "@/presentation/components/admin/RevenueChart";
import { StatusBreakdownChart } from "@/presentation/components/admin/StatusBreakdownChart";
import { TopServicesChart } from "@/presentation/components/admin/TopServicesChart";
import { BarberPerformanceChart } from "@/presentation/components/admin/BarberPerformanceChart";
import {
  getRevenueByDay,
  getAppointmentsByStatus,
  getTopServices,
  getBarberPerformance,
} from "@/application/admin/dashboard.service";
import { getDateRangeFromDays } from "@/infrastructure/formatting/date-range";

export default async function AdminReportsPage(props: PageProps<"/admin/relatorios">) {
  const searchParams = await props.searchParams;
  const range = typeof searchParams.range === "string" ? searchParams.range : "30";
  const { fromDate, toDate } = getDateRangeFromDays(Number(range) || 30);

  const [revenue, statusBreakdown, topServices, barberPerformance] = await Promise.all([
    getRevenueByDay(fromDate, toDate),
    getAppointmentsByStatus(fromDate, toDate),
    getTopServices(fromDate, toDate),
    getBarberPerformance(fromDate, toDate),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Heading variant="heading-xl">Relatórios</Heading>
        <RangeTabs basePath="/admin/relatorios" activeRange={range} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <RevenueChart data={revenue} />
        <StatusBreakdownChart data={statusBreakdown} />
        <TopServicesChart data={topServices} />
        <BarberPerformanceChart data={barberPerformance} />
      </div>
    </div>
  );
}
