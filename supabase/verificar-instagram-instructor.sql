-- Verificación: confirma que la columna quedó creada correctamente.
select column_name, data_type
  from information_schema.columns
 where table_name = 'eventos'
   and column_name = 'instructor_instagram';
