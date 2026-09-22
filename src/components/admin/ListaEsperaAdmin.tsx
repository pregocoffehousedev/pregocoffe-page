'use client'

import { useEffect, useState } from 'react'

type Anotado = {
  id: string
  nombre: string
  telefono: string
  notificado: boolean
  creada_en: string
}

// Panel admin: quién dejó su WhatsApp esperando un cupo cuando el evento
// estaba agotado. Orden de llegada (primero en anotarse, primero acá).
export default function ListaEsperaAdmin() {
  const [lista, setLista] = useState<Anotado[]>([])
  const [cargando, setCargando] = useState(true)
  const [notificando, setNotificando] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function cargar() {
    setCargando(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/lista-espera')
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'No pudimos cargar la lista de espera.')
        setCargando(false)
        return
      }
      setLista(data.listaEspera ?? [])
    } catch {
      setError('Sin conexión.')
    }
    setCargando(false)
  }

  useEffect(() => {
    cargar()
  }, [])

  async function marcarNotificado(id: string) {
    setNotificando(id)
    setError(null)
    try {
      const res = await fetch(`/api/admin/lista-espera/${id}/notificado`, { method: 'POST' })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'No pudimos actualizar el registro.')
        setNotificando(null)
        return
      }
      await cargar()
    } catch {
      setError('Sin conexión.')
    }
    setNotificando(null)
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="min-w-0 text-sm text-salvia-700">
          Personas que dejaron su WhatsApp cuando el evento estaba agotado, en
          orden de llegada.
        </p>
        <button
          onClick={cargar}
          disabled={cargando}
          className="shrink-0 text-sm font-medium text-salvia-700 underline underline-offset-4"
        >
          {cargando ? 'Actualizando…' : 'Actualizar'}
        </button>
      </div>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-700">{error}</p>
      )}

      {lista.length === 0 ? (
        <p className="mt-6 text-sm text-cafe-600">
          {cargando ? 'Cargando…' : 'Nadie se ha anotado en la lista de espera.'}
        </p>
      ) : (
        <ul className="mt-6 space-y-3">
          {lista.map((a, i) => (
            <li key={a.id} className="rounded-xl border border-salvia-100 bg-white p-4 sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-salvia-400">
                    #{i + 1}
                  </p>
                  <p className="break-words font-semibold text-salvia-800">{a.nombre}</p>
                  <p className="text-sm text-cafe-600">{a.telefono}</p>
                </div>
                {a.notificado && (
                  <span className="shrink-0 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
                    Ya avisado
                  </span>
                )}
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <a
                  href={`https://wa.me/${a.telefono.replace(/\D/g, '')}?text=${encodeURIComponent(
                    `Hola ${a.nombre}! Se liberó un cupo para el Bingo de Plantas 🌿 ¿Sigues interesado en comprar tu entrada?`,
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700"
                >
                  Avisar por WhatsApp
                </a>

                {!a.notificado && (
                  <button
                    onClick={() => marcarNotificado(a.id)}
                    disabled={notificando === a.id}
                    className="rounded-lg border border-salvia-100 px-4 py-2 text-sm font-medium text-salvia-700 hover:bg-salvia-50 disabled:opacity-60"
                  >
                    {notificando === a.id ? 'Marcando…' : 'Marcar como avisado'}
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
