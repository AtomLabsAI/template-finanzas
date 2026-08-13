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

export interface Cuenta {
  id: string;
  nombre: string;
  moneda: string;
}

export interface DatosFinanzas {
  movimientos: Movimiento[];
  cuentas: Cuenta[];
}
