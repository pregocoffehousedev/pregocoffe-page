import { NextResponse } from 'next/server'
import { z } from 'zod'
import { Resend } from 'resend'
import { checkRateLimit, getIp } from '@/lib/ratelimit'
import { LOCAL } from '@/data/local'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const Body = z.object({
  nombre: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(120),
  telefono: z.string().trim().max(20).optional().or(z.literal('')),
  tipo: z.string().trim().min(2).max(60),
  fecha: z
    .string()
    .trim()
    .min(4)
    .max(20)
    .refine((f) => {
      const hoy = new Date()
      hoy.setHours(0, 0, 0, 0)
      return new Date(f) >= hoy
    }, 'La fecha no puede ser anterior a hoy.'),
  personas: z.coerce.number().int().min(5).max(50),
  mensaje: z.string().trim().max(800).optional().or(z.literal('')),
})

export async function POST(req: Request) {
  // Mismo rate limit que las entradas: frena spam de formularios
  const { success } = await checkRateLimit(getIp(req))
  if (!success) {
    return NextResponse.json(
      { error: 'Demasiados envíos. Espera un minuto e inténtalo de nuevo.' },
      { status: 429 },
    )
  }

  const parsed = Body.safeParse(await req.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: 'Revisa los datos del formulario.' }, { status: 400 })
  }
  const d = parsed.data

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    // Sin Resend configurado no perdemos la solicitud: queda en los logs.
    console.warn('[cotizar] RESEND_API_KEY ausente. Solicitud recibida:', d)
    return NextResponse.json({ ok: true, guardado: 'log' })
  }

  try {
    const resend = new Resend(apiKey)
    // El SDK NO lanza excepción ante credenciales inválidas: devuelve
    // { error }. Hay que revisarlo o perderíamos solicitudes en silencio.
    const { error: errEnvio } = await resend.emails.send({
      from: process.env.RESEND_FROM || 'Prego Coffee <eventos@resend.dev>',
      to: process.env.EVENTOS_EMAIL || LOCAL.email,
      replyTo: d.email,
      subject: `Cotización de evento · ${d.tipo} · ${d.personas} personas`,
      html: `
        <h2 style="font-family:system-ui;color:#3a4a2d;">Nueva solicitud de evento</h2>
        <table style="font-family:system-ui;border-collapse:collapse;font-size:14px;">
          <tr><td style="padding:6px 12px;color:#8fa677;">Nombre</td><td style="padding:6px 12px;"><strong>${d.nombre}</strong></td></tr>
          <tr><td style="padding:6px 12px;color:#8fa677;">Email</td><td style="padding:6px 12px;">${d.email}</td></tr>
          <tr><td style="padding:6px 12px;color:#8fa677;">Teléfono</td><td style="padding:6px 12px;">${d.telefono || '—'}</td></tr>
          <tr><td style="padding:6px 12px;color:#8fa677;">Tipo</td><td style="padding:6px 12px;">${d.tipo}</td></tr>
          <tr><td style="padding:6px 12px;color:#8fa677;">Fecha</td><td style="padding:6px 12px;">${d.fecha}</td></tr>
          <tr><td style="padding:6px 12px;color:#8fa677;">Personas</td><td style="padding:6px 12px;">${d.personas}</td></tr>
        </table>
        ${d.mensaje ? `<p style="font-family:system-ui;font-size:14px;"><strong>Mensaje:</strong><br>${d.mensaje.replace(/</g, '&lt;')}</p>` : ''}
      `,
    })

    if (errEnvio) {
      // Dejamos la solicitud en los logs para no perderla, y avisamos al
      // usuario que use otro canal en vez de darle un falso "recibido".
      console.error('[cotizar] Resend rechazó el envío:', errEnvio, 'Solicitud:', d)
      return NextResponse.json(
        { error: 'No pudimos enviar tu solicitud. Escríbenos por WhatsApp.' },
        { status: 502 },
      )
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('[cotizar] error al enviar', e, 'Solicitud:', d)
    return NextResponse.json(
      { error: 'No pudimos enviar tu solicitud. Escríbenos por WhatsApp.' },
      { status: 502 },
    )
  }
}
