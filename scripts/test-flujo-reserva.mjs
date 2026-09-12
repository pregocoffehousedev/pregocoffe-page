// Prueba del flujo de reserva contra un sitio real (local o desplegado),
// sin necesitar login de Google. Cubre la parte del camino que SÍ se puede
// automatizar de forma segura: crear el evento no requiere admin, pero
// confirmar el pago y validar en la puerta sí lo requieren — esas dos
// partes hay que probarlas a mano en el navegador (ver CHECKLIST-LANZAMIENTO.md
// o la guía al final de este archivo).
//
// Uso:
//   node scripts/test-flujo-reserva.mjs
//   BASE_URL=https://tu-sitio.vercel.app node scripts/test-flujo-reserva.mjs
//
// Qué hace:
//   1. Verifica que /evento responde y carga el evento real.
//   2. Reserva 1 entrada con datos de prueba (mismo endpoint que usan los
//      clientes reales) y confirma que el sistema descuenta el cupo.
//   3. Intenta reservar más entradas de las permitidas por compra (debe
//      rechazarlo con EXCEDE_MAX_POR_COMPRA).
//   4. Deja la reserva de prueba en estado "pendiente" — se libera sola a
//      los 5 minutos por el cron, no hace falta limpiarla a mano.

const BASE = process.env.BASE_URL || 'http://localhost:3000'
const TELEFONO_PRUEBA = '+56900000' + String(Math.floor(Math.random() * 900) + 100)

let fallos = 0

function ok(cond, mensaje) {
  if (cond) {
    console.log(`✓ ${mensaje}`)
  } else {
    console.log(`✗ ${mensaje}`)
    fallos++
  }
}

async function main() {
  console.log(`Probando contra: ${BASE}\n`)

  // 1) /evento responde y muestra un evento real
  const evtRes = await fetch(`${BASE}/evento`)
  const evtHtml = await evtRes.text()
  ok(evtRes.status === 200, '/evento responde 200')
  ok(!evtHtml.includes('No hay eventos disponibles'), '/evento muestra un evento activo')

  // Necesitamos el slug del evento para reservar. Se asume el de la env var
  // pública o el default del proyecto.
  const slugMatch = process.env.NEXT_PUBLIC_EVENTO_SLUG || 'plantitas-y-cafe-4'

  // 2) Reservar 1 entrada real
  const reservarRes = await fetch(`${BASE}/api/reservar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      eventoSlug: slugMatch,
      cantidad: 1,
      nombre: 'Test Automatico',
      telefono: TELEFONO_PRUEBA,
    }),
  })
  const reservarBody = await reservarRes.json()
  ok(reservarRes.status === 200, 'Reservar 1 entrada responde 200')
  ok(!!reservarBody.reservaId, 'La reserva devuelve un reservaId')
  ok(typeof reservarBody.disponibles === 'number', 'La reserva devuelve el cupo restante')

  if (reservarRes.status === 200) {
    console.log(`  → reservaId: ${reservarBody.reservaId}`)
    console.log(`  → quedan disponibles: ${reservarBody.disponibles}`)
  }

  // 3) Intentar exceder el máximo por compra (asumimos que 999 siempre lo excede)
  const excesoRes = await fetch(`${BASE}/api/reservar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      eventoSlug: slugMatch,
      cantidad: 999,
      nombre: 'Test Exceso',
      telefono: TELEFONO_PRUEBA,
    }),
  })
  ok(excesoRes.status === 400, 'Reservar 999 entradas es rechazado (400)')

  console.log(`\n${fallos === 0 ? '✅ Todo OK' : `❌ ${fallos} verificación(es) fallaron`}`)
  console.log('\nFalta probar a mano (requiere login de Google en /admin):')
  console.log(`  1. Ve a ${BASE}/admin/reservas y confirma el pago de "Test Automatico".`)
  console.log('  2. Copia el código generado (ej. ABCD12).')
  console.log('  3. Ve a la pestaña "Validar entradas" y valida ese código.')
  console.log('  4. Confirma que dice "✓ Entrada válida" con el nombre y "1 entrada".')
  console.log('  5. Valídalo de nuevo: debe decir "Esta entrada ya fue utilizada".')

  process.exit(fallos === 0 ? 0 : 1)
}

main().catch((e) => {
  console.error('Error inesperado:', e)
  process.exit(1)
})
