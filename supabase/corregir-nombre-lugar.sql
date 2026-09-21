-- ============================================================
-- Corrige el nombre del local en el campo "lugar" del evento
-- (de "Pregò Coffee House" a "Prego Coffee House", sin acento).
-- Ejecutar en Supabase Studio > SQL Editor.
-- ============================================================

update eventos
   set lugar = 'Prego Coffee House'
 where lugar = 'Pregò Coffee House';

-- Verificación.
select slug, lugar from eventos;
