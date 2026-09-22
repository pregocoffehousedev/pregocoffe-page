-- ============================================================
-- Agrega el usuario de Instagram del instructor a `eventos`.
-- Ejecutar en Supabase Studio > SQL Editor.
-- ============================================================

alter table eventos
  add column if not exists instructor_instagram text;
