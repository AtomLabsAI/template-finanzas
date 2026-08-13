export function KpiCard({
  titulo,
  valor,
  positivo,
}: {
  titulo: string;
  valor: string;
  /** Si se pasa, colorea el valor: verde cuando es true. */
  positivo?: boolean;
}) {
  return (
    <div className="rounded-xl border border-borde bg-surface p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-muted">
        {titulo}
      </p>
      <p
        className={`mt-1.5 text-2xl font-semibold tracking-tight ${
          positivo === true ? "text-positivo" : ""
        }`}
      >
        {valor}
      </p>
    </div>
  );
}
