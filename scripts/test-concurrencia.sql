-- ============================================================
-- Prueba de sobreventa: 50 reservas simultáneas sobre 10 cupos.
-- Ejecutar en Supabase SQL Editor.
-- Resultado esperado: exactamente 10 éxitos, 40 con SIN_CUPO.
-- ============================================================

-- 1) Evento de prueba con solo 10 cupos
insert into eventos (slug, nombre, fecha, lugar, precio_clp, capacidad_total)
values ('test-concurrencia', 'Test', now() + interval '30 days', 'Test', 1000, 10)
on conflict (slug) do update set entradas_vendidas = 0, capacidad_total = 10;

-- 2) Intentar 50 reservas de 1 entrada cada una
do $$
declare
  i integer;
  exitos integer := 0;
  fallos integer := 0;
begin
  for i in 1..50 loop
    begin
      perform reservar_entradas('test-concurrencia', 1,
        'Tester ' || i, '+5691234' || lpad(i::text, 4, '0'));
      exitos := exitos + 1;
    exception when others then
      fallos := fallos + 1;
    end;
  end loop;
  raise notice 'Éxitos: % (esperado 10) · Fallos: % (esperado 40)', exitos, fallos;
end $$;

-- 3) Verificar el invariante
select
  capacidad_total,
  entradas_vendidas,
  case when entradas_vendidas <= capacidad_total
       then '✓ SIN SOBREVENTA'
       else '✗ FALLÓ' end as resultado
from eventos where slug = 'test-concurrencia';

-- 4) Limpiar
-- delete from reservas where evento_id = (select id from eventos where slug='test-concurrencia');
-- delete from eventos where slug = 'test-concurrencia';
