import { NextResponse } from 'next/server'
import { z } from 'zod'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAdmin } from '@/lib/adminAuth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const Body = z.object({
  nombre: z.string().trim().min(1).max(120).optional(),
  descripcion: z.string().trim().max(2000).optional().or(z.literal('')),
  fecha: z.string().min(1).optional(),
  lugar: z.string().trim().min(1).max(160).optional(),
  precio_clp: z.number().int().min(1).optional(),
  capacidad_total: z.number().int().min(1).optional(),
  max_por_compra: z.number().int().min(1).max(20).optional(),
  activo: z.boolean().optional(),
})

// Editar un evento existente. La capacidad no puede bajar de lo ya vendido.
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
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || 'Datos inválidos.' },
      { status: 400 },
    )
  }
  const cambios = parsed.data

  const db = supabaseAdmin()

  if (cambios.capacidad_total !== undefined) {
    const { data: actual } = await db
      .from('eventos')
      .select('entradas_vendidas')
      .eq('id', id)
      .single()

    if (actual && cambios.capacidad_total < actual.entradas_vendidas) {
      return NextResponse.json(
        {
          error: `La capacidad no puede ser menor a las ${actual.entradas_vendidas} entradas ya vendidas.`,
        },
        { status: 400 },
      )
    }
  }

  const { data, error } = await db
    .from('eventos')
    .update({
      ...cambios,
      descripcion: cambios.descripcion === '' ? null : cambios.descripcion,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('[admin/eventos/:id] PATCH error', error)
    return NextResponse.json({ error: 'No pudimos actualizar el evento.' }, { status: 500 })
  }

  return NextResponse.json({ evento: data })
}
