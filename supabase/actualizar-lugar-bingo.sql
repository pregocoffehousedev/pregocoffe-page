-- ============================================================
-- Actualiza el lugar del Bingo de Plantas 4.0 con la dirección completa.
-- Ejecutar en Supabase Studio > SQL Editor.
-- ============================================================

update eventos
   set lugar = 'Prego Coffee House, 1 Sur 899, Talca'
 where slug = 'plantitas-y-cafe-4';

-- Verificación.
select slug, fecha, lugar from eventos where slug = 'plantitas-y-cafe-4';
