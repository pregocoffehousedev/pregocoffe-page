-- ============================================================
-- Verificación: confirma que generar_codigo_entrada() sigue el
-- formato correcto (4 letras + 2 números, ej. ABCD12).
-- Ejecutar en Supabase Studio > SQL Editor.
-- ============================================================

-- 1) Prueba directa de la función: genera 5 códigos de ejemplo.
select generar_codigo_entrada() as ejemplo
from generate_series(1, 5);

-- 2) Revisa los códigos ya generados en entradas reales (si existen).
--    Deben verse todos como 4 letras + 2 números.
select codigo, length(codigo) as largo
  from entradas
 order by creada_en desc
 limit 20;

-- 3) Chequeo automático: cuenta cuántos códigos existentes NO cumplen
--    el patrón esperado (debería devolver 0 filas).
select codigo
  from entradas
 where codigo !~ '^[A-Z]{4}[0-9]{2}$';
