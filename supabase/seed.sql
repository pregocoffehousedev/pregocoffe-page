-- Evento real: Bingo de plantas, versión 4.0.
-- Ajusta fecha, precio y capacidad según corresponda.
insert into eventos (slug, nombre, descripcion, categoria, fecha, lugar, precio_clp, capacidad_total, max_por_compra)
values (
  'plantitas-y-cafe-4',
  'Plantitas & Café — Bingo de Plantas 4.0',
  '¡Vuelve Plantitas & Café! 🌿 Una nueva edición de nuestro Bingo de Plantas, una experiencia para disfrutar, compartir y participar por premios en plantas en el ambiente de Prego Coffee House. Los cupos son limitados para garantizar una experiencia cómoda para todos los participantes. Tu entrada incluye el cartón de bingo y la participación por los premios. El café y las preparaciones dulces pueden adquirirse por separado. ¡Reserva tu cupo y acompáñanos en una nueva edición de Plantitas & Café!',
  'bingo',
  '2026-09-26 18:00:00-03',
  'Prego Coffee House, 1 Sur 899, Talca',
  5000,
  50,
  6
)
on conflict (slug) do nothing;
