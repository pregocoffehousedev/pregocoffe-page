'use client'

import { useEffect, useState } from 'react'
import { HORARIOS, LOCAL } from '@/data/local'

/** Devuelve si el local está abierto ahora, en hora de Chile. */
function estadoActual() {
  const ahora = new Date()
  // Forzamos zona horaria de Chile para que el estado no dependa del
  // dispositivo del visitante.
  const fmt = new Intl.DateTimeFormat('es-CL', {
    timeZone: 'America/Santiago',
    weekday: 'long',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
  const partes = Object.fromEntries(
    fmt.formatToParts(ahora).map((p) => [p.type, p.value]),
  )

  const diaHoy = (partes.weekday ?? '').toLowerCase()
  const minutosAhora = Number(partes.hour) * 60 + Number(partes.minute)

  const hoy = HORARIOS.find((h) => h.dia.toLowerCase() === diaHoy) ?? null
  // Día sin horario (domingo) => cerrado, pero seguimos marcando el día actual
  if (!hoy || hoy.abre === null || hoy.cierra === null) {
    return { abierto: false, hoy }
  }

  const [ah, am] = hoy.abre.split(':').map(Number)
  const [ch, cm] = hoy.cierra.split(':').map(Number)
  const abierto = minutosAhora >= ah * 60 + am && minutosAhora < ch * 60 + cm

  return { abierto, hoy }
}

export default function Horarios() {
  // Se calcula en el cliente: el estado depende de la hora actual, así que
  // renderizarlo en el servidor daría un valor cacheado y desincronizado.
  const [estado, setEstado] = useState<ReturnType<typeof estadoActual> | null>(null)

  useEffect(() => {
    setEstado(estadoActual())
    const id = setInterval(() => setEstado(estadoActual()), 60_000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="rounded-2xl border border-salvia-100 bg-white p-6 sm:p-7">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-semibold text-salvia-800">Horarios</h3>

        {estado && (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
              estado.abierto
                ? 'bg-salvia-100 text-salvia-700'
                : 'bg-durazno-100 text-cafe-600'
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                estado.abierto ? 'bg-salvia-600' : 'bg-cafe-400'
              }`}
            />
            {estado.abierto ? 'Abierto ahora' : 'Cerrado'}
          </span>
        )}
      </div>

      <dl className="mt-4 space-y-1.5 text-sm">
        {HORARIOS.map((h) => {
          const esHoy = estado?.hoy?.dia === h.dia
          return (
            <div
              key={h.dia}
              className={`flex justify-between rounded-md px-2 py-1 ${
                esHoy ? 'bg-salvia-50 font-medium text-salvia-800' : 'text-cafe-600'
              }`}
            >
              <dt>{h.dia}</dt>
              <dd className={h.abre ? 'tabular-nums' : 'text-cafe-400'}>
                {h.abre ? `${h.abre} – ${h.cierra}` : 'Cerrado'}
              </dd>
            </div>
          )
        })}
      </dl>

      <a
        href={`https://wa.me/${LOCAL.telefono.replace(/\D/g, '')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg border border-salvia-200 py-2.5 text-sm font-medium text-salvia-700 transition hover:bg-salvia-50"
      >
        Escríbenos por WhatsApp
      </a>

      <p className="mt-3 text-center text-xs text-cafe-400">
        En feriados el horario puede variar. Revisa nuestro{' '}
        <a
          href={`https://instagram.com/${LOCAL.instagram}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-cafe-600"
        >
          Instagram
        </a>{' '}
        para confirmar.
      </p>
    </div>
  )
}
