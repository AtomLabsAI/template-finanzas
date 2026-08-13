-- Schema mínimo para el dashboard de finanzas.
-- Ejecutalo en el SQL Editor de tu proyecto de Supabase (o con `supabase db push`).
-- La tabla arranca vacía: los movimientos se cargan desde el dashboard.

create table if not exists movimientos (
  id uuid primary key default gen_random_uuid(),
  fecha date not null default current_date,
  tipo text not null check (tipo in ('ingreso', 'egreso', 'transferencia')),
  descripcion text not null,
  categoria text not null default 'Otros',
  monto numeric not null check (monto > 0),
  moneda text not null default 'USD',
  cuenta text not null default 'Principal',
  creado_en timestamptz not null default now()
);

create index if not exists movimientos_fecha_idx on movimientos (fecha desc);

-- ⚠️ ATENCIÓN: estas políticas permiten leer Y escribir con la clave anónima,
-- para que el dashboard funcione sin configurar autenticación. Sirve para uso
-- personal o interno. Si la app va a estar expuesta públicamente, agregá
-- Supabase Auth y reemplazá `true` por una condición sobre auth.uid().
alter table movimientos enable row level security;

create policy "lectura publica" on movimientos for select using (true);
create policy "alta publica" on movimientos for insert with check (true);
create policy "borrado publico" on movimientos for delete using (true);
