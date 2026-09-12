import { NextResponse } from 'next/server'
import { z } from 'zod'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAdmin } from '@/lib/adminAuth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const Body = z.object({
  nombre: z.string().trim().min(2).max(80),
  telefono: z.string().trim().min(8).max(20),
  cantidad: z.number().int().min(1).max(20).optional(),
})

// Editar nombre/teléfono de una reserva; la cantidad solo se puede corregir
// si aún no está pagada (evita invalidar entradas ya generadas y enviadas).
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { id } = await params
  const parsed = Body.safeParse(await req.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: 'Datos inválidos.' }, { status: 400 })
  }
  const { nombre, telefono, cantidad } = parsed.data

  const { data, error } = await supabaseAdmin().rpc('editar_reserva_admin', {
    p_reserva_id: id,
    p_nombre: nombre,
    p_telefono: telefono,
    p_cantidad: cantidad ?? null,
  })

  if (error) {
    const msg = error.message || ''
    if (msg.includes('RESERVA_NO_ENCONTRADA')) {
      return NextResponse.json({ error: 'Reserva no encontrada.' }, { status: 404 })
    }
    if (msg.includes('NO_SE_PUEDE_CAMBIAR_CANTIDAD_PAGADA')) {
      return NextResponse.json(
        { error: 'No puedes cambiar la cantidad de una reserva ya pagada.' },
        { status: 400 },
      )
    }
    if (msg.includes('SIN_CUPO')) {
      return NextResponse.json({ error: 'No hay cupo suficiente para esa cantidad.' }, { status: 409 })
    }
    console.error('[admin/reservas/:id] PATCH error', error)
    return NextResponse.json({ error: 'No pudimos editar la reserva.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true, data })
}
