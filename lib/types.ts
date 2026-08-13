export type TipoMovimiento = "ingreso" | "egreso" | "transferencia";

/**
 * Un movimiento de dinero. El monto es siempre positivo;
 * el signo lo da el tipo (ingreso / egreso).
 */
export interface Movimiento {
  id: string;
  /** Fecha en formato YYYY-MM-DD */
  fecha: string;
  tipo: TipoMovimiento;
  descripcion: string;
  categoria: string;
  monto: number;
  /** Código ISO de la moneda: "USD", "UYU", "ARS", "EUR"... */
  moneda: string;
  cuenta: string;
}

/** Lo que se completa en el formulario: todo menos el id, que lo asigna la fuente. */
export type NuevoMovimiento = Omit<Movimiento, "id">;
