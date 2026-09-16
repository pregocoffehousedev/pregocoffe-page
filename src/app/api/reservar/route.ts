import { NextResponse } from 'next/server'
import { z } from 'zod'
import { supabaseAdmin } from '@/lib/supabase'
import { checkRateLimit, getIp } from '@/lib/ratelimit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const Body = z.object({
  eventoSlug: z.string().min(1).max(80),
  cantidad: z.number().int().min(1).max(10),
  nombre: z.string().trim().min(2).max(80),
  telefono: z.string().trim().min(8).max(20),
})

export async function POST(req: Request) {
  // 1) Rate limit por IP — frena bots y clics compulsivos
  const ip = getIp(req)
  const { success } = await checkRateLimit(ip)
  if (!success) {
    return NextResponse.json(
      { error: 'Demasiados intentos. Espera un minuto e inténtalo de nuevo.' },
      { status: 429 },
    )
  }

  // 2) Validación de entrada
  const parsed = Body.safeParse(await req.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: 'Datos inválidos.' }, { status: 400 })
  }
  const { eventoSlug, cantidad, nombre, telefono } = parsed.data

  const db = supabaseAdmin()

  // 3) Reserva ATÓMICA — aquí es imposible sobrevender.
  // Único método: transferencia. Sin checkout automático, 5 minutos para
  // pagar y avisar. El teléfono es el único dato de contacto: por ahí se
  // coordina el comprobante y se reenvían las entradas.
  const { data, error } = await db.rpc('reservar_entradas', {
    p_evento_slug: eventoSlug,
    p_cantidad: cantidad,
    p_nombre: nombre,
    p_telefono: telefono,
    p_ttl_minutos: 5,
  })

  if (error) {
    const msg = error.message || ''
    if (msg.includes('SIN_CUPO')) {
      return NextResponse.json(
        { error: 'Ya no quedan suficientes entradas disponibles.' },
        { status: 409 },
      )
    }
    if (msg.includes('VENTA_NO_ABIERTA')) {
      return NextResponse.json(
        { error: 'La venta de entradas aún no está abierta.' },
        { status: 403 },
      )
    }
    if (msg.includes('EXCEDE_MAX_POR_COMPRA')) {
      return NextResponse.json(
        { error: 'Superaste el máximo de entradas por compra.' },
        { status: 400 },
      )
    }
    if (msg.includes('EVENTO_NO_ENCONTRADO')) {
      return NextResponse.json({ error: 'Evento no disponible.' }, { status: 404 })
    }
    console.error('[reservar] rpc error', error)
    return NextResponse.json({ error: 'No pudimos procesar tu reserva.' }, { status: 500 })
  }

  const reserva = Array.isArray(data) ? data[0] : data
  if (!reserva?.reserva_id) {
    return NextResponse.json({ error: 'No pudimos procesar tu reserva.' }, { status: 500 })
  }

  // No hay checkout que iniciar. El comprador coordina por WhatsApp y el
  // equipo confirma el pago a mano desde el panel admin.
  return NextResponse.json({
    reservaId: reserva.reserva_id,
    expiraEn: reserva.expira_en,
    montoTotal: reserva.monto_total_clp,
    disponibles: reserva.disponibles,
  })
}
