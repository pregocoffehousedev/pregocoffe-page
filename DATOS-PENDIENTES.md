# Preguntas para el cliente — datos pendientes del sitio

Checklist para completar antes de publicar. Todo lo marcado con ⚠️ en el código
usa datos de ejemplo (placeholder) que hay que reemplazar por los reales.

---

## 1. Datos del local (`src/data/local.ts`)

- [x] **Teléfono de WhatsApp** — +56 9 8164 6129.
- [x] **Email de contacto** — info@pregocoffeehouse.com.
- [x] **Link de PedidosYa** — ya cargado.
- [x] **Coordenadas exactas del local** — ya corregidas (-35.4270218, -71.6640935).
- [x] **Dirección y comuna** — 1 Sur 899, Talca, confirmado.
- [x] **Instagram** — @pregocoffeehouse, confirmado.

## 2. Horarios (`src/data/local.ts` → `HORARIOS`) ✅ COMPLETO

- [x] Horarios de verano confirmados: L-V 08:00–20:30, sáb 09:30–15:00, domingo cerrado.
- [x] Feriados: el sitio avisa que el horario puede variar y remite a Instagram (no se automatiza fecha por fecha).
- [ ] Horario de invierno: pendiente de recibir cuando corresponda actualizarlo.

## 3. Cuenta bancaria para transferencias (`src/data/local.ts` → `CUENTA_BANCARIA`) ✅ COMPLETO

Se muestra en el checkout de entradas del bingo (pago solo por transferencia).

- [x] **Banco**: Santander
- [x] **Tipo de cuenta**: Cuenta Corriente
- [x] **Número de cuenta**: 0-000-9485265-0
- [x] **Titular**: Comercial Ryc Limitada
- [x] **RUT del titular**: 77.943.242-4
- [x] **Email asociado a la transferencia**: info@pregocoffeehouse.com

## 4. Carta (`src/data/local.ts` → `CARTA`) ✅ COMPLETO

- [x] Carta real de otoño-invierno cargada: 15 categorías (Café, Infusiones, Mocktails, Bebidas frías, Bocatas, Sándwiches, Tostadas, Desayunos, Brunchealo, Ensaladas, Especialidades de la Nonna, Promo almuerzo, Waffles, Helados y postres, Pastelería), con los precios vigentes en Fudo.
- Nota técnica: los ítems con precio variable ("Según variedad", pastelería del día) muestran "Consultar" en vez de un monto.

## 5. Galería de fotos (`public/fotos/` + `src/data/local.ts` → `GALERIA`)

- [ ] Las 6 fotos actuales (brunch, matcha, cookies, interior, affogato, huevos) — ¿son las que quieren usar, o hay fotos más nuevas/mejores?
- [ ] ¿Quieren agregar o quitar alguna foto de la sección "Un vistazo"?

## 6. Logo (`public/logos/`)

- [ ] Confirmar que `prego-logo.png` (el que se usa en el Hero) es la versión final del logo.
- [ ] Hay un segundo archivo `logoprego-sinfondo.png` sin usar en el código — ¿es una versión alternativa que deberíamos usar en algún lugar?

## 7. Talleres del mes (`/admin/eventos`, categoría "Taller")

Los talleres reales se cargan como eventos desde el panel admin (`/admin/eventos` → categoría "Taller"), con su propio campo "Instructor" (equipo Prego o invitado). El array `TALLERES` de `src/data/local.ts` quedó vacío/obsoleto para este propósito.

- [ ] ¿Qué talleres reales se van a dictar este mes? Cargar cada uno desde `/admin/eventos`: nombre, descripción, instructor, fecha y hora, cupos, precio.

## 8. Reseñas (`src/data/local.ts` → `RESENAS`) ✅ COMPLETO

- [x] 5 reseñas reales de Google Maps cargadas (Joaquín Pavez, Pilar Cabello, Diego Cornejo Aburto, Anette Parra, Johann Blackaller), todas 5 estrellas.
- [x] Link "Ver todas las reseñas en Google Maps" agregado al final de la sección.

