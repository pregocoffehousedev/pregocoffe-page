'use client'

import { useEffect, useState } from 'react'
import { clp } from '@/lib/format'
import ValidarEntradas from '@/components/admin/ValidarEntradas'

type Estado = 'pendiente' | 'pagada' | 'expirada' | 'cancelada'

type Reserva = {
  id: string
  evento_id: string
  cantidad: number
  monto_total_clp: number
  comprador_nombre: string
  comprador_telefono: string
  estado: Estado
  expira_en: string
  creada_en: string
  eventos: { nombre: string } | { nombre: string }[]
}

type Cupo = {
  capacidadTotal: number
  entradasVendidas: number
  disponibles: number
}

const FILTROS: { valor: Estado | 'todas'; etiqueta: string }[] = [
  { valor: 'pendiente', etiqueta: 'Pendientes' },
  { valor: 'pagada', etiqueta: 'Confirmadas' },
  { valor: 'expirada', etiqueta: 'Expiradas' },
  { valor: 'cancelada', etiqueta: 'Canceladas' },
  { valor: 'todas', etiqueta: 'Todas' },
]

// Panel único de reservas: confirmar pagos por transferencia, editar datos
// de contacto/cantidad, y cancelar. La sesión de Google (verificada por el
// layout de /admin) viaja en cookies: no hace falta ningún token manual.
export default function ReservasAdminPage() {
  const [tab, setTab] = useState<'reservas' | 'validar'>('reservas')
  const [reservas, setReservas] = useState<Reserva[]>([])
  const [cupo, setCupo] = useState<Cupo | null>(null)
  const [filtro, setFiltro] = useState<Estado | 'todas'>('pendiente')
  const [busqueda, setBusqueda] = useState('')
  const [cargando, setCargando] = useState(true)
  const [confirmando, setConfirmando] = useState<string | null>(null)
  const [cancelando, setCancelando] = useState<string | null>(null)
  const [codigosPorReserva, setCodigosPorReserva] = useState<Record<string, string[]>>({})
  const [editando, setEditando] = useState<Reserva | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function cargar(estadoFiltro: Estado | 'todas' = filtro) {
    setCargando(true)
    setError(null)
    try {
      const qs = estadoFiltro === 'todas' ? '' : `?estado=${estadoFiltro}`
      const res = await fetch(`/api/admin/reservas${qs}`)
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'No pudimos cargar las reservas.')
        setCargando(false)
        return
      }
      setReservas(data.reservas ?? [])
      setCupo(data.cupo ?? null)
    } catch {
      setError('Sin conexión.')
    }
    setCargando(false)
  }

  useEffect(() => {
    cargar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function cambiarFiltro(nuevo: Estado | 'todas') {
    setFiltro(nuevo)
    cargar(nuevo)
  }

  async function confirmar(reservaId: string) {
    setConfirmando(reservaId)
    setError(null)
    try {
      const res = await fetch('/api/admin/confirmar-transferencia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reservaId }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'No pudimos confirmar el pago.')
        setConfirmando(null)
        return
      }
      setCodigosPorReserva((prev) => ({ ...prev, [reservaId]: data.codigos ?? [] }))
      await cargar()
    } catch {
      setError('Sin conexión.')
    }
    setConfirmando(null)
  }

  async function cancelar(reservaId: string) {
    if (!confirm('¿Cancelar esta reserva? Se libera el cupo y se borran sus entradas.')) return
    setCancelando(reservaId)
    setError(null)
    try {
      const res = await fetch(`/api/admin/reservas/${reservaId}/cancelar`, { method: 'POST' })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'No pudimos cancelar la reserva.')
        setCancelando(null)
        return
      }
      await cargar()
    } catch {
      setError('Sin conexión.')
    }
    setCancelando(null)
  }

  const reservasFiltradas = reservas.filter((r) => {
    const q = busqueda.trim().toLowerCase()
    if (!q) return true
    return (
      r.comprador_nombre.toLowerCase().includes(q) ||
      r.comprador_telefono.toLowerCase().includes(q)
    )
  })

  if (editando) {
    return (
      <EditarReserva
        reserva={editando}
        onGuardado={() => {
          setEditando(null)
          cargar()
        }}
        onCancelar={() => setEditando(null)}
      />
    )
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-xl font-bold text-salvia-800">Reserva para Bingo Plantil</h1>

      <div className="mt-4 flex gap-1.5 rounded-lg border border-salvia-100 bg-white p-1">
        <button
          onClick={() => setTab('reservas')}
          className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition ${
            tab === 'reservas'
              ? 'bg-salvia-600 text-white'
              : 'text-salvia-700 hover:bg-salvia-50'
          }`}
        >
          Reservas
        </button>
        <button
          onClick={() => setTab('validar')}
          className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition ${
            tab === 'validar'
              ? 'bg-salvia-600 text-white'
              : 'text-salvia-700 hover:bg-salvia-50'
          }`}
        >
          Validar entradas
        </button>
      </div>

      {tab === 'validar' ? (
        <div className="mt-8">
          <ValidarEntradas />
        </div>
      ) : (
        <>
          <div className="mt-6 flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {FILTROS.map((f) => (
                <button
                  key={f.valor}
                  onClick={() => cambiarFiltro(f.valor)}
                  className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                    filtro === f.valor
                      ? 'bg-salvia-600 text-white'
                      : 'border border-salvia-100 text-salvia-700 hover:bg-salvia-50'
                  }`}
                >
                  {f.etiqueta}
                </button>
              ))}
            </div>
            <button
              onClick={() => cargar()}
              disabled={cargando}
              className="shrink-0 text-sm font-medium text-salvia-700 underline underline-offset-4"
            >
              {cargando ? 'Actualizando…' : 'Actualizar'}
            </button>
          </div>

          <div className="relative mt-3">
            <input
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por nombre o teléfono…"
              className="w-full rounded-lg border border-salvia-100 bg-white px-3.5 py-2.5 text-sm text-cafe-900 outline-none focus:border-salvia-400"
            />
            {busqueda && (
              <button
                onClick={() => setBusqueda('')}
                aria-label="Limpiar búsqueda"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-cafe-400 hover:text-cafe-600"
              >
                ✕
              </button>
            )}
          </div>

          {error && (
            <p className="mt-4 rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-700">{error}</p>
          )}

          {cupo && <ResumenCupo cupo={cupo} />}

          {reservasFiltradas.length === 0 ? (
            <p className="mt-8 text-sm text-cafe-600">
              {cargando
                ? 'Cargando…'
                : busqueda
                  ? 'No hay reservas que coincidan con la búsqueda.'
                  : 'No hay reservas en este filtro.'}
            </p>
          ) : (
            <ul className="mt-6 space-y-3">
              {reservasFiltradas.map((r) => {
                const evento = Array.isArray(r.eventos) ? r.eventos[0] : r.eventos
                const expirada = r.estado === 'pendiente' && new Date(r.expira_en) < new Date()
                const codigos = codigosPorReserva[r.id]
                return (
                  <li key={r.id} className="rounded-xl border border-salvia-100 bg-white p-4 sm:p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-salvia-800">{r.comprador_nombre}</p>
                        <p className="text-sm text-cafe-600">{r.comprador_telefono}</p>
                        <p className="mt-1 text-sm text-cafe-600">
                          {evento?.nombre} ·{' '}
                          <strong>
                            {r.cantidad} {r.cantidad === 1 ? 'persona' : 'personas'}
                          </strong>{' '}
                          · {clp(r.monto_total_clp)}
                        </p>
                      </div>

                      <EstadoBadge estado={r.estado} expirada={expirada} />
                    </div>

                    {r.estado === 'pendiente' && expirada && (
                      <p className="mt-3 rounded-lg bg-durazno-50 px-3 py-2 text-xs text-durazno-700">
                        ⚠️ El cupo ya venció y pudo liberarse a otra persona. Si confirmas, verifica
                        primero que aún queden entradas disponibles arriba.
                      </p>
                    )}

                    <div className="mt-3 flex flex-wrap gap-2">
                      {r.estado === 'pendiente' && (
                        <button
                          onClick={() => confirmar(r.id)}
                          disabled={confirmando === r.id}
                          className="rounded-lg bg-salvia-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-salvia-700 disabled:opacity-60"
                        >
                          {confirmando === r.id ? 'Confirmando…' : 'Confirmar pago recibido'}
                        </button>
                      )}

                      {(r.estado === 'pendiente' || r.estado === 'pagada') && (
                        <button
                          onClick={() => setEditando(r)}
                          className="rounded-lg border border-salvia-100 px-4 py-2 text-sm font-medium text-salvia-700 hover:bg-salvia-50"
                        >
                          Editar
                        </button>
                      )}

                      {r.estado !== 'cancelada' && (
                        <button
                          onClick={() => cancelar(r.id)}
                          disabled={cancelando === r.id}
                          className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-60"
                        >
                          {cancelando === r.id ? 'Cancelando…' : 'Cancelar'}
                        </button>
                      )}
                    </div>

                    {r.estado === 'pagada' && codigos && codigos.length > 0 && (
                      <EnviarEntradasWhatsApp
                        telefono={r.comprador_telefono}
                        nombre={r.comprador_nombre}
                        eventoNombre={evento?.nombre ?? ''}
                        codigos={codigos}
                      />
                    )}
                  </li>
                )
              })}
            </ul>
          )}
        </>
      )}
    </div>
  )
}

function EstadoBadge({ estado, expirada }: { estado: Estado; expirada: boolean }) {
  const estilos: Record<Estado, string> = {
    pagada: 'bg-green-100 text-green-800',
    pendiente: expirada ? 'bg-cafe-100 text-cafe-600' : 'bg-durazno-100 text-durazno-700',
    expirada: 'bg-cafe-100 text-cafe-600',
    cancelada: 'bg-red-50 text-red-700',
  }
  const texto: Record<Estado, string> = {
    pagada: 'Confirmada',
    pendiente: expirada ? 'Vencida' : 'Pendiente',
    expirada: 'Expirada',
    cancelada: 'Cancelada',
  }

  return (
    <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${estilos[estado]}`}>
      {texto[estado]}
    </span>
  )
}

