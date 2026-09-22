-- ============================================================
-- Prego Coffee — Bingo · Schema
-- Ejecutar en Supabase Studio > SQL Editor
-- ============================================================

create extension if not exists "pgcrypto";

-- ---------- EVENTOS ----------
create type categoria_evento as enum ('bingo', 'taller');

create table if not exists eventos (
  id                uuid primary key default gen_random_uuid(),
  slug              text unique not null,
  nombre            text not null,
  descripcion       text,
  categoria         categoria_evento not null default 'bingo',
  instructor        text,
  -- Usuario de Instagram del instructor (sin @), para que en talleres con
  -- instructor invitado el botón de inscripción vaya directo a su cuenta.
  instructor_instagram text,
  fecha             timestamptz not null,
  -- Si no es null, las entradas no se pueden comprar hasta esta fecha/hora
  -- (aunque el evento ya esté activo). NULL = venta abierta de inmediato.
  venta_abre_en     timestamptz,
  lugar             text not null,
  precio_clp        integer not null check (precio_clp > 0),
  capacidad_total   integer not null check (capacidad_total > 0),
  entradas_vendidas integer not null default 0 check (entradas_vendidas >= 0),
  max_por_compra    integer not null default 6 check (max_por_compra > 0),
  activo            boolean not null default true,
  -- Toggle manual (no automático): los talleres se inscriben por Instagram,
  -- sin paso por reservar_entradas, así que el equipo lo marca a mano.
  agotado           boolean not null default false,
  creado_en         timestamptz not null default now(),
  -- Invariante duro: la BD jamás permite sobreventa
  constraint no_sobreventa check (entradas_vendidas <= capacidad_total)
);

-- ---------- RESERVAS ----------
-- Único método de pago: transferencia. El equipo confirma a mano en
-- /admin/transferencias tras verificar el comprobante recibido por WhatsApp.
create type estado_reserva as enum ('pendiente', 'pagada', 'expirada', 'cancelada');

create table if not exists reservas (
  id                 uuid primary key default gen_random_uuid(),
  evento_id          uuid not null references eventos(id) on delete restrict,
  cantidad           integer not null check (cantidad > 0),
  monto_total_clp    integer not null check (monto_total_clp > 0),
  estado             estado_reserva not null default 'pendiente',
  comprador_nombre   text not null,
  -- Único dato de contacto: el admin confirma el comprobante y reenvía las
  -- entradas por WhatsApp a este mismo número.
  comprador_telefono text not null,
  -- Quién y cuándo confirmó el pago en el panel admin
  confirmada_por     text,
  expira_en          timestamptz not null,
  pagada_en          timestamptz,
  creada_en          timestamptz not null default now()
);

create index if not exists idx_reservas_expiracion
  on reservas (estado, expira_en) where estado = 'pendiente';
create index if not exists idx_reservas_telefono on reservas (comprador_telefono);

-- ---------- ENTRADAS (una fila por entrada, con su QR) ----------
create table if not exists entradas (
  id          uuid primary key default gen_random_uuid(),
  reserva_id  uuid not null references reservas(id) on delete cascade,
  evento_id   uuid not null references eventos(id) on delete restrict,
  codigo      text unique not null,        -- lo que va dentro del QR
  usada       boolean not null default false,
  usada_en    timestamptz,
  creada_en   timestamptz not null default now()
);

create index if not exists idx_entradas_reserva on entradas (reserva_id);
create index if not exists idx_entradas_codigo on entradas (codigo);

-- ---------- LISTA DE ESPERA ----------
-- Cuando un evento se agota, quien quiera puede dejar su nombre y
-- WhatsApp aquí. El equipo la revisa en /admin/reservas → "Lista de
-- espera" y avisa a mano si se libera un cupo (alguien cancela o no
-- confirma a tiempo).
create table if not exists lista_espera (
  id          uuid primary key default gen_random_uuid(),
  evento_id   uuid not null references eventos(id) on delete cascade,
  nombre      text not null,
  telefono    text not null,
  notificado  boolean not null default false,
  creada_en   timestamptz not null default now()
);

