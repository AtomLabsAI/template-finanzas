# 📊 Template — Dashboard de Finanzas

Dashboard de finanzas listo para usar: cloná el repo, arrancalo y empezá a cargar tus movimientos. **Arranca vacío y funciona sin configurar nada** — los datos se guardan en tu navegador; cuando quieras persistencia real conectás Supabase o tu propia base.

Incluye:

- **Carga de movimientos desde la UI**: formulario de alta (ingreso / egreso / transferencia), borrado por fila y borrado total
- **KPIs**: ingresos, egresos, resultado y egreso promedio mensual
- **Flujo mensual**: barras de ingresos vs. egresos
- **Egresos por categoría**: ranking con totales
- **Últimos movimientos**: tabla con fecha, descripción, categoría, cuenta y monto
- Filtros por **período** (3 / 6 / 12 meses) y por **moneda** (multi-moneda de nacimiento)
- **Datos de ejemplo opcionales**: un botón en el estado vacío por si querés ver el dashboard lleno antes de cargar lo tuyo
- Modo claro y oscuro automático, paleta validada para daltonismo

Stack: [Next.js](https://nextjs.org) · TypeScript · Tailwind CSS · [Recharts](https://recharts.org) · Supabase (opcional)

## 🚀 Arrancar

```bash
npm install
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000) y cargá tu primer movimiento. Sin configurar nada, los datos viven en el `localStorage` de tu navegador: perfecto para probar y para uso personal en una sola máquina.

## 🔌 Conectar una base de datos de verdad

### Opción A — Supabase (5 minutos)

1. Creá un proyecto en [supabase.com](https://supabase.com).
2. En el **SQL Editor**, pegá y ejecutá el contenido de [`supabase/schema.sql`](supabase/schema.sql). Crea la tabla `movimientos` (vacía).
3. Copiá `.env.example` a `.env.local` y completá con los valores de **Project Settings → API**:

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   ```

4. Reiniciá `npm run dev`. Listo: todo lo que cargues desde el dashboard va a tu Supabase.

> ⚠️ El schema incluido permite leer y escribir con la clave anónima para que funcione sin configurar autenticación (uso personal/interno). Si lo vas a exponer públicamente, agregá Supabase Auth y ajustá las políticas RLS — está señalado en el propio `schema.sql`.

### Opción B — Cualquier otra base o API

Todo el dashboard consume datos desde **un solo lugar**: [`lib/data/index.ts`](lib/data/index.ts). Implementá la interfaz `FuenteDatos` ([`lib/data/provider.ts`](lib/data/provider.ts)) — cinco métodos: listar, crear, crear en lote, eliminar, borrar todo — contra tu Postgres, MySQL, Google Sheets o API propia, y devolvela desde `getFuente()`. Nada más del código sabe de dónde vienen los datos.

```ts
// lib/types.ts — el dato central de todo el sistema
interface Movimiento {
  id: string;
  fecha: string; // "2026-08-13"
  tipo: "ingreso" | "egreso" | "transferencia";
  descripcion: string;
  categoria: string;
  monto: number; // siempre positivo, el signo lo da el tipo
  moneda: string; // "USD", "UYU", ...
  cuenta: string;
}
```

## 🗂️ Estructura

```
app/
  page.tsx            → página del dashboard
  globals.css         → tokens de diseño: colores, modo oscuro, marca
components/
  Dashboard.tsx       → layout, filtros, estado vacío y acciones
  MovimientoForm.tsx  → modal de alta de movimientos
  KpiCard.tsx         → tarjeta de indicador
  FlujoChart.tsx      → barras mensuales ingresos vs. egresos
  CategoriasChart.tsx → egresos por categoría
  MovimientosTable.tsx→ tabla de movimientos (con borrado)
lib/
  types.ts            → el contrato de datos (Movimiento)
  data/provider.ts    → la interfaz FuenteDatos
  data/local.ts       → fuente por defecto (localStorage)
  data/supabase.ts    → fuente Supabase
  data/demo.ts        → datos de ejemplo opcionales (botón en estado vacío)
  data/index.ts       → getFuente(): decide qué fuente usar
  metrics.ts          → cálculo de KPIs, flujo mensual y categorías
  format.ts           → formato de montos y fechas (cambiá el locale acá)
supabase/
  schema.sql          → tabla + índices + políticas RLS
```

## 🎨 Personalizar

- **Colores / marca**: todos los tokens están en [`app/globals.css`](app/globals.css) (claro y oscuro). Los gráficos los toman por variable CSS, no hay hex sueltos en los componentes.
- **Idioma / locale de números**: `LOCALE` en [`lib/format.ts`](lib/format.ts).
- **Categorías y monedas sugeridas** en el formulario: constantes al inicio de [`components/Dashboard.tsx`](components/Dashboard.tsx).
- **Métricas nuevas**: agregá funciones en [`lib/metrics.ts`](lib/metrics.ts) y tarjetas/gráficos en `components/`.
- **Sin datos de ejemplo**: borrá `lib/data/demo.ts` y el botón "Cargar datos de ejemplo" en `Dashboard.tsx`.

## ☁️ Deploy

Funciona directo en [Vercel](https://vercel.com/new): importá el repo y cargá las dos variables de entorno (si usás Supabase). Sin variables, cada visitante guarda sus datos en su propio navegador.

---

Hecho por [Atom](mailto:atomn8n@gmail.com) 🚀 — si querés que armemos tu sistema de finanzas a medida, escribinos.
