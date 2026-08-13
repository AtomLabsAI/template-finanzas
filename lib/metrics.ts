import type { Movimiento } from "./types";

/**
 * Todas las cuentas del dashboard se calculan acá, a partir de la lista
 * de movimientos ya filtrada (por moneda y por período). Las transferencias
 * entre cuentas propias no suman ni restan.
 */

export interface Kpis {
  ingresos: number;
  egresos: number;
  resultado: number;
  /** Egresos promedio por mes en el período */
  burnMensual: number;
}

export interface FlujoMes {
  /** "2026-03" */
  mes: string;
  ingresos: number;
  egresos: number;
  resultado: number;
}

export interface TotalCategoria {
  categoria: string;
  total: number;
}

export function filtrarMovimientos(
  movimientos: Movimiento[],
  opciones: { moneda: string; meses: number },
): Movimiento[] {
  const desde = new Date();
  desde.setMonth(desde.getMonth() - (opciones.meses - 1));
  desde.setDate(1);
  const desdeIso = desde.toISOString().slice(0, 10);

  return movimientos.filter(
    (m) => m.moneda === opciones.moneda && m.fecha >= desdeIso,
  );
}

export function calcularKpis(movimientos: Movimiento[]): Kpis {
  let ingresos = 0;
  let egresos = 0;
  for (const m of movimientos) {
    if (m.tipo === "ingreso") ingresos += m.monto;
    else if (m.tipo === "egreso") egresos += m.monto;
  }
  const meses = new Set(movimientos.map((m) => m.fecha.slice(0, 7))).size || 1;
  return {
    ingresos,
    egresos,
    resultado: ingresos - egresos,
    burnMensual: Math.round(egresos / meses),
  };
}

export function flujoPorMes(movimientos: Movimiento[]): FlujoMes[] {
  const porMes = new Map<string, { ingresos: number; egresos: number }>();
  for (const m of movimientos) {
    const mes = m.fecha.slice(0, 7);
    const acumulado = porMes.get(mes) ?? { ingresos: 0, egresos: 0 };
    if (m.tipo === "ingreso") acumulado.ingresos += m.monto;
    else if (m.tipo === "egreso") acumulado.egresos += m.monto;
    porMes.set(mes, acumulado);
  }
  return [...porMes.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([mes, { ingresos, egresos }]) => ({
      mes,
      ingresos,
      egresos,
      resultado: ingresos - egresos,
    }));
}

export function egresosPorCategoria(
  movimientos: Movimiento[],
  top = 6,
): TotalCategoria[] {
  const porCategoria = new Map<string, number>();
  for (const m of movimientos) {
    if (m.tipo !== "egreso") continue;
    porCategoria.set(m.categoria, (porCategoria.get(m.categoria) ?? 0) + m.monto);
  }
  const ordenadas = [...porCategoria.entries()]
    .map(([categoria, total]) => ({ categoria, total }))
    .sort((a, b) => b.total - a.total);

  if (ordenadas.length <= top) return ordenadas;
  const principales = ordenadas.slice(0, top - 1);
  const resto = ordenadas.slice(top - 1).reduce((sum, c) => sum + c.total, 0);
  return [...principales, { categoria: "Otras", total: resto }];
}
