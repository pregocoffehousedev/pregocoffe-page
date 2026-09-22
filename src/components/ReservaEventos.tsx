'use client'

import { useEffect, useState } from 'react'

// Fecha de hoy en formato YYYY-MM-DD (zona horaria local), para bloquear
// que el formulario de cotización agende un día que ya pasó.
function hoyInput() {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

const SERVICIOS = [
  {
    nombre: 'Coffee 1 · Prego Clásico',
    precio: '$8.500 + IVA por persona',
    items: [
      '2 mini sándwiches clásicos.',
      '1 mini brownie artesanal.',
      '1 mini pie de limón.',
      '3 galletas artesanales.',
      '1 bebestible a elección.',
    ],
  },
  {
    nombre: 'Coffee 2 · Prego Artesanal',
    precio: '$12.500 + IVA por persona',
    items: [
      '3 mini sándwiches clásicos.',
      '1 brocheta de frutas de estación.',
      '2 mini pastelitos artesanales.',
      '2 mini dulces de pastelería.',
      '1 bebestible a elección.',
    ],
  },
  {
    nombre: 'Coffee 3 · Prego de la Casa',
    precio: '$15.500 + IVA por persona',
    items: [
      '2 mini sándwiches premium.',
      '1 porción de frutas de estación.',
      '1 vasito de yogur con granola.',
      '1 mini rollito de canela.',
      '1 mini muffin artesanal.',
      '2 bebestibles a elección.',
    ],
  },
  {
    nombre: 'Coffee 4 · Prego Signature',
    precio: '$18.500 + IVA por persona',
    items: [
      '3 mini sándwiches premium.',
      '1 porción de frutas de estación.',
      '1 mini rollito de canela.',
      '4 mini pastelitos artesanales surtidos.',
      '2 bebestibles a elección.',
    ],
  },
  {
    nombre: 'Coffee 5 · Prego Equilibrio',
    precio: '$16.500 + IVA por persona',
    items: [
      '2 mini sándwiches en pan integral.',
      '1 vasito de yogur natural con granola.',
      '1 porción de frutas de estación.',
      '1 mini cheesecake sin azúcar añadida.',
      '1 mini alfajor sin azúcar añadida.',
      '1 mini brownie sin azúcar añadida.',
      '2 bebestibles a elección.',
    ],
  },
] as const

export default function ReservaEventos() {
  const [enviado, setEnviado] = useState(false)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [expandidos, setExpandidos] = useState<Set<string>>(new Set())

  function alternarExpandido(nombre: string) {
    setExpandidos((prev) => {
      const next = new Set(prev)
      if (next.has(nombre)) next.delete(nombre)
      else next.add(nombre)
      return next
    })
  }

  // Calculado en el cliente tras montar (no en el render del servidor) para
  // evitar mismatches de hidratación por reloj/zona horaria del servidor.
  const [fechaMin, setFechaMin] = useState<string | undefined>(undefined)
  useEffect(() => {
    setFechaMin(hoyInput())
  }, [])

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
            Café de especialidad, panadería y pastelería artesanal, con propuestas dulces
            y saladas para reuniones, celebraciones y encuentros corporativos.
          </p>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <h3 className="text-lg font-semibold text-salvia-800">Nuestros coffee breaks</h3>
            <ul className="mt-4 space-y-4">
              {SERVICIOS.map((s) => {
                const abierto = expandidos.has(s.nombre)
                return (
                  <li key={s.nombre} className="rounded-xl border border-salvia-100 p-4">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className="font-medium text-salvia-800">{s.nombre}</p>
                      <p className="text-sm font-semibold text-salvia-600">{s.precio}</p>
                    </div>
                    {abierto && (
                      <ul className="mt-2 space-y-0.5 text-sm text-cafe-600">
                        {s.items.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    )}
                    <button
                      type="button"
                      onClick={() => alternarExpandido(s.nombre)}
                      className="mt-2 text-xs font-medium text-salvia-600 underline underline-offset-2 hover:text-salvia-700"
                    >
                      {abierto ? 'Ver menos' : 'Ver más'}
                    </button>
                  </li>
                )
              })}
            </ul>
            <div className="mt-5 space-y-3 text-sm text-cafe-600">
              <p>
                <span className="font-medium text-salvia-800">🥐 Nuestros mini sándwiches:</span>{' '}
                clásicos (jamón y queso, ave pimentón, pasta de huevo y tomate, ave palta) y
                premium (pollo con cebolla caramelizada, hummus con pimientos asados, jamón
                serrano con queso crema y mediterráneo). Disponibles en mini brioche, croissant
                o pan artesanal, según preparación.
              </p>
              <p>
                <span className="font-medium text-salvia-800">☕ Bebestibles:</span> café de
                especialidad, selección de té, jugos naturales y aguas saborizadas, según la
                alternativa contratada.
              </p>
              <p className="text-xs text-cafe-400">
                Todos nuestros coffee breaks incluyen decoración y montaje. Preparaciones
                sujetas a disponibilidad y coordinación previa. Cantidad mínima de personas,
                traslado y requerimientos especiales sujetos a cotización.
              </p>
            </div>
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
                Coffee de interés
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
                <input
                  name="fecha"
                  type="date"
                  required
                  min={fechaMin}
                  className={input}
                />
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
