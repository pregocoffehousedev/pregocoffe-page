-- ============================================================
-- Actualiza la descripción del Bingo de Plantas 4.0 con el texto
-- real definitivo para la web.
-- Ejecutar en Supabase Studio > SQL Editor.
-- ============================================================

update eventos
   set descripcion = '¡Vuelve Plantitas & Café! 🌿 Una nueva edición de nuestro Bingo de Plantas, una experiencia para disfrutar, compartir y participar por premios en plantas en el ambiente de Prego Coffee House. Los cupos son limitados para garantizar una experiencia cómoda para todos los participantes. Tu entrada incluye el cartón de bingo y la participación por los premios. El café y las preparaciones dulces pueden adquirirse por separado. ¡Reserva tu cupo y acompáñanos en una nueva edición de Plantitas & Café!'
 where slug = 'plantitas-y-cafe-4';

-- Verificación.
select slug, descripcion from eventos where slug = 'plantitas-y-cafe-4';
