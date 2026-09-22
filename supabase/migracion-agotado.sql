-- ============================================================
-- Migración: agrega "agotado" a `eventos`
-- Ejecutar en Supabase Studio > SQL Editor, una sola vez.
-- ============================================================

-- Toggle manual: los talleres se inscriben por Instagram (no pasan por
-- reservar_entradas), así que no hay conteo automático de cupos. El
-- equipo marca "agotado" a mano cuando deja de haber cupo.
alter table eventos
  add column if not exists agotado boolean not null default false;