function ResumenCupo({ cupo }: { cupo: Cupo }) {
  const { capacidadTotal, entradasVendidas, disponibles } = cupo
  const agotado = disponibles <= 0
  const pocas = !agotado && disponibles <= 5
  const porcentaje = Math.round((entradasVendidas / capacidadTotal) * 100)

  return (
    <div
      className={`mt-6 rounded-xl border p-4 ${
        agotado
          ? 'border-red-200 bg-red-50'
          : pocas
            ? 'border-durazno-200 bg-durazno-50'
            : 'border-salvia-100 bg-white'
      }`}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p
          className={`font-semibold ${
            agotado ? 'text-red-800' : pocas ? 'text-durazno-800' : 'text-salvia-800'
          }`}
        >
          {agotado
            ? 'Cupo agotado'
            : `${disponibles} ${disponibles === 1 ? 'cupo disponible' : 'cupos disponibles'}`}
        </p>
        <p className="text-sm tabular-nums text-cafe-400">
          {entradasVendidas} de {capacidadTotal} vendidas
        </p>
      </div>
      <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-salvia-100">
        <div
          className={`h-full rounded-full transition-all ${
            agotado ? 'bg-red-500' : pocas ? 'bg-durazno-600' : 'bg-salvia-600'
          }`}
          style={{ width: `${Math.min(100, Math.max(3, porcentaje))}%` }}
        />
      </div>
      {(agotado || pocas) && (
        <p className={`mt-2.5 text-xs ${agotado ? 'text-red-700' : 'text-durazno-700'}`}>
          {agotado
            ? 'No confirmes más pagos: no queda cupo. Coordina la devolución con quien transfirió de más.'
            : 'Quedan pocos cupos — revisa con cuidado antes de confirmar reservas vencidas.'}
        </p>
      )}
    </div>
  )
}