create index if not exists idx_lista_espera_evento
  on lista_espera (evento_id, creada_en);

-- ============================================================
-- RESERVA ATÓMICA
-- Un solo UPDATE condicional: Postgres serializa las filas
-- concurrentes, por lo que es imposible sobrevender aunque
-- entren 1000 personas en el mismo milisegundo.
-- ============================================================
create or replace function reservar_entradas(
  p_evento_slug text,
  p_cantidad    integer,
  p_nombre      text,
  p_telefono    text,
  p_ttl_minutos integer default 10
)
returns table (
  reserva_id      uuid,
  monto_total_clp integer,
  expira_en       timestamptz,
  disponibles     integer
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_evento      eventos%rowtype;
  v_nuevo_total integer;
  v_reserva_id  uuid;
  v_monto       integer;
  v_expira      timestamptz;
begin
  select * into v_evento from eventos
   where slug = p_evento_slug and activo = true;

  if not found then
    raise exception 'EVENTO_NO_ENCONTRADO' using errcode = 'P0002';
  end if;

  if v_evento.venta_abre_en is not null and now() < v_evento.venta_abre_en then
    raise exception 'VENTA_NO_ABIERTA' using errcode = 'P0001';
  end if;

  if p_cantidad > v_evento.max_por_compra then
    raise exception 'EXCEDE_MAX_POR_COMPRA' using errcode = 'P0001';
  end if;

  -- >>> El corazón del anti-overselling <<<
  update eventos
     set entradas_vendidas = entradas_vendidas + p_cantidad
   where id = v_evento.id
     and entradas_vendidas + p_cantidad <= capacidad_total
  returning entradas_vendidas into v_nuevo_total;

  if v_nuevo_total is null then
    raise exception 'SIN_CUPO' using errcode = 'P0001';
  end if;

  v_monto  := v_evento.precio_clp * p_cantidad;
  v_expira := now() + make_interval(mins => p_ttl_minutos);

  insert into reservas (
    evento_id, cantidad, monto_total_clp, comprador_nombre,
    comprador_telefono, expira_en
  ) values (
    v_evento.id, p_cantidad, v_monto, p_nombre,
    trim(p_telefono), v_expira
  ) returning id into v_reserva_id;

  return query select
    v_reserva_id,
    v_monto,
    v_expira,
    (v_evento.capacidad_total - v_nuevo_total);
end;
$$;

-- ============================================================
-- ANOTARSE EN LA LISTA DE ESPERA — solo si el evento realmente está
-- agotado (evita acumular anotados cuando aún queda cupo real).
-- ============================================================
create or replace function anotarse_lista_espera(
  p_evento_slug text,
  p_nombre      text,
  p_telefono    text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_evento eventos%rowtype;
  v_id     uuid;
begin
  select * into v_evento from eventos
   where slug = p_evento_slug and activo = true;

  if not found then
    raise exception 'EVENTO_NO_ENCONTRADO' using errcode = 'P0002';
  end if;

  if v_evento.entradas_vendidas < v_evento.capacidad_total then
    raise exception 'AUN_HAY_CUPO' using errcode = 'P0001';
  end if;

  insert into lista_espera (evento_id, nombre, telefono)
    values (v_evento.id, trim(p_nombre), trim(p_telefono))
  returning id into v_id;

  return v_id;
end;
$$;

-- ============================================================
-- GENERAR CÓDIGO DE ENTRADA: 4 letras + 2 números (ej. ABCD12).
-- Corto y fácil de teclear a mano en la puerta. ~45.7 millones de
-- combinaciones — de sobra para un evento de decenas/cientos de personas.
-- ============================================================
create or replace function generar_codigo_entrada()
returns text
language plpgsql
set search_path = public, extensions
as $$
declare
  letras   text := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  v_codigo text := '';
  i        integer;
begin
  for i in 1..4 loop
    v_codigo := v_codigo || substr(letras, 1 + floor(random() * 26)::integer, 1);
  end loop;
  v_codigo := v_codigo || lpad(floor(random() * 100)::text, 2, '0');
  return v_codigo;
end;
$$;

-- ============================================================
-- CONFIRMAR PAGO POR TRANSFERENCIA (disparado a mano por el admin
-- desde el panel, tras verificar el comprobante recibido por WhatsApp;
-- idempotente por si se hace doble clic)
-- ============================================================
create or replace function confirmar_pago(
  p_reserva_id     uuid,
  p_confirmada_por text
)
returns table (ya_procesada boolean, cantidad integer, codigos text[])
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_reserva  reservas%rowtype;
  v_codigos  text[] := '{}';
  v_codigo   text;
  i          integer;
begin
  -- Lock de fila: dos confirmaciones simultáneas se serializan aquí
  select * into v_reserva from reservas
   where id = p_reserva_id for update;

  if not found then
    raise exception 'RESERVA_NO_ENCONTRADA' using errcode = 'P0002';
  end if;

  if v_reserva.estado = 'pagada' then
    select array_agg(codigo) into v_codigos
      from entradas where reserva_id = p_reserva_id;
    return query select true, v_reserva.cantidad, coalesce(v_codigos, '{}');
    return;
  end if;

  if v_reserva.estado = 'expirada' then
    update eventos
       set entradas_vendidas = entradas_vendidas + v_reserva.cantidad
     where id = v_reserva.evento_id
       and entradas_vendidas + v_reserva.cantidad <= capacidad_total;
    if not found then
      raise exception 'SIN_CUPO_TRAS_EXPIRAR' using errcode = 'P0001';
    end if;
  elsif v_reserva.estado = 'cancelada' then
    raise exception 'RESERVA_CANCELADA' using errcode = 'P0001';
  end if;

  update reservas
     set estado = 'pagada',
         confirmada_por = p_confirmada_por,
         pagada_en = now()
   where id = p_reserva_id;

  for i in 1..v_reserva.cantidad loop
    loop
      v_codigo := generar_codigo_entrada();
      begin
        insert into entradas (reserva_id, evento_id, codigo)
          values (p_reserva_id, v_reserva.evento_id, v_codigo);
        exit; -- insert exitoso, código único: salir del loop de reintento
      exception when unique_violation then
        -- Colisión rarísima (mismo código ya existe): probar con otro
        continue;
      end;
    end loop;
    v_codigos := array_append(v_codigos, v_codigo);
  end loop;

  return query select false, v_reserva.cantidad, v_codigos;
end;
$$;

-- ============================================================
-- LIBERAR RESERVAS VENCIDAS (llamada por el cron cada minuto)
-- ============================================================
create or replace function liberar_reservas_vencidas()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_liberadas integer := 0;
  r           record;
begin
  for r in
    select id, evento_id, cantidad from reservas
     where estado = 'pendiente' and expira_en < now()
     for update skip locked
  loop
    update reservas set estado = 'expirada' where id = r.id;
    update eventos
       set entradas_vendidas = greatest(0, entradas_vendidas - r.cantidad)
     where id = r.evento_id;
    v_liberadas := v_liberadas + 1;
  end loop;
  return v_liberadas;
end;
$$;

-- ============================================================
-- VALIDAR ENTRADA EN LA PUERTA (marca usada, una sola vez)
-- ============================================================
create or replace function validar_entrada(p_codigo text)
returns table (
  valida    boolean,
  motivo    text,
  comprador text,
  usada_en  timestamptz,
  cantidad  integer
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_entrada entradas%rowtype;
  v_reserva reservas%rowtype;
begin
  select * into v_entrada from entradas
   where codigo = upper(trim(p_codigo)) for update;

  if not found then
    return query select false, 'CODIGO_INEXISTENTE'::text, null::text, null::timestamptz, null::integer;
    return;
  end if;

  select * into v_reserva from reservas where id = v_entrada.reserva_id;

  if v_entrada.usada then
    return query select false, 'YA_USADA'::text,
                        v_reserva.comprador_nombre, v_entrada.usada_en, v_reserva.cantidad;
    return;
  end if;

  update entradas set usada = true, usada_en = now() where id = v_entrada.id;

  return query select true, 'OK'::text, v_reserva.comprador_nombre, now(), v_reserva.cantidad;
end;
$$;

-- ============================================================
-- CANCELAR RESERVA (panel admin) — funciona en cualquier estado
-- salvo ya cancelada. Libera cupo y borra las entradas emitidas
-- si la reserva ya estaba pagada.
-- ============================================================
create or replace function cancelar_reserva_admin(p_reserva_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_reserva reservas%rowtype;
begin
  select * into v_reserva from reservas
   where id = p_reserva_id for update;

  if not found then
    raise exception 'RESERVA_NO_ENCONTRADA' using errcode = 'P0002';
  end if;

  if v_reserva.estado = 'cancelada' then
    return true;
  end if;

  if v_reserva.estado in ('pendiente', 'pagada') then
    update eventos
       set entradas_vendidas = greatest(0, entradas_vendidas - v_reserva.cantidad)
     where id = v_reserva.evento_id;
  end if;

  delete from entradas where reserva_id = p_reserva_id;

  update reservas set estado = 'cancelada' where id = p_reserva_id;

  return true;
end;
$$;

-- ============================================================
-- EDITAR RESERVA (panel admin) — corrige nombre/teléfono siempre;
-- la cantidad solo se puede corregir si aún no se pagó (para no
-- tener que invalidar entradas ya generadas y enviadas).
-- ============================================================
create or replace function editar_reserva_admin(
  p_reserva_id uuid,
  p_nombre     text,
  p_telefono   text,
  p_cantidad   integer default null
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_reserva  reservas%rowtype;
  v_evento   eventos%rowtype;
  v_delta    integer;
  v_monto    integer;
begin
  select * into v_reserva from reservas
   where id = p_reserva_id for update;

  if not found then
    raise exception 'RESERVA_NO_ENCONTRADA' using errcode = 'P0002';
  end if;

  if p_cantidad is not null and p_cantidad <> v_reserva.cantidad then
    if v_reserva.estado = 'pagada' then
      raise exception 'NO_SE_PUEDE_CAMBIAR_CANTIDAD_PAGADA' using errcode = 'P0001';
    end if;

    select * into v_evento from eventos where id = v_reserva.evento_id for update;
    v_delta := p_cantidad - v_reserva.cantidad;

    if v_reserva.estado = 'pendiente' then
      if v_evento.entradas_vendidas + v_delta > v_evento.capacidad_total then
        raise exception 'SIN_CUPO' using errcode = 'P0001';
      end if;
      update eventos
         set entradas_vendidas = greatest(0, entradas_vendidas + v_delta)
       where id = v_evento.id;
    end if;

    v_monto := v_evento.precio_clp * p_cantidad;

    update reservas
       set comprador_nombre = trim(p_nombre),
           comprador_telefono = trim(p_telefono),
           cantidad = p_cantidad,
           monto_total_clp = v_monto
     where id = p_reserva_id;
  else
    update reservas
       set comprador_nombre = trim(p_nombre),
           comprador_telefono = trim(p_telefono)
     where id = p_reserva_id;
  end if;

  return true;
end;
$$;

-- ============================================================
-- RLS: nada accesible desde el cliente. Todo pasa por el server.
-- ============================================================
alter table eventos      enable row level security;
alter table reservas     enable row level security;
alter table entradas     enable row level security;
alter table lista_espera enable row level security;

-- Solo lectura pública del evento (para la página del bingo)
create policy "evento publico" on eventos
  for select using (activo = true);

-- reservas/entradas/lista_espera: sin policies => solo service_role las toca
