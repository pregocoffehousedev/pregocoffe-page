import { NextResponse } from 'next/server'
import { z } from 'zod'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAdmin } from '@/lib/adminAuth'
import { normalizarInstagram } from '@/lib/format'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const Body = z.object({
  nombre: z.string().trim().min(1).max(120).optional(),
  descripcion: z.string().trim().max(2000).optional().or(z.literal('')),
  categoria: z.enum(['bingo', 'taller']).optional(),
  instructor: z.string().trim().max(120).optional().or(z.literal('')),
  instructorInstagram: z.string().trim().max(60).optional().or(z.literal('')),
  fecha: z.string().min(1).optional(),
  ventaAbreEn: z.string().min(1).nullable().optional(),
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

  const { ventaAbreEn, instructorInstagram, ...resto } = cambios

  const { data, error } = await db
    .from('eventos')
    .update({
      ...resto,
      descripcion: cambios.descripcion === '' ? null : cambios.descripcion,
      instructor: cambios.instructor === '' ? null : cambios.instructor,
      ...(ventaAbreEn !== undefined ? { venta_abre_en: ventaAbreEn } : {}),
      ...(instructorInstagram !== undefined
        ? { instructor_instagram: instructorInstagram ? normalizarInstagram(instructorInstagram) : null }
        : {}),
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

// Eliminar un evento. Si ya tiene reservas asociadas, la base lo rechaza
// (FK `on delete restrict`) para no perder historial de ventas.
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { id } = await params
  const db = supabaseAdmin()

  const { error } = await db.from('eventos').delete().eq('id', id)

  if (error) {
    const bloqueadoPorReservas = error.code === '23503'
    console.error('[admin/eventos/:id] DELETE error', error)
    return NextResponse.json(
      {
        error: bloqueadoPorReservas
          ? 'No se puede eliminar: ya tiene reservas asociadas. Desactívalo en vez de eliminarlo.'
          : 'No pudimos eliminar el evento.',
      },
      { status: 400 },
    )
  }

  return NextResponse.json({ ok: true })
}
