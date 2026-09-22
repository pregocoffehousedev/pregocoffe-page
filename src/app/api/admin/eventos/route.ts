import { NextResponse } from 'next/server'
import { z } from 'zod'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAdmin } from '@/lib/adminAuth'
import { normalizarInstagram } from '@/lib/format'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Panel admin: lista todos los eventos (activos e inactivos).
export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { data, error } = await supabaseAdmin()
    .from('eventos')
    .select('*')
    .order('fecha', { ascending: false })

  if (error) {
    console.error('[admin/eventos] GET error', error)
    return NextResponse.json({ error: 'No pudimos cargar los eventos.' }, { status: 500 })
  }

  return NextResponse.json({ eventos: data ?? [] })
}

const Body = z
  .object({
    slug: z
      .string()
      .trim()
      .min(1)
      .max(80)
      .regex(/^[a-z0-9-]+$/, 'Usa solo minúsculas, números y guiones.'),
    nombre: z.string().trim().min(1).max(120),
    descripcion: z.string().trim().max(2000).optional().or(z.literal('')),
    categoria: z.enum(['bingo', 'taller']).default('bingo'),
    instructor: z.string().trim().max(120).optional().or(z.literal('')),
    instructorInstagram: z.string().trim().max(60).optional().or(z.literal('')),
    fecha: z.string().min(1),
    ventaAbreEn: z.string().min(1).nullable().optional(),
    lugar: z.string().trim().min(1).max(160),
    precio_clp: z.number().int().min(1),
    capacidad_total: z.number().int().min(1),
    max_por_compra: z.number().int().min(1).max(20).default(6),
    activo: z.boolean().default(true),
  })
  .superRefine((d, ctx) => {
    if (d.categoria === 'taller' && !d.instructorInstagram) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'El Instagram del instructor es obligatorio para talleres.',
        path: ['instructorInstagram'],
      })
    }
  })

// Crear un evento nuevo.
export async function POST(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const parsed = Body.safeParse(await req.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || 'Datos inválidos.' },
      { status: 400 },
    )
  }
  const d = parsed.data

  const { data, error } = await supabaseAdmin()
    .from('eventos')
    .insert({
      slug: d.slug,
      nombre: d.nombre,
      descripcion: d.descripcion || null,
      categoria: d.categoria,
      instructor: d.instructor || null,
      instructor_instagram: d.instructorInstagram
        ? normalizarInstagram(d.instructorInstagram)
        : null,
      fecha: d.fecha,
      venta_abre_en: d.ventaAbreEn || null,
      lugar: d.lugar,
      precio_clp: d.precio_clp,
      capacidad_total: d.capacidad_total,
      max_por_compra: d.max_por_compra,
      activo: d.activo,
    })
    .select()
    .single()

  if (error) {
    const msg = error.message?.includes('duplicate') || error.code === '23505'
      ? 'Ya existe un evento con ese slug.'
      : 'No pudimos crear el evento.'
    console.error('[admin/eventos] POST error', error)
    return NextResponse.json({ error: msg }, { status: 400 })
  }

  return NextResponse.json({ evento: data })
}
