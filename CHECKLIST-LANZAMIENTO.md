# Checklist antes de lanzar

Estado al 2026-09-11. Todo lo marcado ⚠️ es necesario para que el sitio
funcione en producción; lo marcado 📋 es contenido/datos del negocio.

---

## ⚠️ Técnico — para que funcione en producción

### 1. Login con Google (bloqueante para usar `/admin`) ✅ COMPLETO
- [x] Credencial OAuth tipo "Web application" creada en Google Cloud Console.
- [x] Client ID y Client Secret conectados en Supabase → Authentication →
      Providers → Google.
- [x] Probado en vivo (2026-09-11): login exitoso con cuenta autorizada
      (`pregocoffehousedev@gmail.com`), y bloqueo confirmado con una cuenta
      de Google distinta (redirige a `/admin/login`, no deja entrar).
- [ ] Pendiente solo para cuando haya dominio de producción: agregar esa
      URL real a "Authorized JavaScript origins" en Google Cloud Console
      (ver paso 2 más abajo).

### 2. Desplegar en Vercel
- [ ] Conectar el repo a Vercel (o subirlo a GitHub primero si aún no está
      en un repositorio).
- [ ] Configurar TODAS las variables de entorno de `.env.local` en Vercel
      (Project Settings → Environment Variables). Especialmente:
  - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
        `SUPABASE_SERVICE_ROLE_KEY`
  - `CRON_SECRET` (mismo valor que en local o uno nuevo, a elección)
  - `NEXT_PUBLIC_SITE_URL` → cambiar a la URL real de producción
  - `RESEND_API_KEY`, `RESEND_FROM`, `EVENTOS_EMAIL` (para cotizaciones de
        eventos privados)
- [ ] Una vez desplegado, agregar la URL real de producción a "Authorized
      JavaScript origins" en Google Cloud Console (paso 1).

### 3. Cron de liberar reservas vencidas
- [ ] Crear cuenta en [cron-job.org](https://cron-job.org) (gratis).
- [ ] Configurar un cron cada 1 minuto hacia:
      `https://tu-dominio.vercel.app/api/cron/liberar-reservas`
  - Header: `Authorization: Bearer <mismo valor que CRON_SECRET>`
- [ ] Este mismo ping evita que Supabase pause el proyecto por
      inactividad (plan Free se pausa a los 7 días sin uso).

### 4. Seguridad
- [ ] Cambiar `ADMIN_TOKEN` — en realidad ya no se usa (reemplazado por
      Google Auth), pero revisar que no quede referenciado en ningún lugar
      antes de borrarlo del todo de las env vars.
- [ ] Confirmar que solo los 2 emails autorizados
      (`pregocoffehousedev@gmail.com`, `info@pregocoffeehouse.com`) están
      en la whitelist de `src/lib/adminAuth.ts` — agregar más si hace
      falta que alguien más del equipo entre al panel.

### 5. Base de datos
- [ ] Confirmar que no quedan datos de prueba en la tabla `reservas`
      (revisar `/admin/reservas` → filtro "Todas").
- [ ] Confirmar que el evento del bingo tiene los datos reales definitivos
      (ver sección 📋 más abajo).

### 6. Probar el flujo completo antes de anunciar el evento
Antes de compartir el link de compra públicamente, correr:
```bash
npm run test:flujo
# o contra producción ya desplegada:
BASE_URL=https://tu-sitio.vercel.app npm run test:flujo
```
Esto verifica automáticamente que `/evento` carga, que se puede reservar,
y que el límite de entradas por compra se respeta. Al final del script
aparece una checklist corta de 5 pasos para terminar de probar a mano en
el navegador (confirmar pago, validar código en la puerta) — esa parte
requiere login de Google y no se puede automatizar de forma segura.

Repetir esto cada vez que se toque el flujo de reservas/pagos, y de nuevo
justo antes del evento real como última verificación.

---

## 📋 Contenido — datos reales del negocio

Ver detalle completo con cada campo en **`DATOS-PENDIENTES.md`**. Resumen
de las secciones más importantes:

- [ ] Teléfono de WhatsApp real (hoy es un número de ejemplo)
- [ ] Email de contacto real
- [ ] Datos bancarios reales para transferencias (banco, cuenta, titular, RUT)
- [ ] Carta completa revisada (precios y productos actuales)
- [ ] Fotos de galería definitivas
- [ ] Talleres del mes (hoy hay 3 de ejemplo)
- [ ] Reseñas reales (hoy vacío — la sección no se muestra hasta agregar)
- [ ] Datos del evento Bingo de Plantas: fecha, precio, capacidad — ya
      cargados con valores reales ($5.000, 50 cupos, 22 sep 2026), pero
      confirmar que siguen siendo los definitivos antes de publicitar

---

## Cómo retomar

Cuando vuelvas a este proyecto, empieza por la sección **⚠️ Técnico**
en orden (1 → 2 → 3 → 4 → 5): el login de Google y el deploy son
requisito para que el resto tenga sentido. La sección 📋 se puede ir
completando en paralelo, sin bloquear el lanzamiento técnico.
