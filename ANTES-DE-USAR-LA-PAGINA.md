# Antes de usar la página — guía rápida para el equipo

## Acceso al panel de administración

El ícono de admin en el header **se quitó a propósito** para que los
clientes no lo vean navegando el sitio. La página `/admin` sigue
existiendo y funcionando igual que antes — solo que ya no hay un botón
visible que lleve ahí.

**Para entrar:** escribe manualmente `tudominio.com/admin` en el
navegador (reemplaza por tu dominio real una vez desplegado; en local es
`http://localhost:3000/admin`).

**Recomendación:** guarda esa URL como marcador/favorito en el
navegador de cada persona del equipo que administre el sitio. Así no
hay que escribirla de memoria cada vez, pero tampoco queda visible para
cualquiera que visite la web.

El acceso real sigue protegido por el login de Google — solo entran
`pregocoffehousedev@gmail.com` e `info@pregocoffeehouse.com` (o los
correos que se agreguen después en `src/lib/adminAuth.ts`). Quitar el
ícono del header es solo una capa extra de discreción, no reemplaza esa
protección.

## Otros documentos de referencia

- **`CHECKLIST-LANZAMIENTO.md`** — lo técnico que falta antes de publicar
  en serio (deploy, cron, variables de entorno).
- **`DATOS-PENDIENTES.md`** — preguntas y datos reales del negocio que
  faltan completar (teléfono, cuenta bancaria, carta, fotos, etc.).
