-- ============================================================
-- Migración combinada: categoría (bingo/taller) + instructor
-- Ejecutar en Supabase Studio > SQL Editor, una sola vez.
-- Segura de correr aunque ya hayas aplicado alguna de las dos por separado.
-- ============================================================

-- ---------- categoría ----------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'categoria_evento') then
    create type categoria_evento as enum ('bingo', 'taller');
  end if;
end $$;

alter table eventos
  add column if not exists categoria categoria_evento;

do $$
begin
  if exists (
    select 1 from pg_enum
     where enumtypid = 'categoria_evento'::regtype
       and enumlabel = 'evento'
  ) then
    update eventos set categoria = 'bingo' where categoria::text = 'evento';
    alter table eventos alter column categoria type text;
    drop type categoria_evento;
    create type categoria_evento as enum ('bingo', 'taller');
    alter table eventos
      alter column categoria type categoria_evento using categoria::categoria_evento;
  end if;
end $$;

alter table eventos alter column categoria set default 'bingo';
update eventos set categoria = 'bingo' where categoria is null;
alter table eventos alter column categoria set not null;

update eventos set categoria = 'bingo' where slug = 'plantitas-y-cafe-4';

-- ---------- instructor ----------
alter table eventos
  add column if not exists instructor text;

-- ---------- verificación ----------
select column_name, data_type
  from information_schema.columns
 where table_name = 'eventos'
 order by ordinal_position;
