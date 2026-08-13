-- Schema mínimo para el dashboard de finanzas.
-- Ejecutalo en el SQL Editor de tu proyecto de Supabase (o con `supabase db push`).

create table if not exists cuentas (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  moneda text not null default 'USD'
);

create table if not exists movimientos (
  id uuid primary key default gen_random_uuid(),
  fecha date not null default current_date,
  tipo text not null check (tipo in ('ingreso', 'egreso', 'transferencia')),
  descripcion text not null,
  categoria text not null default 'Otros',
  monto numeric not null check (monto > 0),
  moneda text not null default 'USD',
  cuenta text not null,
  creado_en timestamptz not null default now()
);

create index if not exists movimientos_fecha_idx on movimientos (fecha desc);

-- El dashboard solo lee. Con RLS activado, esta política permite lectura
-- con la clave anónima. Para cargar movimientos usá el panel de Supabase,
-- la service key desde un backend, o agregá políticas de escritura con auth.
alter table cuentas enable row level security;
alter table movimientos enable row level security;

create policy "lectura publica cuentas" on cuentas for select using (true);
create policy "lectura publica movimientos" on movimientos for select using (true);

-- Datos de arranque para ver el dashboard andando (borralos cuando cargues los tuyos).
insert into cuentas (nombre, moneda) values
  ('Banco USD', 'USD'),
  ('Banco Pesos', 'UYU');

insert into movimientos (fecha, tipo, descripcion, categoria, monto, moneda, cuenta) values
  (current_date - 2,  'ingreso', 'Cobro cliente ejemplo', 'Consultoría', 1500, 'USD', 'Banco USD'),
  (current_date - 5,  'egreso',  'Sueldo ejemplo',        'Sueldos',      800, 'USD', 'Banco USD'),
  (current_date - 8,  'egreso',  'Suscripción software',  'Software',     120, 'USD', 'Banco USD'),
  (current_date - 12, 'ingreso', 'Venta local',           'Ventas',     25000, 'UYU', 'Banco Pesos'),
  (current_date - 15, 'egreso',  'Impuestos',             'Impuestos',   9000, 'UYU', 'Banco Pesos');
