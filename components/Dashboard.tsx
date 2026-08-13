"use client";

import { useEffect, useMemo, useState } from "react";
import type { Movimiento, NuevoMovimiento } from "@/lib/types";
import { getFuente } from "@/lib/data";
import { movimientosDemo } from "@/lib/data/demo";
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
import { MovimientoForm, type Sugerencias } from "./MovimientoForm";

const RANGOS = [
  { meses: 3, etiqueta: "3 meses" },
  { meses: 6, etiqueta: "6 meses" },
  { meses: 12, etiqueta: "12 meses" },
];

const CATEGORIAS_SUGERIDAS = [
  "Ventas",
  "Consultoría",
  "Sueldos",
  "Software",
  "Marketing",
  "Impuestos",
  "Servicios",
  "Oficina",
  "Otros",
];

const MONEDAS_SUGERIDAS = ["USD", "UYU", "ARS", "EUR"];

function unicos(valores: string[], extras: string[] = []): string[] {
  return [...new Set([...valores, ...extras])];
}

export function Dashboard() {
  const fuente = useMemo(getFuente, []);
  const [movimientos, setMovimientos] = useState<Movimiento[] | null>(null);
  const [formAbierto, setFormAbierto] = useState(false);
  const [monedaSel, setMonedaSel] = useState<string | null>(null);
  const [meses, setMeses] = useState(6);

  useEffect(() => {
    fuente.getMovimientos().then(setMovimientos);
  }, [fuente]);

  const monedas = useMemo(
    () => [...new Set((movimientos ?? []).map((m) => m.moneda))].sort(),
    [movimientos],
  );
  // Si la moneda elegida ya no existe (p. ej. se borraron sus movimientos), cae a la primera.
  const moneda = monedaSel && monedas.includes(monedaSel) ? monedaSel : monedas[0];

  const filtrados = useMemo(
    () =>
      movimientos && moneda
        ? filtrarMovimientos(movimientos, { moneda, meses })
        : [],
    [movimientos, moneda, meses],
  );
  const kpis = useMemo(() => calcularKpis(filtrados), [filtrados]);
  const flujo = useMemo(() => flujoPorMes(filtrados), [filtrados]);
  const categorias = useMemo(() => egresosPorCategoria(filtrados), [filtrados]);

  const sugerencias: Sugerencias = useMemo(() => {
    const todos = movimientos ?? [];
    return {
      categorias: unicos(todos.map((m) => m.categoria), CATEGORIAS_SUGERIDAS),
      monedas: unicos(todos.map((m) => m.moneda), MONEDAS_SUGERIDAS),
      cuentas: unicos(todos.map((m) => m.cuenta)),
    };
  }, [movimientos]);

  async function guardarMovimiento(datos: NuevoMovimiento) {
    const creado = await fuente.crearMovimiento(datos);
    setMovimientos((prev) =>
      [creado, ...(prev ?? [])].sort((a, b) => b.fecha.localeCompare(a.fecha)),
    );
  }

  async function eliminarMovimiento(id: string) {
    await fuente.eliminarMovimiento(id);
    setMovimientos((prev) => (prev ?? []).filter((m) => m.id !== id));
  }

  async function cargarDemo() {
    await fuente.crearMovimientos(movimientosDemo());
    setMovimientos(await fuente.getMovimientos());
  }

  async function borrarTodo() {
    if (!window.confirm("¿Borrar TODOS los movimientos? No se puede deshacer."))
      return;
    await fuente.borrarTodo();
    setMovimientos([]);
  }

  if (movimientos === null) {
    return (
      <main className="flex flex-1 items-center justify-center text-sm text-muted">
        Cargando…
      </main>
    );
  }

  // ---- Estado vacío: el dashboard arranca de cero ----
  if (movimientos.length === 0) {
    return (
      <main className="flex flex-1 items-center justify-center px-4">
        <div className="w-full max-w-md rounded-xl border border-borde bg-surface p-8 text-center">
          <h1 className="text-xl font-semibold">Tu dashboard de finanzas</h1>
          <p className="mt-2 text-sm text-secondary">
            Todavía no hay movimientos. Cargá el primero y los KPIs y gráficos
            se arman solos.
          </p>
          <button
            onClick={() => setFormAbierto(true)}
            className="mt-5 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-page"
          >
            + Agregar primer movimiento
          </button>
          <p className="mt-4 text-xs text-muted">
            ¿Solo querés ver cómo queda?{" "}
            <button onClick={cargarDemo} className="underline hover:text-primary">
              Cargar datos de ejemplo
            </button>{" "}
            (después los borrás con un click)
          </p>
        </div>
        {formAbierto && (
          <MovimientoForm
            sugerencias={sugerencias}
            onGuardar={guardarMovimiento}
            onCerrar={() => setFormAbierto(false)}
          />
        )}
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Finanzas</h1>
          <p className="mt-1 text-sm text-secondary">
            Ingresos, egresos y resultado del período
          </p>
        </div>

        {/* Filtros y acciones: una sola fila arriba de los gráficos */}
        <div className="flex flex-wrap items-center gap-2">
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
              onChange={(e) => setMonedaSel(e.target.value)}
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
          <button
            onClick={() => setFormAbierto(true)}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-page"
          >
            + Nuevo movimiento
          </button>
        </div>
      </header>

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard titulo="Ingresos" valor={formatMonto(kpis.ingresos, moneda!)} />
        <KpiCard titulo="Egresos" valor={formatMonto(kpis.egresos, moneda!)} />
        <KpiCard
          titulo="Resultado"
          valor={formatMonto(kpis.resultado, moneda!)}
          positivo={kpis.resultado >= 0}
        />
        <KpiCard
          titulo="Egreso promedio / mes"
          valor={formatMonto(kpis.burnMensual, moneda!)}
        />
      </section>

      <section className="mt-4 grid gap-4 lg:grid-cols-5">
        <div className="rounded-xl border border-borde bg-surface p-4 lg:col-span-3">
          <h2 className="text-sm font-medium text-secondary">
            Flujo mensual · {moneda}
          </h2>
          <FlujoChart datos={flujo} moneda={moneda!} />
        </div>
        <div className="rounded-xl border border-borde bg-surface p-4 lg:col-span-2">
          <h2 className="text-sm font-medium text-secondary">
            Egresos por categoría · {moneda}
          </h2>
          <CategoriasChart datos={categorias} moneda={moneda!} />
        </div>
      </section>

      <section className="mt-4 rounded-xl border border-borde bg-surface p-4">
        <h2 className="text-sm font-medium text-secondary">
          Últimos movimientos
        </h2>
        <MovimientosTable
          movimientos={filtrados.slice(0, 12)}
          onEliminar={eliminarMovimiento}
        />
      </section>

      <footer className="mt-6 text-right">
        <button
          onClick={borrarTodo}
          className="text-xs text-muted underline hover:text-critico"
        >
          Borrar todos los movimientos
        </button>
      </footer>

      {formAbierto && (
        <MovimientoForm
          sugerencias={sugerencias}
          onGuardar={guardarMovimiento}
          onCerrar={() => setFormAbierto(false)}
        />
      )}
    </main>
  );
}
