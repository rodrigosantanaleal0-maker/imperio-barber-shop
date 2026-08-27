"use client";

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { formatCentsToBRL } from "@/infrastructure/formatting/currency";
import type { TopServicePoint } from "@/domain/types/admin";

export function TopServicesChart({ data }: { data: TopServicePoint[] }) {
  const chartData = data.map((point) => ({ name: point.serviceName, count: point.count, revenue: point.revenueCents }));

  return (
    <div className="h-72 w-full border border-smoke bg-graphite/40 p-6">
      <p className="mb-4 text-label uppercase text-muted">Serviços mais vendidos</p>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={chartData} layout="vertical" margin={{ left: 24 }}>
          <CartesianGrid stroke="#252525" horizontal={false} />
          <XAxis type="number" stroke="#9b9b9b" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
          <YAxis type="category" dataKey="name" stroke="#9b9b9b" fontSize={12} tickLine={false} axisLine={false} width={120} />
          <Tooltip
            contentStyle={{ background: "#0b0b0b", border: "1px solid #252525", color: "#f2efe8" }}
            formatter={(value, key) => (key === "count" ? value : formatCentsToBRL(Number(value)))}
          />
          <Bar dataKey="count" fill="#c9a227" radius={[0, 2, 2, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
