/** Formateo de números y fechas, centralizado para cambiarlo en un solo lugar. */

const LOCALE = "es-UY";

export function formatMonto(valor: number, moneda: string): string {
  return new Intl.NumberFormat(LOCALE, {
    style: "currency",
    currency: moneda,
    maximumFractionDigits: 0,
  }).format(valor);
}

export function formatNumero(valor: number): string {
  return new Intl.NumberFormat(LOCALE, { maximumFractionDigits: 0 }).format(
    valor,
  );
}

/** "2026-03" → "mar 26" */
export function formatMes(mesIso: string): string {
  const [anio, mes] = mesIso.split("-").map(Number);
  const fecha = new Date(anio, mes - 1, 1);
  return new Intl.DateTimeFormat(LOCALE, {
    month: "short",
    year: "2-digit",
  }).format(fecha);
}

/** "2026-03-15" → "15 mar 2026" */
export function formatFecha(fechaIso: string): string {
  const [anio, mes, dia] = fechaIso.split("-").map(Number);
  const fecha = new Date(anio, mes - 1, dia);
  return new Intl.DateTimeFormat(LOCALE, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(fecha);
}
