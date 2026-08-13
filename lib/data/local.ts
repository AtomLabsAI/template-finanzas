import type { Movimiento, NuevoMovimiento } from "../types";
import type { FuenteDatos } from "./provider";

/**
 * Fuente por defecto: guarda todo en el localStorage del navegador.
 * Sin configurar nada, el dashboard funciona y los datos quedan en
 * este dispositivo. Para persistencia real (multi-dispositivo, backups)
 * conectá Supabase o tu propia base (ver lib/data/index.ts).
 */

const KEY = "finanzas.movimientos";

function leer(): Movimiento[] {
  try {
    const guardados = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    return Array.isArray(guardados) ? guardados : [];
  } catch {
    return [];
  }
}

function guardar(movimientos: Movimiento[]) {
  localStorage.setItem(KEY, JSON.stringify(movimientos));
}

function ordenar(movimientos: Movimiento[]): Movimiento[] {
  return [...movimientos].sort((a, b) => b.fecha.localeCompare(a.fecha));
}

export const fuenteLocal: FuenteDatos = {
  async getMovimientos() {
    return ordenar(leer());
  },

  async crearMovimiento(datos: NuevoMovimiento) {
    const movimiento: Movimiento = { ...datos, id: crypto.randomUUID() };
    guardar([movimiento, ...leer()]);
    return movimiento;
  },

  async crearMovimientos(lista: NuevoMovimiento[]) {
    const movimientos = lista.map((datos) => ({
      ...datos,
      id: crypto.randomUUID(),
    }));
    guardar([...movimientos, ...leer()]);
    return movimientos;
  },

  async eliminarMovimiento(id: string) {
    guardar(leer().filter((m) => m.id !== id));
  },

  async borrarTodo() {
    localStorage.removeItem(KEY);
  },
};
