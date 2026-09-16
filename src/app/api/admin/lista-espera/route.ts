import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAdmin } from '@/lib/adminAuth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const SLUG_DEFAULT = process.env.NEXT_PUBLIC_EVENTO_SLUG || 'plantitas-y-cafe-4'

// Panel admin: lista quién se anotó en la lista de espera del evento
// activo, en orden de llegada (primero en anotarse, primero en la lista).
export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const db = supabaseAdmin()

  const { data: evento } = await db
    .from('eventos')
    .select('id')
    .eq('slug', SLUG_DEFAULT)
    .single()

  if (!evento) {
    return NextResponse.json({ listaEspera: [] })
  }

  const { data, error } = await db
    .from('lista_espera')
    .select('id, nombre, telefono, notificado, creada_en')
    .eq('evento_id', evento.id)
    .order('creada_en', { ascending: true })
    .limit(200)

  if (error) {
    console.error('[admin/lista-espera] GET error', error)
    return NextResponse.json({ error: 'No pudimos cargar la lista de espera.' }, { status: 500 })
  }

  return NextResponse.json({ listaEspera: data ?? [] })
}
