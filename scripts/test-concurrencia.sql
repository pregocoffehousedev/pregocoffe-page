-- ============================================================
-- Prueba de sobreventa: 150 reservas simultáneas sobre 50 cupos
-- (mismo aforo real del Bingo de Plantas, 3x intentos de sobra).
-- Ejecutar en Supabase SQL Editor.
-- Resultado esperado: exactamente 50 éxitos, 100 con SIN_CUPO.
-- ============================================================

-- 1) Evento de prueba con 50 cupos (igual al Bingo de Plantas real)
insert into eventos (slug, nombre, fecha, lugar, precio_clp, capacidad_total)
values ('test-concurrencia', 'Test', now() + interval '30 days', 'Test', 1000, 50)
on conflict (slug) do update set entradas_vendidas = 0, capacidad_total = 50;

-- 2) Intentar 150 reservas de 1 entrada cada una
do $$
declare
  i integer;
  exitos integer := 0;
  fallos integer := 0;
begin
  for i in 1..150 loop
    begin
      perform reservar_entradas('test-concurrencia', 1,
        'Tester ' || i, '+5691234' || lpad(i::text, 4, '0'));
      exitos := exitos + 1;
    exception when others then
      fallos := fallos + 1;
    end;
  end loop;
  raise notice 'Éxitos: % (esperado 50) · Fallos: % (esperado 100)', exitos, fallos;
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
