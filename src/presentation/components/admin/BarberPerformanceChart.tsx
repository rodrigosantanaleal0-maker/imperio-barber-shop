"use client";

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { formatCentsToBRL } from "@/infrastructure/formatting/currency";
import type { BarberPerformancePoint } from "@/domain/types/admin";

export function BarberPerformanceChart({ data }: { data: BarberPerformancePoint[] }) {
  const chartData = data.map((point) => ({
    name: point.barberName.split(" ")[0],
    revenue: point.revenueCents,
    appointments: point.appointmentsCount,
  }));

  return (
    <div className="h-72 w-full border border-smoke bg-graphite/40 p-6">
      <p className="mb-4 text-label uppercase text-muted">Faturamento por barbeiro</p>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={chartData}>
          <CartesianGrid stroke="#252525" vertical={false} />
          <XAxis dataKey="name" stroke="#9b9b9b" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#9b9b9b" fontSize={12} tickLine={false} axisLine={false} width={40} />
          <Tooltip
            contentStyle={{ background: "#0b0b0b", border: "1px solid #252525", color: "#f2efe8" }}
            formatter={(value) => formatCentsToBRL(Number(value))}
          />
          <Bar dataKey="revenue" fill="#e3c766" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
