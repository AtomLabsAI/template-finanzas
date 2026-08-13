import { formatMonto } from "@/lib/format";

interface Fila {
  nombre: string;
  valor: number;
  color?: string;
}

/** Tooltip compartido por los gráficos: título + una fila por serie. */
export function ChartTooltip({
  titulo,
  filas,
  moneda,
}: {
  titulo: string;
  filas: Fila[];
  moneda: string;
}) {
  return (
    <div className="rounded-lg border border-borde bg-surface px-3 py-2 shadow-sm">
      <p className="text-xs font-medium text-secondary">{titulo}</p>
      {filas.map((fila) => (
        <p
          key={fila.nombre}
          className="mt-1 flex items-center gap-1.5 text-sm text-primary"
        >
          {fila.color && (
            <span
              className="inline-block size-2 rounded-full"
              style={{ background: fila.color }}
            />
          )}
          <span className="text-secondary">{fila.nombre}</span>
          <span className="ml-auto pl-3 font-medium tabular-nums">
            {formatMonto(fila.valor, moneda)}
          </span>
        </p>
      ))}
    </div>
  );
}
