-- ============================================================
-- Migración: agrega "venta_abre_en" a `eventos` + bloqueo en reservar_entradas
-- Ejecutar en Supabase Studio > SQL Editor, una sola vez.
-- ============================================================

alter table eventos
  add column if not exists venta_abre_en timestamptz;

-- Bingo de Plantas 4.0: entradas a la venta el miércoles 23 de septiembre
-- de 2026, 21:00 hora Chile.
update eventos
   set venta_abre_en = '2026-09-23 21:00:00-03'
 where slug = 'plantitas-y-cafe-4';

-- Reemplaza reservar_entradas para que rechace compras antes de venta_abre_en.
create or replace function reservar_entradas(
  p_evento_slug text,
  p_cantidad    integer,
  p_nombre      text,
  p_telefono    text,
  p_ttl_minutos integer default 5
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
