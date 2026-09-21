-- ============================================================
-- Limpia el evento sintético "test-concurrencia" (creado por
-- scripts/test-concurrencia.sql) y todas sus reservas/entradas de prueba.
-- No afecta al Bingo de Plantas 4.0 real (slug distinto).
-- ============================================================

delete from reservas
 where evento_id = (select id from eventos where slug = 'test-concurrencia');

delete from lista_espera
 where evento_id = (select id from eventos where slug = 'test-concurrencia');

delete from eventos
 where slug = 'test-concurrencia';

-- Verificación: ya no debería aparecer ninguna fila con este slug.
select slug, entradas_vendidas, capacidad_total
  from eventos
 where slug = 'test-concurrencia';
