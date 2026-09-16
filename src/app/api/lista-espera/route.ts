import { NextResponse } from 'next/server'
import { z } from 'zod'
import { supabaseAdmin } from '@/lib/supabase'
import { checkRateLimit, getIp } from '@/lib/ratelimit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const Body = z.object({
  eventoSlug: z.string().min(1).max(80),
  nombre: z.string().trim().min(2).max(80),
  telefono: z.string().trim().min(8).max(20),
})

// Cuando el evento está agotado, cualquiera puede dejar su nombre y
// WhatsApp aquí. El equipo la revisa en /admin/reservas → "Lista de
// espera" y avisa a mano si se libera un cupo.
export async function POST(req: Request) {
  const ip = getIp(req)
  const { success } = await checkRateLimit(ip)
  if (!success) {
    return NextResponse.json(
      { error: 'Demasiados intentos. Espera un minuto e inténtalo de nuevo.' },
      { status: 429 },
    )
  }

  const parsed = Body.safeParse(await req.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: 'Datos inválidos.' }, { status: 400 })
  }
  const { eventoSlug, nombre, telefono } = parsed.data

  const { data, error } = await supabaseAdmin().rpc('anotarse_lista_espera', {
    p_evento_slug: eventoSlug,
    p_nombre: nombre,
    p_telefono: telefono,
  })

  if (error) {
    const msg = error.message || ''
    if (msg.includes('EVENTO_NO_ENCONTRADO')) {
      return NextResponse.json({ error: 'Evento no disponible.' }, { status: 404 })
    }
    if (msg.includes('AUN_HAY_CUPO')) {
      return NextResponse.json(
        { error: 'Aún hay entradas disponibles, no necesitas anotarte.' },
        { status: 400 },
      )
    }
    console.error('[lista-espera] rpc error', error)
    return NextResponse.json({ error: 'No pudimos anotarte. Inténtalo de nuevo.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true, id: data })
}
