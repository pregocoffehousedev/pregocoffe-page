-- ============================================================
-- Nuevo taller: Taller de Pastas Frescas
-- Ejecutar en Supabase Studio > SQL Editor.
-- ============================================================

insert into eventos (
  slug, nombre, descripcion, categoria, instructor,
  fecha, lugar, precio_clp, capacidad_total, max_por_compra
)
values (
  'taller-pastas-frescas',
  'Taller de Pastas Frescas',
  'Aprende a preparar pasta fresca artesanal en una experiencia gastronómica práctica y entretenida. Elaborarás tres formas de pasta —fettuccine, farfalle y maltagliati—, trabajando la masa con uslero, sin necesidad de maquinaria. La experiencia incluye: elaboración de las tres formas de pasta fresca, tres salsas diferentes, aperitivos y picoteo, bebestibles sin alcohol, y un mini buffet de cositas dulces para finalizar la noche. Cupos limitados.',
  'taller',
  'Catalina Cerda · La Cata Chef',
  '2026-10-17 19:00:00-03',
  'Pregò Coffee House',
  29500,
  20,
  4
)
on conflict (slug) do nothing;

-- Verificación.
select slug, nombre, categoria, instructor, fecha, precio_clp, capacidad_total
  from eventos
 where slug = 'taller-pastas-frescas';
