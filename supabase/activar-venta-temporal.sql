-- ============================================================
-- Activa la venta de entradas de inmediato (para testear el flujo
-- completo: reservar, transferir, confirmar pago, validar en la puerta).
-- Ejecutar en Supabase Studio > SQL Editor.
--
-- Cuando termines de probar, vuelve a poner la fecha real con:
--   update eventos set venta_abre_en = '2026-09-23 21:00:00-03'
--    where slug = 'plantitas-y-cafe-4';
-- ============================================================

update eventos
   set venta_abre_en = null
 where slug = 'plantitas-y-cafe-4';

-- Verificación.
select slug, venta_abre_en from eventos where slug = 'plantitas-y-cafe-4';
