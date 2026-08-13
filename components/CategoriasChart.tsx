"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { TotalCategoria } from "@/lib/metrics";
import { formatMonto } from "@/lib/format";
import { ChartTooltip } from "./ChartTooltip";

/**
 * Barras horizontales de egresos por categoría. Una sola serie (magnitud),
 * un solo color; cada barra lleva su etiqueta y su valor visibles.
 */
export function CategoriasChart({
  datos,
  moneda,
}: {
  datos: TotalCategoria[];
  moneda: string;
}) {
  if (datos.length === 0) {
    return (
      <p className="mt-3 flex h-60 items-center justify-center text-sm text-muted">
        Sin egresos en el período
      </p>
    );
  }

  return (
    <div className="mt-3 h-[268px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={datos}
          layout="vertical"
          barCategoryGap="32%"
          margin={{ right: 72 }}
        >
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="categoria"
            tick={{ fill: "var(--text-secondary)", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={92}
          />
          <Tooltip
            cursor={{ fill: "var(--gridline)", opacity: 0.4 }}
            content={({ active, payload }) =>
              active && payload?.length ? (
                <ChartTooltip
                  titulo={String(payload[0].payload.categoria)}
                  moneda={moneda}
                  filas={[{ nombre: "Egresos", valor: Number(payload[0].value) }]}
                />
              ) : null
            }
          />
          <Bar
            dataKey="total"
            fill="var(--series-2)"
            radius={[0, 4, 4, 0]}
            maxBarSize={16}
            label={{
              position: "right",
              fill: "var(--text-secondary)",
              fontSize: 11,
              formatter: (valor: unknown) => formatMonto(Number(valor), moneda),
            }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
