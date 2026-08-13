import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Movimiento, NuevoMovimiento } from "../types";
import type { FuenteDatos } from "./provider";

/**
 * Fuente con Supabase. Se activa sola cuando definís
 * NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY en .env.local.
 * El schema de la tabla está en supabase/schema.sql.
 */

let cliente: SupabaseClient | null = null;

function supabase(): SupabaseClient {
  cliente ??= createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
  return cliente;
}

const COLUMNAS = "id, fecha, tipo, descripcion, categoria, monto, moneda, cuenta";

export const fuenteSupabase: FuenteDatos = {
  async getMovimientos() {
    const { data, error } = await supabase()
      .from("movimientos")
      .select(COLUMNAS)
      .order("fecha", { ascending: false })
      .limit(2000);
    if (error) throw error;
    return (data ?? []) as Movimiento[];
  },

  async crearMovimiento(datos: NuevoMovimiento) {
    const { data, error } = await supabase()
      .from("movimientos")
      .insert(datos)
      .select(COLUMNAS)
      .single();
    if (error) throw error;
    return data as Movimiento;
  },

  async crearMovimientos(lista: NuevoMovimiento[]) {
    const { data, error } = await supabase()
      .from("movimientos")
      .insert(lista)
      .select(COLUMNAS);
    if (error) throw error;
    return (data ?? []) as Movimiento[];
  },

  async eliminarMovimiento(id: string) {
    const { error } = await supabase().from("movimientos").delete().eq("id", id);
    if (error) throw error;
  },

  async borrarTodo() {
    const { error } = await supabase()
      .from("movimientos")
      .delete()
      .gte("fecha", "0001-01-01");
    if (error) throw error;
  },
};
