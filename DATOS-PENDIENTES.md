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

Sin ese DNS, el cliente que llena el formulario ve el mensaje "No pudimos
enviar tu solicitud. Escríbenos por WhatsApp." — no se pierde la solicitud
en silencio, pero tampoco llega por email.

- [ ] Cuando tengan acceso al DNS de `pregocoffeehouse.com` (dominio propio,
      no el de PedidosYa/Instagram), entrar a resend.com/domains, agregar el
      dominio y cargar los registros TXT/MX que Resend indique.

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
