# Datos pendientes del sitio

Todo lo que ya se resolvió se sacó de este documento. Lo que queda abajo
es lo único pendiente antes o después del lanzamiento.

---

## ⚠️ Bloqueante: correos de cotización (Coffee Break)

El formulario de cotización de Coffee Break (`src/components/ReservaEventos.tsx`)
ya está configurado para enviar a `info@pregocoffeehouse.com`, pero **el envío
todavía no funciona en producción**: Resend solo permite enviar correos a la
cuenta con la que se registró la API key (`pregocoffehousedev@gmail.com`)
mientras el dominio `pregocoffeehouse.com` no esté verificado con registros DNS.

Sin eso, el cliente que llena el formulario ve el mensaje "No pudimos enviar
tu solicitud. Escríbenos por WhatsApp." — no se pierde la solicitud en
silencio, pero tampoco llega por email.

**Causa raíz (22-09-2026):** el dominio `pregocoffeehouse.com` todavía no
está comprado. Hoy el sitio corre en `pregocoffe-page.vercel.app` (subdominio
gratuito de Vercel). Decisión: esperar a comprar el dominio real antes de
verificar nada en Resend, para no configurar DNS dos veces.

**Pasos para cuando compren el dominio:**
1. Comprar `pregocoffeehouse.com` en un registrador (NIC Chile, GoDaddy, etc.).
2. En [resend.com/domains](https://resend.com/domains) → Add Domain → escribir
   `pregocoffeehouse.com`. Resend entrega registros TXT (SPF/DKIM) y a veces MX.
3. Cargar esos registros exactos en el panel de DNS del registrador del dominio.
4. Esperar a que Resend marque el dominio como verificado (puede tardar minutos
   a horas según el proveedor).
5. Actualizar `RESEND_FROM` en las variables de entorno (local y Vercel) de
   `Prego Coffee House <onboarding@resend.dev>` a algo como
   `Prego Coffee House <no-responder@pregocoffeehouse.com>`.
6. Si además apuntan el dominio propio al sitio (en vez de solo usarlo para
   correo), actualizar también `NEXT_PUBLIC_SITE_URL` y los "Authorized
   JavaScript origins" de Google Cloud Console para el login admin.

## Horario de invierno

- [ ] El sitio muestra el horario de verano vigente. Falta el horario de
      invierno para cuando corresponda actualizarlo (`src/data/local.ts` → `HORARIOS`).

## Logo del Hero

- [ ] Confirmar que `public/logos/prego-logo.png` (usado en el Hero de la
      home) es la versión final del logo.

## Acceso al panel admin

- [ ] ¿Quién del equipo va a estar a cargo de confirmar pagos por
      transferencia y validar entradas el día del evento? Si hace falta dar
      acceso a alguien más, agregar su email a la whitelist en
      `src/lib/adminAuth.ts` (hoy: `pregocoffehousedev@gmail.com` e
      `info@pregocoffeehouse.com`).
