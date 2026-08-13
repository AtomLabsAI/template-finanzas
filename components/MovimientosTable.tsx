import type { Movimiento } from "@/lib/types";
import { formatFecha, formatMonto } from "@/lib/format";

/** Tabla de movimientos recientes, con borrado por fila. */
export function MovimientosTable({
  movimientos,
  onEliminar,
}: {
  movimientos: Movimiento[];
  onEliminar?: (id: string) => void;
}) {
  if (movimientos.length === 0) {
    return (
      <p className="mt-3 py-8 text-center text-sm text-muted">
        Sin movimientos en el período
      </p>
    );
  }

  return (
    <div className="mt-3 overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-borde text-left text-xs uppercase tracking-wide text-muted">
            <th className="py-2 pr-4 font-medium">Fecha</th>
            <th className="py-2 pr-4 font-medium">Descripción</th>
            <th className="hidden py-2 pr-4 font-medium sm:table-cell">
              Categoría
            </th>
            <th className="hidden py-2 pr-4 font-medium md:table-cell">
              Cuenta
            </th>
            <th className="py-2 text-right font-medium">Monto</th>
            {onEliminar && <th className="w-8" aria-label="Acciones" />}
          </tr>
        </thead>
        <tbody>
          {movimientos.map((m) => (
            <tr key={m.id} className="border-b border-borde last:border-0">
              <td className="whitespace-nowrap py-2.5 pr-4 text-secondary">
                {formatFecha(m.fecha)}
              </td>
              <td className="py-2.5 pr-4">{m.descripcion}</td>
              <td className="hidden py-2.5 pr-4 text-secondary sm:table-cell">
                {m.categoria}
              </td>
              <td className="hidden py-2.5 pr-4 text-secondary md:table-cell">
                {m.cuenta}
              </td>
              <td
                className={`whitespace-nowrap py-2.5 text-right font-medium tabular-nums ${
                  m.tipo === "ingreso" ? "text-positivo" : ""
                }`}
              >
                {m.tipo === "egreso" ? "−" : m.tipo === "ingreso" ? "+" : ""}
                {formatMonto(m.monto, m.moneda)}
              </td>
              {onEliminar && (
                <td className="py-2.5 pl-2 text-right">
                  <button
                    onClick={() => onEliminar(m.id)}
                    aria-label={`Eliminar ${m.descripcion}`}
                    title="Eliminar"
                    className="rounded px-1.5 text-muted hover:text-critico"
                  >
                    ✕
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
