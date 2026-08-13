"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { FlujoMes } from "@/lib/metrics";
import { formatMes, formatNumero } from "@/lib/format";
import { ChartTooltip } from "./ChartTooltip";

/** Barras mensuales de ingresos vs. egresos. */
export function FlujoChart({
  datos,
  moneda,
}: {
  datos: FlujoMes[];
  moneda: string;
}) {
  return (
    <div className="mt-3">
      <div className="h-60">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={datos} barGap={2} barCategoryGap="28%">
            <CartesianGrid
              vertical={false}
              stroke="var(--gridline)"
              strokeWidth={1}
            />
            <XAxis
              dataKey="mes"
              tickFormatter={formatMes}
              tick={{ fill: "var(--text-muted)", fontSize: 12 }}
              axisLine={{ stroke: "var(--baseline)" }}
              tickLine={false}
            />
            <YAxis
              tickFormatter={formatNumero}
              tick={{ fill: "var(--text-muted)", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={52}
            />
            <Tooltip
              cursor={{ fill: "var(--gridline)", opacity: 0.4 }}
              content={({ active, payload, label }) =>
                active && payload?.length ? (
                  <ChartTooltip
                    titulo={formatMes(String(label))}
                    moneda={moneda}
                    filas={payload.map((p) => ({
                      nombre: p.name === "ingresos" ? "Ingresos" : "Egresos",
                      valor: Number(p.value),
                      color: String(p.fill),
                    }))}
                  />
                ) : null
              }
            />
            <Bar
              dataKey="ingresos"
              name="ingresos"
              fill="var(--series-1)"
              radius={[4, 4, 0, 0]}
              maxBarSize={22}
            />
            <Bar
              dataKey="egresos"
              name="egresos"
              fill="var(--series-2)"
              radius={[4, 4, 0, 0]}
              maxBarSize={22}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Leyenda: la identidad de cada serie nunca depende solo del color */}
      <div className="mt-2 flex gap-4 text-xs text-secondary">
        <span className="flex items-center gap-1.5">
          <span className="inline-block size-2 rounded-full bg-series-1" />
          Ingresos
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block size-2 rounded-full bg-series-2" />
          Egresos
        </span>
      </div>
    </div>
  );
}
