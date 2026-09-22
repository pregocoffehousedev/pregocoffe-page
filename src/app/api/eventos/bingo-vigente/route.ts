import { NextResponse } from 'next/server'
import { supabasePublic } from '@/lib/supabase'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const SLUG_DEFAULT = process.env.NEXT_PUBLIC_EVENTO_SLUG || 'plantitas-y-cafe-4'

// Endpoint público y liviano: ¿hay un bingo activo cuya fecha aún no pasó?
// Lo consulta el header para decidir si mostrar el botón "Entradas" —
// evita mandar a un evento vencido cuando ya no queda nada que comprar.
export async function GET() {
  try {
    const { data } = await supabasePublic()
      .from('eventos')
      .select('fecha')
      .eq('slug', SLUG_DEFAULT)
      .eq('categoria', 'bingo')
      .eq('activo', true)
      .single<{ fecha: string }>()

    const vigente = Boolean(data && new Date(data.fecha).getTime() >= Date.now())
    return NextResponse.json({ vigente })
  } catch (e) {
    console.error('[eventos/bingo-vigente] error', e)
    return NextResponse.json({ vigente: false })
  }
}
