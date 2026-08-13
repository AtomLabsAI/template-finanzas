"use client";

import { useState } from "react";
import type { NuevoMovimiento, TipoMovimiento } from "@/lib/types";

const INPUT =
  "w-full rounded-lg border border-borde bg-page px-3 py-2 text-sm outline-none focus:border-baseline";

export interface Sugerencias {
  categorias: string[];
  monedas: string[];
  cuentas: string[];
}

/** Modal para cargar un movimiento nuevo. */
export function MovimientoForm({
  sugerencias,
  onGuardar,
  onCerrar,
}: {
  sugerencias: Sugerencias;
  onGuardar: (datos: NuevoMovimiento) => Promise<void>;
  onCerrar: () => void;
}) {
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10));
  const [tipo, setTipo] = useState<TipoMovimiento>("egreso");
  const [descripcion, setDescripcion] = useState("");
  const [categoria, setCategoria] = useState("");
  const [monto, setMonto] = useState("");
  const [moneda, setMoneda] = useState(sugerencias.monedas[0] ?? "USD");
  const [cuenta, setCuenta] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    const montoNum = Number(monto);
    if (!montoNum || montoNum <= 0) {
      setError("El monto tiene que ser mayor a cero.");
      return;
    }
    setGuardando(true);
    setError("");
    try {
      await onGuardar({
        fecha,
        tipo,
        descripcion: descripcion.trim(),
        categoria: categoria.trim() || "Otros",
        monto: montoNum,
        moneda: moneda.trim().toUpperCase(),
        cuenta: cuenta.trim() || "Principal",
      });
      onCerrar();
    } catch {
      setError("No se pudo guardar. Probá de nuevo.");
      setGuardando(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onCerrar}
    >
      <form
        onSubmit={enviar}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-xl border border-borde bg-surface p-5 shadow-lg"
      >
        <h2 className="text-lg font-semibold">Nuevo movimiento</h2>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <label className="col-span-1 text-xs font-medium text-secondary">
            Tipo
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value as TipoMovimiento)}
              className={`${INPUT} mt-1`}
            >
              <option value="egreso">Egreso</option>
              <option value="ingreso">Ingreso</option>
              <option value="transferencia">Transferencia</option>
            </select>
          </label>

          <label className="col-span-1 text-xs font-medium text-secondary">
            Fecha
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              required
              className={`${INPUT} mt-1`}
            />
          </label>

          <label className="col-span-2 text-xs font-medium text-secondary">
            Descripción
            <input
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required
              placeholder="Sueldo, cobro cliente, suscripción…"
              className={`${INPUT} mt-1`}
            />
          </label>

          <label className="col-span-1 text-xs font-medium text-secondary">
            Monto
            <input
              type="number"
              inputMode="decimal"
              min="0.01"
              step="0.01"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              required
              placeholder="0"
              className={`${INPUT} mt-1`}
            />
          </label>

          <label className="col-span-1 text-xs font-medium text-secondary">
            Moneda
            <input
              value={moneda}
              onChange={(e) => setMoneda(e.target.value)}
              required
              list="lista-monedas"
              className={`${INPUT} mt-1`}
            />
            <datalist id="lista-monedas">
              {sugerencias.monedas.map((m) => (
                <option key={m} value={m} />
              ))}
            </datalist>
          </label>

          <label className="col-span-1 text-xs font-medium text-secondary">
            Categoría
            <input
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              list="lista-categorias"
              placeholder="Sueldos, Ventas…"
              className={`${INPUT} mt-1`}
            />
            <datalist id="lista-categorias">
              {sugerencias.categorias.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </label>

          <label className="col-span-1 text-xs font-medium text-secondary">
            Cuenta
            <input
              value={cuenta}
              onChange={(e) => setCuenta(e.target.value)}
              list="lista-cuentas"
              placeholder="Banco, Efectivo…"
              className={`${INPUT} mt-1`}
            />
            <datalist id="lista-cuentas">
              {sugerencias.cuentas.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </label>
        </div>

        {error && <p className="mt-3 text-sm text-critico">{error}</p>}

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCerrar}
            className="rounded-lg px-4 py-2 text-sm text-secondary hover:text-primary"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={guardando}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-page disabled:opacity-60"
          >
            {guardando ? "Guardando…" : "Guardar"}
          </button>
        </div>
      </form>
    </div>
  );
}
