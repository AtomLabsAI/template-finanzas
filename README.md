# 📊 Template — Dashboard de Finanzas

Dashboard de finanzas listo para usar: cloná el repo, conectá tu base de datos y en minutos tenés tu tablero andando. **Funciona de una con datos de ejemplo**, sin configurar nada.

Incluye:

- **KPIs**: ingresos, egresos, resultado y egreso promedio mensual
- **Flujo mensual**: barras de ingresos vs. egresos
- **Egresos por categoría**: ranking con totales
- **Últimos movimientos**: tabla con fecha, descripción, categoría, cuenta y monto
- Filtros por **período** (3 / 6 / 12 meses) y por **moneda** (multi-moneda de nacimiento)
- Modo claro y oscuro automático, paleta validada para daltonismo

Stack: [Next.js](https://nextjs.org) · TypeScript · Tailwind CSS · [Recharts](https://recharts.org) · Supabase (opcional)

## 🚀 Arrancar

```bash
npm install
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000) y ya ves el dashboard con datos de ejemplo.

## 🔌 Conectar tu base de datos

### Opción A — Supabase (5 minutos)

1. Creá un proyecto en [supabase.com](https://supabase.com).
2. En el **SQL Editor**, pegá y ejecutá el contenido de [`supabase/schema.sql`](supabase/schema.sql). Eso crea las tablas `movimientos` y `cuentas` con algunos datos de arranque.
3. Copiá `.env.example` a `.env.local` y completá con los valores de **Project Settings → API**:

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   ```

4. Reiniciá `npm run dev`. Listo: el dashboard ahora lee de tu Supabase.

### Opción B — Cualquier otra base o API

Todo el dashboard consume datos desde **un solo lugar**: [`lib/data/index.ts`](lib/data/index.ts). Escribí una función que devuelva `DatosFinanzas` (ver [`lib/types.ts`](lib/types.ts)) leyendo de tu Postgres, MySQL, Google Sheets, API propia o lo que uses, y llamala ahí. Nada más del código sabe de dónde vienen los datos.

```ts
// lib/types.ts — esto es lo único que tu fuente tiene que devolver
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
  page.tsx            → página del dashboard (server component, trae los datos)
  globals.css         → tokens de diseño: colores, modo oscuro, marca
components/
  Dashboard.tsx       → layout general + filtros de período y moneda
  KpiCard.tsx         → tarjeta de indicador
  FlujoChart.tsx      → barras mensuales ingresos vs. egresos
  CategoriasChart.tsx → egresos por categoría
  MovimientosTable.tsx→ tabla de movimientos
lib/
  types.ts            → el contrato de datos (Movimiento, Cuenta)
  data/               → capa de datos: mock, Supabase, o la tuya
  metrics.ts          → cálculo de KPIs, flujo mensual y categorías
  format.ts           → formato de montos y fechas (cambiá el locale acá)
supabase/
  schema.sql          → tablas + políticas + datos de arranque
```

## 🎨 Personalizar

- **Colores / marca**: todos los tokens están en [`app/globals.css`](app/globals.css) (claro y oscuro). Los gráficos los toman por variable CSS, no hay hex sueltos en los componentes.
- **Idioma / locale de números**: `LOCALE` en [`lib/format.ts`](lib/format.ts).
- **Métricas nuevas**: agregá funciones en [`lib/metrics.ts`](lib/metrics.ts) y tarjetas/gráficos en `components/`.

## ☁️ Deploy

Funciona directo en [Vercel](https://vercel.com/new): importá el repo y cargá las dos variables de entorno (si usás Supabase). Sin variables, deploya con los datos de ejemplo — útil como demo.

---

Hecho por [Atom](mailto:atomn8n@gmail.com) 🚀 — si querés que armemos tu sistema de finanzas a medida, escribinos.
