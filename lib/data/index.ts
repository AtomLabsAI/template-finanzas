import type { FuenteDatos } from "./provider";
import { fuenteLocal } from "./local";
import { fuenteSupabase } from "./supabase";

export type { FuenteDatos } from "./provider";

/**
 * ÚNICO punto de entrada de datos del dashboard.
 *
 * - Sin configurar nada → los movimientos se guardan en el navegador
 *   (localStorage, lib/data/local.ts). El dashboard arranca vacío.
 * - Con las variables de Supabase en .env.local → lee y escribe en tu
 *   tabla (lib/data/supabase.ts + supabase/schema.sql).
 * - ¿Otra base de datos o una API propia? Implementá la interfaz
 *   FuenteDatos (lib/data/provider.ts) y devolvela acá. Es lo único
 *   que hay que tocar: el resto del dashboard no sabe de dónde
 *   vienen los datos.
 */
export function getFuente(): FuenteDatos {
  const haySupabase =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return haySupabase ? fuenteSupabase : fuenteLocal;
}
