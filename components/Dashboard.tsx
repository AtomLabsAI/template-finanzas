"use client";

import { useMemo, useState } from "react";
import type { DatosFinanzas } from "@/lib/types";
import {
  calcularKpis,
  egresosPorCategoria,
  filtrarMovimientos,
  flujoPorMes,
} from "@/lib/metrics";
import { formatMonto } from "@/lib/format";
import { KpiCard } from "./KpiCard";
import { FlujoChart } from "./FlujoChart";
import { CategoriasChart } from "./CategoriasChart";
import { MovimientosTable } from "./MovimientosTable";

const RANGOS = [
  { meses: 3, etiqueta: "3 meses" },
  { meses: 6, etiqueta: "6 meses" },
  { meses: 12, etiqueta: "12 meses" },
];

export function Dashboard({ datos }: { datos: DatosFinanzas }) {
  const monedas = useMemo(
    () => [...new Set(datos.movimientos.map((m) => m.moneda))].sort(),
    [datos.movimientos],
  );
  const [moneda, setMoneda] = useState(monedas[0] ?? "USD");
  const [meses, setMeses] = useState(6);

  const movimientos = useMemo(
    () => filtrarMovimientos(datos.movimientos, { moneda, meses }),
    [datos.movimientos, moneda, meses],
  );
  const kpis = useMemo(() => calcularKpis(movimientos), [movimientos]);
  const flujo = useMemo(() => flujoPorMes(movimientos), [movimientos]);
  const categorias = useMemo(() => egresosPorCategoria(movimientos), [movimientos]);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Finanzas</h1>
          <p className="mt-1 text-sm text-secondary">
            Ingresos, egresos y resultado del período
          </p>
        </div>

        {/* Filtros: una sola fila arriba de los gráficos */}
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-borde bg-surface p-0.5">
            {RANGOS.map((r) => (
              <button
                key={r.meses}
                onClick={() => setMeses(r.meses)}
                className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                  meses === r.meses
                    ? "bg-primary text-page font-medium"
                    : "text-secondary hover:text-primary"
                }`}
              >
                {r.etiqueta}
              </button>
            ))}
          </div>
          {monedas.length > 1 && (
            <select
              value={moneda}
              onChange={(e) => setMoneda(e.target.value)}
              className="rounded-lg border border-borde bg-surface px-3 py-2 text-sm"
              aria-label="Moneda"
            >
              {monedas.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          )}
        </div>
      </header>

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard titulo="Ingresos" valor={formatMonto(kpis.ingresos, moneda)} />
        <KpiCard titulo="Egresos" valor={formatMonto(kpis.egresos, moneda)} />
        <KpiCard
          titulo="Resultado"
          valor={formatMonto(kpis.resultado, moneda)}
          positivo={kpis.resultado >= 0}
        />
        <KpiCard
          titulo="Egreso promedio / mes"
          valor={formatMonto(kpis.burnMensual, moneda)}
        />
      </section>

      <section className="mt-4 grid gap-4 lg:grid-cols-5">
        <div className="rounded-xl border border-borde bg-surface p-4 lg:col-span-3">
          <h2 className="text-sm font-medium text-secondary">
            Flujo mensual · {moneda}
          </h2>
          <FlujoChart datos={flujo} moneda={moneda} />
        </div>
        <div className="rounded-xl border border-borde bg-surface p-4 lg:col-span-2">
          <h2 className="text-sm font-medium text-secondary">
            Egresos por categoría · {moneda}
          </h2>
          <CategoriasChart datos={categorias} moneda={moneda} />
        </div>
      </section>

      <section className="mt-4 rounded-xl border border-borde bg-surface p-4">
        <h2 className="text-sm font-medium text-secondary">
          Últimos movimientos
        </h2>
        <MovimientosTable movimientos={movimientos.slice(0, 12)} />
      </section>
    </main>
  );
}
