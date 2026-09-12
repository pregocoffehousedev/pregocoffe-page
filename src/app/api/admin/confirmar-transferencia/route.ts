import { NextResponse } from 'next/server'
import { z } from 'zod'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAdmin } from '@/lib/adminAuth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const Body = z.object({
  reservaId: z.string().uuid(),
})

// Panel admin: confirma a mano el pago por transferencia (tras revisar el
// comprobante recibido por WhatsApp) y genera los códigos de las entradas.
// El admin las reenvía por WhatsApp al mismo número desde el panel.
export async function POST(req: Request) {
  const admin = await requireAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const parsed = Body.safeParse(await req.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: 'Datos inválidos.' }, { status: 400 })
  }
  const { reservaId } = parsed.data

  const db = supabaseAdmin()

  const { data, error } = await db.rpc('confirmar_pago', {
    p_reserva_id: reservaId,
    p_confirmada_por: admin.email,
  })

  if (error) {
    const msg = error.message || ''
    if (msg.includes('RESERVA_NO_ENCONTRADA')) {
      return NextResponse.json({ error: 'Reserva no encontrada.' }, { status: 404 })
    }
    if (msg.includes('RESERVA_CANCELADA')) {
      return NextResponse.json({ error: 'Esta reserva fue cancelada.' }, { status: 400 })
    }
    if (msg.includes('SIN_CUPO_TRAS_EXPIRAR')) {
      return NextResponse.json(
        { error: 'La reserva expiró y ya no hay cupo disponible.' },
        { status: 409 },
      )
    }
    console.error('[confirmar-transferencia] rpc error', error)
    return NextResponse.json({ error: 'No pudimos confirmar el pago.' }, { status: 500 })
  }

  const res = Array.isArray(data) ? data[0] : data

  return NextResponse.json({
    ok: true,
    entradas: res?.cantidad,
    codigos: res?.codigos ?? [],
  })
}
