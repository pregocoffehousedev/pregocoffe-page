import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAdmin } from '@/lib/adminAuth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Marca a alguien de la lista de espera como ya notificado (el admin ya
// le avisó por WhatsApp que se liberó un cupo).
export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { id } = await params

  const { error } = await supabaseAdmin()
    .from('lista_espera')
    .update({ notificado: true })
    .eq('id', id)

  if (error) {
    console.error('[admin/lista-espera/:id/notificado] error', error)
    return NextResponse.json({ error: 'No pudimos actualizar el registro.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
