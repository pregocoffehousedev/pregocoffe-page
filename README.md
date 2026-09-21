# Prego Coffee — Venta de entradas para Bingo

Next.js 15 + Supabase + Mercado Pago. Diseñado para soportar cientos de
compradores simultáneos **sin sobrevender ni una sola entrada**.

## Cómo se garantiza que no haya sobreventa

Todo el control de stock ocurre dentro de Postgres, en una sola sentencia:

```sql
UPDATE eventos
   SET entradas_vendidas = entradas_vendidas + $1
 WHERE id = $2 AND entradas_vendidas + $1 <= capacidad_total
RETURNING entradas_vendidas;
```

Postgres serializa los `UPDATE` sobre la misma fila. Si 300 personas piden la
última entrada en el mismo milisegundo, exactamente una gana y el resto recibe
`SIN_CUPO`. Además la tabla tiene un `CHECK (entradas_vendidas <= capacidad_total)`
como red de seguridad: aunque hubiera un bug en el código, la base de datos
rechaza la operación.

## Puesta en marcha

```bash
npm install
cp .env.example .env.local     # completa las variables
npm run dev
```

### 1. Supabase
1. Crea un proyecto en [supabase.com](https://supabase.com).
2. SQL Editor → pega y ejecuta `supabase/schema.sql`.
3. Ejecuta `supabase/seed.sql` (ajusta fecha, precio y capacidad).
4. Copia las tres claves a `.env.local`.

### 2. Mercado Pago
1. Crea una aplicación en el [panel de desarrolladores](https://www.mercadopago.cl/developers/panel/app).
2. Copia el **Access Token** (usa el de prueba `TEST-...` primero).
3. Webhooks → URL: `https://tu-sitio.vercel.app/api/webhook/mercadopago`,
   evento **Pagos**. Copia la clave secreta a `MP_WEBHOOK_SECRET`.

### 3. Resend
1. Cuenta en [resend.com](https://resend.com), verifica tu dominio.
2. Copia la API key.

### 4. Deploy
```bash
vercel --prod
```
Carga todas las variables de entorno en Vercel. El cron de
`vercel.json` corre solo (requiere plan Pro; en Hobby usa
[cron-job.org](https://cron-job.org) apuntando a
`/api/cron/liberar-reservas` con el header `Authorization: Bearer $CRON_SECRET`).

## Flujo de compra

```
Usuario elige cantidad
      ↓
POST /api/reservar ──► rate limit (5/min por IP)
      ↓                validación Zod
      ↓                reserva ATÓMICA · estado "pendiente" · TTL 10 min
      ↓
Redirect a Mercado Pago Checkout Pro
      ↓
Usuario paga (nunca tocamos datos de tarjeta → sin alcance PCI)
      ↓
Webhook firmado ──► valida HMAC
      ↓              consulta el pago real en la API de MP
      ↓              confirmar_pago() idempotente (SELECT ... FOR UPDATE)
      ↓              genera N entradas con código único
      ↓              envía email con QR adjuntos
      ↓
Cron cada minuto ──► libera reservas vencidas al stock
```

## Decisiones de seguridad

| Riesgo | Mitigación |
|---|---|
| Sobreventa | UPDATE condicional atómico + CHECK constraint |
| Webhook falsificado | Validación HMAC `x-signature` con `timingSafeEqual` |
| Webhook duplicado | `confirmar_pago()` idempotente + `mp_payment_id UNIQUE` |
| Confirmación falsa desde el navegador | La venta solo se confirma vía webhook, nunca por `back_urls` |
| Bots / scripts | Rate limit 5 req/min por IP (Upstash) |
| Datos de tarjeta | Nunca pasan por nuestro servidor (Checkout Pro) |
| Acceso a la BD desde el cliente | RLS activo; `reservas` y `entradas` sin policies |
| Entrada reutilizada | `validar_entrada()` marca `usada` bajo lock de fila |
| Cron expuesto | Header `Authorization: Bearer $CRON_SECRET` |

## Pruebas antes del evento

**Flujo de reserva** (sin necesitar login):
```bash
npm run test:flujo
```

**Carga** (300 usuarios simultáneos, 2x lo esperado):
```bash
brew install k6
BASE_URL=https://tu-sitio.vercel.app k6 run scripts/loadtest.js
```

**Pago end-to-end**: usa las
[tarjetas de prueba de Mercado Pago](https://www.mercadopago.cl/developers/es/docs/checkout-pro/additional-content/test-cards)
con el token `TEST-...`.

## Panel de la puerta

`/admin/reservas` → pestaña "Validar entradas" — inicia sesión con una
cuenta de Google autorizada y escribe el código de la entrada. Cada
entrada se puede validar una sola vez.

## Notas de rendimiento

- `/evento` usa ISR (`revalidate = 30`): se sirve desde el CDN, así que 150
  personas recargando no golpean la base de datos.
- Solo `POST /api/reservar` toca Postgres, y es una única llamada RPC.
- Con 150–300 usuarios el cuello de botella no existe; el plan gratuito de
  Supabase y Vercel Hobby son suficientes.
