import { createClient } from '@supabase/supabase-js'
import { mockActivo, mockSupabaseClient } from './mock-db'

/**
 * Sin credenciales de Supabase configuradas, el sitio corre contra una
 * base de datos en memoria (ver mock-db.ts) en vez de fallar. Útil para
 * desarrollar el flujo de eventos/reservas sin depender de un proyecto
 * real de Supabase. Se activa solo si faltan las env vars — en producción,
 * con las credenciales puestas, esto nunca se usa.
 */

// Cliente admin — SOLO en el servidor. Nunca importar desde un componente cliente.
export function supabaseAdmin() {
  if (mockActivo()) {
    console.warn('[supabase] credenciales ausentes — usando base de datos mock en memoria')
    return mockSupabaseClient() as unknown as ReturnType<typeof createClient>
  }
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

// Cliente público — solo lee eventos activos (protegido por RLS).
export function supabasePublic() {
  if (mockActivo()) {
    return mockSupabaseClient() as unknown as ReturnType<typeof createClient>
  }
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  return createClient(url, key, { auth: { persistSession: false } })
}

export type CategoriaEvento = 'bingo' | 'taller'

export type Evento = {
  id: string
  slug: string
  nombre: string
  descripcion: string | null
  categoria: CategoriaEvento
  instructor: string | null
  instructor_instagram: string | null
  fecha: string
  venta_abre_en: string | null
  lugar: string
  precio_clp: number
  capacidad_total: number
  entradas_vendidas: number
  max_por_compra: number
  activo: boolean
}