## 9. Instagram Feed

- [ ] ¿Quieren mostrar el feed real de Instagram en la web? Si sí, necesito que generen un token de Instagram Basic Display API (caduca cada 60 días, hay que renovarlo).
- [ ] Si no lo configuran, la sección simplemente no aparece — ¿está bien así por ahora?

## 10. Evento — Bingo de Plantas (`supabase/seed.sql`)

- [ ] **Nombre del evento** — ¿"Plantitas & Café — Bingo de Plantas 4.0" es el nombre definitivo?
- [ ] **Descripción** — confirmar el texto (ya ajustado para aclarar que café/dulce se compran aparte).
- [ ] **Fecha y hora exacta** del evento (actualmente 22 de septiembre, 18:00).
- [ ] **Lugar** — ¿se hace en el mismo local o en otro espacio?
- [ ] **Precio de la entrada** — confirmar $5.000 por persona.
- [ ] **Capacidad total** — confirmar 50 cupos.
- [ ] **Máximo de entradas por compra** — confirmar 6 por persona.
- [ ] ¿Qué incluye exactamente la entrada? (actualmente: cartón de bingo + premios en plantas — el café y lo dulce se compran aparte).
- [ ] ¿Cómo se entregan los premios en plantas? (esto es solo para que el equipo lo tenga claro, no afecta el código).

## 11. Coffee Break & Desayunos Corporativos (`src/components/ReservaEventos.tsx`) ✅ COMPLETO

- [x] Sección reescrita con el texto institucional real y los 4 servicios: Coffee Break Buffet, Mesas de Directorio, Cajas Corporativas de Desayunos, Barra de Café de Especialidad (sin barista).
- [x] Se eliminó "Arrienda el local": ya no se ofrece arriendo independiente del local. Solo quedan disponibles talleres/experiencias gastronómicas coordinadas previamente con Prego (sección Talleres).

## 12. Cuenta admin / seguridad

- [x] Acceso al panel (`/admin`) protegido con login de Google, restringido
      a `pregocoffehousedev@gmail.com` e `info@pregocoffeehouse.com`
      (whitelist en `src/lib/adminAuth.ts`).
- [ ] ¿Quién del equipo va a estar a cargo de confirmar los pagos por transferencia y validar entradas el día del evento (o antes)? Si hace falta dar acceso a alguien más, agregar su email a la whitelist.

## 13. Cotizaciones de Coffee Break corporativo

- [x] Destinatario confirmado: info@pregocoffeehouse.com (`EVENTOS_EMAIL` / `LOCAL.email`).
- [ ] ⚠️ **BLOQUEANTE**: el envío de correos (Resend) todavía no funciona en producción. Se configuró la API key, pero Resend solo permite enviar a `pregocoffehousedev@gmail.com` (la cuenta de registro) mientras el dominio `pregocoffeehouse.com` no esté verificado con registros DNS. Sin ese DNS, **las cotizaciones del formulario fallan** y el cliente ve "No pudimos enviar tu solicitud. Escríbenos por WhatsApp." — no se pierden en silencio, pero tampoco llegan por email.
- [ ] Para resolverlo: cuando tengan acceso al DNS de `pregocoffeehouse.com` (dominio propio, no solo el de PedidosYa/Instagram), hay que entrar a resend.com/domains, agregar el dominio, y cargar los registros TXT/MX que Resend indique en el proveedor de DNS. Avisar cuando esté listo para verificarlo.

---

### Nota técnica (no requiere respuesta del cliente)

Una vez resueltas estas preguntas, los cambios se aplican editando
`src/data/local.ts` (la mayoría de los datos) y `supabase/seed.sql` o
directamente la tabla `eventos` en Supabase (para el evento del bingo).
No es necesario tocar el resto del código.
