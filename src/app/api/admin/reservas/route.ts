import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAdmin } from '@/lib/adminAuth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const ESTADOS_VALIDOS = ['pendiente', 'pagada', 'expirada', 'cancelada'] as const
const SLUG_DEFAULT = process.env.NEXT_PUBLIC_EVENTO_SLUG || 'plantitas-y-cafe-4'

// Panel admin: lista TODAS las reservas (opcionalmente filtradas por estado
// y/o evento), junto con el cupo disponible del evento activo — para saber
// de un vistazo si aún queda espacio antes de confirmar pagos vencidos.
export async function GET(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const url = new URL(req.url)
  const estado = url.searchParams.get('estado')
  const eventoId = url.searchParams.get('eventoId')

  const db = supabaseAdmin()

  let query = db
    .from('reservas')
    .select(
      'id, evento_id, cantidad, monto_total_clp, comprador_nombre, comprador_telefono, estado, expira_en, pagada_en, creada_en, confirmada_por, eventos(nombre), entradas(codigo)',
    )
    .order('creada_en', { ascending: false })
    .limit(200)

  if (estado && (ESTADOS_VALIDOS as readonly string[]).includes(estado)) {
    query = query.eq('estado', estado)
  }
  if (eventoId) {
    query = query.eq('evento_id', eventoId)
  }

  const [{ data: reservas, error: errorReservas }, { data: evento, error: errorEvento }] =
    await Promise.all([
      query,
      db
        .from('eventos')
        .select('capacidad_total, entradas_vendidas')
        .eq('slug', SLUG_DEFAULT)
        .single(),
    ])

  if (errorReservas) {
    console.error('[admin/reservas] GET error', errorReservas)
    return NextResponse.json({ error: 'No pudimos cargar las reservas.' }, { status: 500 })
  }
  if (errorEvento) {
    console.error('[admin/reservas] evento', errorEvento)
  }

  return NextResponse.json({
    reservas: reservas ?? [],
    cupo: evento
      ? {
          capacidadTotal: evento.capacidad_total,
          entradasVendidas: evento.entradas_vendidas,
          disponibles: evento.capacidad_total - evento.entradas_vendidas,
        }
      : null,
  })
}
