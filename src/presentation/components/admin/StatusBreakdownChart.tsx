"use client";

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import type { StatusBreakdownPoint } from "@/domain/types/admin";
import type { AppointmentStatus } from "@/domain/types/database";

const STATUS_LABEL: Record<AppointmentStatus, string> = {
  pending_payment: "Aguardando pagamento",
  confirmed: "Confirmado",
  completed: "Concluído",
  canceled: "Cancelado",
  no_show: "Não compareceu",
};

const STATUS_COLOR: Record<AppointmentStatus, string> = {
  pending_payment: "#252525",
  confirmed: "#c9a227",
  completed: "#e3c766",
  canceled: "#9b9b9b",
  no_show: "#b3261e",
};

export function StatusBreakdownChart({ data }: { data: StatusBreakdownPoint[] }) {
  const chartData = data.map((point) => ({ name: STATUS_LABEL[point.status], value: point.count, status: point.status }));

  return (
    <div className="h-72 w-full border border-smoke bg-graphite/40 p-6">
      <p className="mb-4 text-label uppercase text-muted">Agendamentos por status</p>
      <ResponsiveContainer width="100%" height="85%">
        <PieChart>
          <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80}>
            {chartData.map((entry) => (
              <Cell key={entry.status} fill={STATUS_COLOR[entry.status]} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ background: "#0b0b0b", border: "1px solid #252525", color: "#f2efe8" }} />
          <Legend wrapperStyle={{ fontSize: 12, color: "#9b9b9b" }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
