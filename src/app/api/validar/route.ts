import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAdmin } from '@/lib/adminAuth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Panel de puerta: marca la entrada como usada (una sola vez).
export async function POST(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { codigo } = await req.json().catch(() => ({ codigo: '' }))
  if (!codigo || typeof codigo !== 'string') {
    return NextResponse.json({ error: 'Código requerido' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin().rpc('validar_entrada', {
    p_codigo: codigo,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const res = Array.isArray(data) ? data[0] : data
  return NextResponse.json(res)
}
