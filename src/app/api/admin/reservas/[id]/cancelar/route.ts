import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAdmin } from '@/lib/adminAuth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Cancela una reserva en cualquier estado (salvo ya cancelada), liberando
// el cupo y borrando las entradas emitidas si ya estaba pagada.
export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { id } = await params

  const { error } = await supabaseAdmin().rpc('cancelar_reserva_admin', {
    p_reserva_id: id,
  })

  if (error) {
    const msg = error.message || ''
    if (msg.includes('RESERVA_NO_ENCONTRADA')) {
      return NextResponse.json({ error: 'Reserva no encontrada.' }, { status: 404 })
    }
    console.error('[admin/reservas/:id/cancelar] error', error)
    return NextResponse.json({ error: 'No pudimos cancelar la reserva.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
