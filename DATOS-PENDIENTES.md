# Preguntas para el cliente — datos pendientes del sitio

Checklist para completar antes de publicar. Todo lo marcado con ⚠️ en el código
usa datos de ejemplo (placeholder) que hay que reemplazar por los reales.

---

## 1. Datos del local (`src/data/local.ts`)

- [ ] **Teléfono de WhatsApp** — número real en formato internacional (ej. `+56912345678`), el que van a usar para recibir comprobantes de transferencia y coordinar pedidos.
- [ ] **Email de contacto** — el que aparece en el pie de página y recibe las cotizaciones de eventos privados.
- [ ] **Link de PedidosYa** — el del perfil real del local (Perfil → Compartir).
- [ ] **Coordenadas exactas del local** — para que el mapa apunte al punto correcto (Google Maps → clic derecho sobre el local → copiar coordenadas). Actualmente apunta al centro de Talca.
- [ ] **Dirección y comuna** — ¿"1 Sur 899, Talca" es correcto, o cambió?
- [ ] **Instagram** — ¿el usuario `pregocoffeehouse` es el real?

## 2. Horarios (`src/data/local.ts` → `HORARIOS`)

- [ ] ¿Son correctos los horarios actuales (L-V 08:00–19:30, sáb 09:30–15:30, domingo cerrado)?
- [ ] ¿Hay excepciones (feriados, horario de verano, etc.) que debamos contemplar?

## 3. Cuenta bancaria para transferencias (`src/data/local.ts` → `CUENTA_BANCARIA`)

Se muestra en el checkout de entradas del bingo (pago solo por transferencia).

- [ ] **Banco**
- [ ] **Tipo de cuenta** (Cuenta RUT / Corriente / Vista)
- [ ] **Número de cuenta**
- [ ] **Titular** (nombre exacto como aparece en el banco)
- [ ] **RUT del titular**
- [ ] **Email asociado a la transferencia** (para comprobantes)

## 4. Carta (`src/data/local.ts` → `CARTA`)

- [ ] ¿Los productos y precios de café, "sin café", panadería/pastelería y cocina son los actuales?
- [ ] ¿Falta algún producto o hay alguno que ya no se vende?
- [ ] ¿Los precios están al día? (revisar los 4 grupos completos, hay ~27 ítems cargados como ejemplo/borrador)

## 5. Galería de fotos (`public/fotos/` + `src/data/local.ts` → `GALERIA`)

- [ ] Las 6 fotos actuales (brunch, matcha, cookies, interior, affogato, huevos) — ¿son las que quieren usar, o hay fotos más nuevas/mejores?
- [ ] ¿Quieren agregar o quitar alguna foto de la sección "Un vistazo"?

## 6. Logo (`public/logos/`)

- [ ] Confirmar que `prego-logo.png` (el que se usa en el Hero) es la versión final del logo.
- [ ] Hay un segundo archivo `logoprego-sinfondo.png` sin usar en el código — ¿es una versión alternativa que deberíamos usar en algún lugar?

## 7. Talleres del mes (`src/data/local.ts` → `TALLERES`)

Actualmente hay 3 talleres de ejemplo cargados (cata de café, latte art, masa madre).

- [ ] ¿Qué talleres reales se van a dictar este mes?
- [ ] Para cada uno: nombre, descripción corta, fecha y hora, instructor (¿del equipo Prego o invitado externo?), cupos disponibles, precio.
- [ ] Si no hay talleres confirmados aún, ¿dejamos la sección vacía (no se muestra) hasta tenerlos?

## 8. Reseñas (`src/data/local.ts` → `RESENAS`)

Actualmente vacío — la sección no se muestra hasta que se agreguen reseñas reales.

- [ ] ¿Tienen reseñas reales en Google Maps o Instagram que quieran destacar?
- [ ] Si es así: texto exacto (copiado tal cual), nombre público de quien la escribió, calificación en estrellas, y de dónde viene (Google/Instagram).
- [ ] **Importante:** no se pueden inventar reseñas — hay que usar testimonios reales y textuales (por tema legal, Ley del Consumidor).

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

## 11. Coffee Break / Prego a Eventos (`src/components/ReservaEventos.tsx`)

- [ ] Confirmar el texto de la modalidad "Llevar café a tu evento": barra de café con barista, pastelería, montaje/desmontaje — ¿es correcto o falta/sobra algo?
- [ ] Para "Arrienda el local": ¿la capacidad de "hasta 60 personas de pie" sigue siendo correcta?

## 12. Cuenta admin / seguridad

- [x] Acceso al panel (`/admin`) protegido con login de Google, restringido
      a `pregocoffehousedev@gmail.com` e `info@pregocoffeehouse.com`
      (whitelist en `src/lib/adminAuth.ts`).
- [ ] ¿Quién del equipo va a estar a cargo de confirmar los pagos por transferencia y validar entradas el día del evento (o antes)? Si hace falta dar acceso a alguien más, agregar su email a la whitelist.

## 13. Cotizaciones de eventos privados

- [ ] Confirmar el **email que debe recibir las solicitudes** del formulario "Arrienda el local" / Coffee Break (actualmente cae al email de contacto general si no se configura uno aparte).

---

### Nota técnica (no requiere respuesta del cliente)

Una vez resueltas estas preguntas, los cambios se aplican editando
`src/data/local.ts` (la mayoría de los datos) y `supabase/seed.sql` o
directamente la tabla `eventos` en Supabase (para el evento del bingo).
No es necesario tocar el resto del código.