function EnviarEntradasWhatsApp({
  telefono,
  nombre,
  eventoNombre,
  codigos,
}: {
  telefono: string
  nombre: string
  eventoNombre: string
  codigos: string[]
}) {
  const numero = telefono.replace(/\D/g, '')
  const base = typeof window !== 'undefined' ? window.location.origin : ''
  const links = codigos.map((c) => `${base}/entrada/${c}`).join('\n')
  const mensaje = encodeURIComponent(
    `Hola ${nombre}! Confirmamos tu pago 🌿 Aquí ${codigos.length === 1 ? 'tu entrada' : 'tus entradas'} para ${eventoNombre}:\n\n${links}\n\nPreséntala en la puerta el día del evento.`,
  )

  return (
    <a
      href={`https://wa.me/${numero}?text=${mensaje}`}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 py-2.5 text-sm font-medium text-white transition hover:bg-green-700 sm:w-auto sm:px-6"
    >
      Enviar entradas por WhatsApp
    </a>
  )
}

function EditarReserva({
  reserva,
  onGuardado,
  onCancelar,
}: {
  reserva: Reserva
  onGuardado: () => void
  onCancelar: () => void
}) {
  const [nombre, setNombre] = useState(reserva.comprador_nombre)
  const [telefono, setTelefono] = useState(reserva.comprador_telefono)
  const [cantidad, setCantidad] = useState(String(reserva.cantidad))
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const puedeEditarCantidad = reserva.estado === 'pendiente'

  async function guardar(e: React.FormEvent) {
    e.preventDefault()
    setGuardando(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/reservas/${reserva.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre,
          telefono,
          cantidad: puedeEditarCantidad ? Number(cantidad) : undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'No pudimos guardar los cambios.')
        setGuardando(false)
        return
      }
      onGuardado()
    } catch {
      setError('Sin conexión.')
      setGuardando(false)
    }
  }

  const label = 'block text-sm font-medium text-salvia-700'
  const input =
    'mt-1.5 w-full rounded-lg border border-salvia-100 bg-white px-3 py-2.5 text-cafe-900 outline-none focus:border-salvia-400'

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-xl font-bold text-salvia-800">Editar reserva</h1>

      <form onSubmit={guardar} className="mt-6 space-y-4">
        <label className={label}>
          Nombre
          <input
            required
            minLength={2}
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className={input}
          />
        </label>

        <label className={label}>
          Teléfono
          <input
            required
            minLength={8}
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            className={input}
          />
        </label>

        <label className={label}>
          Cantidad de entradas
          <input
            required
            type="number"
            min={1}
            disabled={!puedeEditarCantidad}
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            className={`${input} disabled:opacity-60`}
          />
          {!puedeEditarCantidad && (
            <span className="mt-1 block text-xs font-normal text-cafe-400">
              No se puede cambiar la cantidad de una reserva ya confirmada, expirada o cancelada.
            </span>
          )}
        </label>

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-700">{error}</p>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={guardando}
            className="flex-1 rounded-lg bg-salvia-600 py-3 font-medium text-white hover:bg-salvia-700 disabled:opacity-60"
          >
            {guardando ? 'Guardando…' : 'Guardar'}
          </button>
          <button
            type="button"
            onClick={onCancelar}
            className="rounded-lg border border-salvia-100 px-6 py-3 text-sm font-medium text-salvia-700 hover:bg-salvia-50"
          >
            Volver
          </button>
        </div>
      </form>
    </div>
  )
}
