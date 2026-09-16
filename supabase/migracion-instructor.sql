-- ============================================================
-- Migración: agrega el campo "instructor" (quién imparte el taller) a `eventos`
-- Ejecutar en Supabase Studio > SQL Editor, una sola vez.
--
-- Requiere haber corrido antes supabase/migracion-categoria.sql.
-- ============================================================

alter table eventos
  add column if not exists instructor text;
