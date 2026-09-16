-- ============================================================
-- Migración: agrega categoría (bingo / taller) a `eventos`
-- Ejecutar en Supabase Studio > SQL Editor, una sola vez.
--
-- Si ya habías corrido una versión anterior de esta migración que incluía
-- 'evento' como tercera categoría, este script la corrige: todo lo que
-- estuviera marcado como 'evento' pasa a 'bingo'.
-- ============================================================

do $$
begin
  if not exists (select 1 from pg_type where typname = 'categoria_evento') then
    create type categoria_evento as enum ('bingo', 'taller');
  end if;
end $$;

alter table eventos
  add column if not exists categoria categoria_evento;

-- Si el enum ya existía con 'evento' incluido, primero pasamos esas filas
-- a 'bingo' (como texto, para no depender de que el valor siga siendo válido).
do $$
begin
  if exists (
    select 1 from pg_enum
     where enumtypid = 'categoria_evento'::regtype
       and enumlabel = 'evento'
  ) then
    update eventos set categoria = 'bingo' where categoria::text = 'evento';

    -- Recrea el enum sin 'evento'.
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

-- El Bingo de Plantas ya existente queda marcado como "bingo".
update eventos set categoria = 'bingo' where slug = 'plantitas-y-cafe-4';
