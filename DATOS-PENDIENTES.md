# Datos pendientes del sitio

Todo lo que ya se resolvió se sacó de este documento. Lo que queda abajo
es lo único pendiente antes o después del lanzamiento.

---

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
      `src/lib/adminAuth.ts` (hoy: `pregocoffehousedev@gmail.com`,
      `info@pregocoffeehouse.com` e `info@pregocoffeehouse.cl`).
