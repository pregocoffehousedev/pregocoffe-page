'use client'

import { useState } from 'react'

const SERVICIOS = [
  {
    nombre: 'Coffee Break Buffet',
    desc: 'Propuestas para reuniones, capacitaciones y eventos corporativos, con preparaciones artesanales dulces y saladas.',
  },
  {
    nombre: 'Mesas de Directorio',
    desc: 'Ideales para encuentros ejecutivos y reuniones importantes, con una presentación cuidada y personalizada.',
  },
  {
    nombre: 'Cajas Corporativas de Desayunos',
    desc: 'Perfectas para regalar, sorprender o enviar a equipos de trabajo.',
  },
  {
    nombre: 'Barra de Café de Especialidad',
    desc: 'Servicio de café de especialidad para eventos, con opción de acompañarlo de pastelería artesanal, montaje y desmontaje. La barra de café no incluye barista.',
  },
] as const

export default function ReservaEventos() {
  const [enviado, setEnviado] = useState(false)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    const datos = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>

    const personas = Number(datos.personas)
    if (personas > 50) {
      setError('El máximo son 50 personas para este servicio.')
      return
    }

    setCargando(true)
    try {
      const res = await fetch('/api/eventos/cotizar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos),
      })
      const json = await res.json()

      if (!res.ok) {
        setError(json.error || 'No pudimos enviar tu solicitud.')
        setCargando(false)
        return
      }
      setEnviado(true)
    } catch {
      setError('Sin conexión. Revisa tu internet e inténtalo de nuevo.')
      setCargando(false)
    }
  }

  if (enviado) {
    return (
      <section id="eventos" className="scroll-mt-24">
        <div className="mx-auto max-w-lg rounded-2xl border border-salvia-200 bg-salvia-50 p-10 text-center">
          <p className="text-2xl">🌿</p>
          <h2 className="mt-3 text-xl font-bold text-salvia-800">
            Recibimos tu solicitud
          </h2>
          <p className="mt-2 text-sm text-cafe-600">
            Te contactamos dentro de las próximas 24 horas hábiles con una propuesta.
          </p>
        </div>
      </section>
    )
  }

  const input =
    'mt-1.5 w-full rounded-lg border border-salvia-100 bg-white px-3 py-2.5 text-cafe-900 outline-none transition focus:border-salvia-400'
  const label = 'block text-sm font-medium text-salvia-700'

  return (
    <section id="eventos" className="scroll-mt-24">
      <div className="rounded-2xl border border-salvia-100 bg-white p-7 sm:p-10">
        <div className="text-center">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-salvia-400">
            Coffee Break & Desayunos Corporativos
          </p>
          <h2 className="mt-2 text-3xl font-bold text-salvia-800">
            Llevamos Prego a tu empresa
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-cafe-600">
            Acompañamos tus reuniones, eventos y encuentros corporativos con propuestas de
            coffee break en formato buffet, mesas de directorio y cajas corporativas de
            desayunos, cuidando cada elemento desde la presentación hasta el servicio.
            Diseñamos cada pedido a medida, adaptándonos a tus necesidades, estilo y tipo
            de evento.
          </p>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <h3 className="text-lg font-semibold text-salvia-800">Nuestros servicios</h3>
            <ul className="mt-4 space-y-4">
              {SERVICIOS.map((s) => (
                <li key={s.nombre} className="rounded-xl border border-salvia-100 p-4">
                  <p className="font-medium text-salvia-800">{s.nombre}</p>
                  <p className="mt-1 text-sm text-cafe-600">{s.desc}</p>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm text-cafe-600">
              Podemos personalizar los pedidos con mensajes especiales o identidad
              corporativa, logrando una experiencia coherente y memorable para cada empresa.
            </p>
          </div>

          <form onSubmit={enviar} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className={label}>
                Nombre
                <input name="nombre" required minLength={2} maxLength={80} className={input} />
              </label>
              <label className={label}>
                Email
                <input name="email" type="email" required maxLength={120} className={input} />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className={label}>
                Teléfono
                <input name="telefono" maxLength={20} className={input} placeholder="Opcional" />
              </label>
              <label className={label}>
                Servicio de interés
                <select name="tipo" required className={input} defaultValue="">
                  <option value="" disabled>
                    Selecciona…
                  </option>
                  {SERVICIOS.map((s) => (
                    <option key={s.nombre} value={s.nombre}>
                      {s.nombre}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className={label}>
                Fecha estimada
                <input name="fecha" type="date" required className={input} />
              </label>
              <label className={label}>
                N° de personas
                <input
                  name="personas"
                  type="number"
                  min={5}
                  max={50}
                  required
                  className={input}
                  placeholder="30"
                />
              </label>
            </div>

            <label className={label}>
              Cuéntanos tu idea
              <textarea
                name="mensaje"
                rows={3}
                maxLength={800}
                className={`${input} resize-none`}
                placeholder="Ubicación, horario, requerimientos especiales, identidad corporativa…"
              />
            </label>

            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-700">{error}</p>
            )}

            <button
              type="submit"
              disabled={cargando}
              className="w-full rounded-lg bg-salvia-600 py-3 font-medium text-durazno-50 transition hover:bg-salvia-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {cargando ? 'Enviando…' : 'Solicitar cotización'}
            </button>
            <p className="text-center text-xs text-cafe-400">
              Te respondemos dentro de 24 horas hábiles.
            </p>
          </form>
        </div>
      </div>
    </section>
  )
}
