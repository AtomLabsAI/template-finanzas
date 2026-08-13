import type { Movimiento, NuevoMovimiento } from "../types";

/**
 * Contrato que cumple cualquier fuente de datos del dashboard.
 * Hay dos implementaciones incluidas (localStorage y Supabase);
 * para conectar otra base o API escribí la tuya y devolvela
 * desde getFuente() en lib/data/index.ts.
 */
export interface FuenteDatos {
  /** Todos los movimientos, ordenados por fecha descendente. */
  getMovimientos(): Promise<Movimiento[]>;
  crearMovimiento(datos: NuevoMovimiento): Promise<Movimiento>;
  /** Alta masiva (la usa el botón de datos de ejemplo). */
  crearMovimientos(lista: NuevoMovimiento[]): Promise<Movimiento[]>;
  eliminarMovimiento(id: string): Promise<void>;
  borrarTodo(): Promise<void>;
}
