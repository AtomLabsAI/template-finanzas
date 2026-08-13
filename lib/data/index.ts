import type { DatosFinanzas } from "../types";
import { getDatosMock } from "./mock";
import { getDatosSupabase } from "./supabase";

/**
 * ÚNICO punto de entrada de datos del dashboard.
 *
 * - Sin configurar nada → usa datos de ejemplo (lib/data/mock.ts).
 * - Con las variables de Supabase en .env.local → lee de tus tablas
 *   (lib/data/supabase.ts + supabase/schema.sql).
 * - ¿Otra base de datos o una API propia? Escribí tu propia función
 *   que devuelva DatosFinanzas y llamala acá. Es lo único que hay
 *   que tocar: el resto del dashboard no sabe de dónde vienen los datos.
 */
export async function getDatos(): Promise<DatosFinanzas> {
  const haySupabase =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return haySupabase ? getDatosSupabase() : getDatosMock();
}
