-- Evento real: Bingo de plantas, versión 4.0.
-- Ajusta fecha, precio y capacidad según corresponda.
insert into eventos (slug, nombre, descripcion, fecha, lugar, precio_clp, capacidad_total, max_por_compra)
values (
  'plantitas-y-cafe-4',
  'Plantitas & Café — Bingo de Plantas 4.0',
  'Una tarde de bingo con premios en plantas. Café de especialidad y pastelería disponibles para comprar aparte en el local. Cada cartón participa por suculentas, macetas y plantas de interior. ¡Cupos limitados!',
  '2026-09-22 18:00:00-03',
  'Pregò Coffee House',
  5000,
  50,
  6
)
on conflict (slug) do nothing;
