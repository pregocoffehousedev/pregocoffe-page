import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Corre cada minuto (vercel.json > crons).
 * Devuelve al stock los cupos de reservas que nadie pagó.
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET
  if (secret && req.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { data, error } = await supabaseAdmin().rpc('liberar_reservas_vencidas')
  if (error) {
    console.error('[cron] liberar', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ liberadas: data ?? 0 })
}
