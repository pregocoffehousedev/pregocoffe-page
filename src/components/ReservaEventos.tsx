'use client'

import { useState } from 'react'

const TIPOS = [
  'Cumpleaños',
  'Celebración de empresa',
  'Bingo / juego temático',
  'Cata o taller',
  'Lanzamiento o prensa',
  'Otro',
] as const

const MODALIDADES = {
  local: {
    label: 'Arrendar el local',
    eyebrow: 'Eventos privados',
    titulo: 'Arrienda el local',
    desc: 'Cumpleaños, celebraciones de equipo, catas o tu propio bingo. Nos encargamos del café, la comida y el montaje.',
    bullets: [
      'Capacidad hasta 60 personas de pie',
      'Menú a medida, con opciones veganas',
      'Proyector y sonido disponibles',
      'Posibilidad de cierre exclusivo',
    ],
  },
  coffeeBreak: {
    label: 'Llevar café a tu evento',
    tipoDefault: 'Coffee break de oficina',
    eyebrow: 'Coffee Break · Prego a eventos',
    titulo: 'Llevamos el café a tu oficina',
    desc: 'Armamos una barra de café de especialidad y pastelería donde tú nos necesites: oficinas, seminarios o eventos corporativos.',
    bullets: [
      'Barra de café con barista incluido',
      'Selección de pastelería y snacks',
      'Coordinamos montaje y desmontaje',
      'Cotización según N° de personas y ubicación',
    ],
  },
} as const

export default function ReservaEventos() {
  const [modalidad, setModalidad] = useState<keyof typeof MODALIDADES>('local')
  const [enviado, setEnviado] = useState(false)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const m = MODALIDADES[modalidad]

  async function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setCargando(true)

    const datos = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>

    // El backend no tiene un campo "lugar": lo anteponemos al mensaje libre
    // para no perder el dato en las cotizaciones de coffee break.
    if (datos.lugar) {
      datos.mensaje = `Lugar: ${datos.lugar}${datos.mensaje ? `\n\n${datos.mensaje}` : ''}`
      delete datos.lugar
    }

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
        {/* Toggle de modalidad: mismo formulario, distinto encabezado y tipo de evento */}
        <div className="mx-auto flex max-w-md rounded-full border border-salvia-100 bg-salvia-50 p-1 text-sm font-medium">
          {(
            Object.entries(MODALIDADES) as [
              keyof typeof MODALIDADES,
              (typeof MODALIDADES)[keyof typeof MODALIDADES],
            ][]
          ).map(([key, mod]) => (
              <button
                key={key}
                type="button"
                onClick={() => setModalidad(key)}
                className={`flex-1 rounded-full px-4 py-2 transition ${
                  modalidad === key
                    ? 'bg-salvia-600 text-durazno-50 shadow-sm'
                    : 'text-salvia-700 hover:bg-salvia-100'
                }`}
              >
                {mod.label}
              </button>
            ))}
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-salvia-400">
              {m.eyebrow}
            </p>
            <h2 className="mt-2 text-3xl font-bold text-salvia-800">{m.titulo}</h2>
            <p className="mt-4 text-cafe-600">{m.desc}</p>

            <ul className="mt-6 space-y-2.5 text-sm text-cafe-600">
              {m.bullets.map((t) => (
                <li key={t} className="flex gap-2.5">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-salvia-400" />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <form onSubmit={enviar} className="space-y-4">
            {modalidad === 'coffeeBreak' && (
              <input type="hidden" name="tipo" value={MODALIDADES.coffeeBreak.tipoDefault} />
            )}

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
              {modalidad === 'local' ? (
                <label className={label}>
                  Tipo de evento
                  <select name="tipo" required className={input} defaultValue="">
                    <option value="" disabled>
                      Selecciona…
                    </option>
                    {TIPOS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </label>
              ) : (
                <label className={label}>
                  Lugar del evento
                  <input
                    name="lugar"
                    required
                    maxLength={120}
                    className={input}
                    placeholder="Dirección de la oficina o venue"
                  />
                </label>
              )}
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
                  max={200}
                  required
                  className={input}
                  placeholder="30"
                />
              </label>
            </div>

            <label className={label}>
              Cuéntanos más
              <textarea
                name="mensaje"
                rows={3}
                maxLength={800}
                className={`${input} resize-none`}
                placeholder="Horario, requerimientos especiales, presupuesto…"
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
