"use client";

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { formatCentsToBRL } from "@/infrastructure/formatting/currency";
import type { RevenueByDayPoint } from "@/domain/types/admin";

function formatDayLabel(dayISO: string): string {
  return new Date(`${dayISO}T00:00:00`).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}

export function RevenueChart({ data }: { data: RevenueByDayPoint[] }) {
  const chartData = data.map((point) => ({ day: formatDayLabel(point.day), revenue: point.revenueCents / 100 }));

  return (
    <div className="h-72 w-full border border-smoke bg-graphite/40 p-6">
      <p className="mb-4 text-label uppercase text-muted">Receita por dia</p>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={chartData}>
          <CartesianGrid stroke="#252525" vertical={false} />
          <XAxis dataKey="day" stroke="#9b9b9b" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#9b9b9b" fontSize={12} tickLine={false} axisLine={false} width={40} />
          <Tooltip
            contentStyle={{ background: "#0b0b0b", border: "1px solid #252525", color: "#f2efe8" }}
            formatter={(value) => formatCentsToBRL(Number(value) * 100)}
          />
          <Line type="monotone" dataKey="revenue" stroke="#c9a227" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
