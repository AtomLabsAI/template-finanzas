import type { Cuenta, DatosFinanzas, Movimiento, TipoMovimiento } from "../types";

/**
 * Datos de ejemplo para que el dashboard funcione sin conectar nada.
 * Se generan sobre los últimos 12 meses relativos a hoy, así la demo
 * siempre se ve actual. Cuando conectes tu base de datos real este
 * archivo deja de usarse (ver lib/data/index.ts).
 */

const CUENTAS: Cuenta[] = [
  { id: "c1", nombre: "Banco USD", moneda: "USD" },
  { id: "c2", nombre: "Banco Pesos", moneda: "UYU" },
  { id: "c3", nombre: "Billetera USD", moneda: "USD" },
];

// Ítems recurrentes: se repiten todos los meses con una pequeña variación.
interface ItemRecurrente {
  dia: number;
  tipo: TipoMovimiento;
  descripcion: string;
  categoria: string;
  monto: number;
  moneda: string;
  cuenta: string;
}

const RECURRENTES: ItemRecurrente[] = [
  { dia: 3, tipo: "ingreso", descripcion: "Retainer Cliente A", categoria: "Consultoría", monto: 1800, moneda: "USD", cuenta: "Banco USD" },
  { dia: 10, tipo: "ingreso", descripcion: "Retainer Cliente B", categoria: "Consultoría", monto: 1200, moneda: "USD", cuenta: "Banco USD" },
  { dia: 15, tipo: "ingreso", descripcion: "Ventas del mes", categoria: "Ventas", monto: 950, moneda: "USD", cuenta: "Billetera USD" },
  { dia: 20, tipo: "ingreso", descripcion: "Servicios locales", categoria: "Ventas", monto: 38000, moneda: "UYU", cuenta: "Banco Pesos" },
  { dia: 1, tipo: "egreso", descripcion: "Sueldo Persona 1", categoria: "Sueldos", monto: 900, moneda: "USD", cuenta: "Banco USD" },
  { dia: 1, tipo: "egreso", descripcion: "Sueldo Persona 2", categoria: "Sueldos", monto: 750, moneda: "USD", cuenta: "Banco USD" },
  { dia: 5, tipo: "egreso", descripcion: "Suscripciones de software", categoria: "Software", monto: 260, moneda: "USD", cuenta: "Billetera USD" },
  { dia: 8, tipo: "egreso", descripcion: "Publicidad", categoria: "Marketing", monto: 300, moneda: "USD", cuenta: "Billetera USD" },
  { dia: 12, tipo: "egreso", descripcion: "Contadora", categoria: "Servicios", monto: 6500, moneda: "UYU", cuenta: "Banco Pesos" },
  { dia: 25, tipo: "egreso", descripcion: "Impuestos", categoria: "Impuestos", monto: 12000, moneda: "UYU", cuenta: "Banco Pesos" },
  { dia: 18, tipo: "egreso", descripcion: "Oficina y varios", categoria: "Oficina", monto: 120, moneda: "USD", cuenta: "Billetera USD" },
];

const MESES_DE_HISTORIA = 12;

/** Variación determinística (sin Math.random) para que los meses no sean idénticos. */
function variacion(base: number, mesIndex: number, dia: number): number {
  const factor = 1 + 0.14 * Math.sin(mesIndex * 2.3 + dia * 0.7);
  return Math.round(base * factor);
}

function generarMovimientos(): Movimiento[] {
  const hoy = new Date();
  const movimientos: Movimiento[] = [];
  let id = 1;

  for (let i = MESES_DE_HISTORIA - 1; i >= 0; i--) {
    const mes = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1);
    for (const item of RECURRENTES) {
      const fecha = new Date(mes.getFullYear(), mes.getMonth(), item.dia);
      if (fecha > hoy) continue;
      movimientos.push({
        id: `m${id++}`,
        fecha: fecha.toISOString().slice(0, 10),
        tipo: item.tipo,
        descripcion: item.descripcion,
        categoria: item.categoria,
        monto: variacion(item.monto, i, item.dia),
        moneda: item.moneda,
        cuenta: item.cuenta,
      });
    }
    // Un proyecto puntual cada tres meses, para que el gráfico tenga picos.
    if (i % 3 === 0) {
      const fecha = new Date(mes.getFullYear(), mes.getMonth(), 22);
      if (fecha <= hoy) {
        movimientos.push({
          id: `m${id++}`,
          fecha: fecha.toISOString().slice(0, 10),
          tipo: "ingreso",
          descripcion: "Proyecto puntual",
          categoria: "Consultoría",
          monto: variacion(2400, i, 22),
          moneda: "USD",
          cuenta: "Banco USD",
        });
      }
    }
  }

  return movimientos.sort((a, b) => b.fecha.localeCompare(a.fecha));
}

export async function getDatosMock(): Promise<DatosFinanzas> {
  return { movimientos: generarMovimientos(), cuentas: CUENTAS };
}
