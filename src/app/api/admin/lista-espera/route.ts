import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAdmin } from '@/lib/adminAuth'
import { obtenerBingoActivo } from '@/lib/bingoActivo'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Panel admin: lista quién se anotó en la lista de espera del evento
// activo, en orden de llegada (primero en anotarse, primero en la lista).
export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const db = supabaseAdmin()
  const evento = await obtenerBingoActivo()

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
