import { createClient } from "@supabase/supabase-js";
import type { Cuenta, DatosFinanzas, Movimiento } from "../types";

/**
 * Implementación con Supabase. Se activa sola cuando definís
 * NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY en .env.local.
 * El schema de las tablas está en supabase/schema.sql.
 */
export async function getDatosSupabase(): Promise<DatosFinanzas> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const [movimientosRes, cuentasRes] = await Promise.all([
    supabase
      .from("movimientos")
      .select("id, fecha, tipo, descripcion, categoria, monto, moneda, cuenta")
      .order("fecha", { ascending: false })
      .limit(1000),
    supabase.from("cuentas").select("id, nombre, moneda"),
  ]);

  if (movimientosRes.error) throw movimientosRes.error;
  if (cuentasRes.error) throw cuentasRes.error;

  return {
    movimientos: (movimientosRes.data ?? []) as Movimiento[],
    cuentas: (cuentasRes.data ?? []) as Cuenta[],
  };
}
