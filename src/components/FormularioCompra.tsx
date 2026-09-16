'use client'

import { useEffect, useState } from 'react'
import { clp } from '@/lib/format'
import { CUENTA_BANCARIA, LOCAL } from '@/data/local'
import { useDisponibilidadEvento } from '@/lib/useDisponibilidadEvento'
import ContadorVenta from './ContadorVenta'

type Props = {
  slug: string
  eventoId: string
  precio: number
  maxPorCompra: number
  capacidadTotal: number
  entradasVendidasInicial: number
  ventaAbreEn: string | null
}

type ReservaTransferencia = {
  reservaId: string
  montoTotal: number
  expiraEn: string
}

export default function FormularioCompra({
  slug,
  eventoId,
  precio,
  maxPorCompra,
  capacidadTotal,
  entradasVendidasInicial,
  ventaAbreEn,
}: Props) {
  const entradasVendidas = useDisponibilidadEvento(eventoId, entradasVendidasInicial)
  const disponibles = capacidadTotal - entradasVendidas

  const [cantidad, setCantidad] = useState(1)
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [reserva, setReserva] = useState<ReservaTransferencia | null>(null)
  const [ventaAbierta, setVentaAbierta] = useState(
    !ventaAbreEn || new Date(ventaAbreEn).getTime() <= Date.now(),
  )

  const maximo = Math.min(maxPorCompra, disponibles)
  const agotado = disponibles <= 0
  const total = precio * cantidad

  // Si la disponibilidad baja en vivo (otra persona compró) y la cantidad
  // seleccionada quedó por encima del nuevo máximo, la ajustamos sola.
  useEffect(() => {
    if (cantidad > maximo && maximo > 0) setCantidad(maximo)
  }, [maximo, cantidad])

  async function reservar(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setCargando(true)

    try {
      const res = await fetch('/api/reservar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventoSlug: slug, cantidad, nombre, telefono }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Algo salió mal. Inténtalo de nuevo.')
        setCargando(false)
        return
      }

      setReserva({
        reservaId: data.reservaId,
        montoTotal: data.montoTotal,
        expiraEn: data.expiraEn,
      })
      setCargando(false)
    } catch {
      setError('Sin conexión. Revisa tu internet e inténtalo de nuevo.')
      setCargando(false)
    }
  }

  if (!ventaAbierta && ventaAbreEn) {
    return (
      <ContadorVenta
        ventaAbreEn={ventaAbreEn}
        onAbierta={() => setVentaAbierta(true)}
      />
    )
  }

  if (agotado) {
    return <EntradasAgotadas slug={slug} />
  }

  if (reserva) {
    return <InstruccionesTransferencia reserva={reserva} nombre={nombre} />
  }

  const input =
    'mt-1.5 w-full rounded-lg border border-salvia-100 bg-durazno-50/60 px-3.5 py-2.5 text-cafe-900 outline-none transition focus:border-salvia-400 focus:bg-white'
  const label = 'block text-sm font-medium text-salvia-700'

  return (
    <form
      onSubmit={reservar}
      className="overflow-hidden rounded-2xl border border-salvia-100 bg-white shadow-sm"
    >
      {/* Cabecera con el precio unitario */}
      <div className="border-b border-salvia-100 bg-salvia-50/60 px-6 py-5">
        <h2 className="font-semibold text-salvia-800">Comprar entradas</h2>
        <p className="mt-0.5 text-sm text-cafe-600">
          {clp(precio)} por persona · Pago por transferencia
        </p>
      </div>

      <div className="space-y-4 p-6">
        {/* Cantidad: botones en vez de select, más cómodo en móvil */}
        <div>
          <span className={label}>Cantidad</span>
          <div className="mt-2 flex flex-wrap gap-2">
            {Array.from({ length: maximo }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setCantidad(n)}
                aria-pressed={cantidad === n}
                className={`h-11 w-11 rounded-lg border text-sm font-medium transition ${
                  cantidad === n
                    ? 'border-salvia-600 bg-salvia-600 text-durazno-50'
                    : 'border-salvia-100 bg-white text-salvia-700 hover:border-salvia-400'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
          {maximo < maxPorCompra && (
            <p className="mt-2 text-xs text-durazno-600">
              Solo quedan {disponibles} entradas.
            </p>
          )}
        </div>

        <label className={label}>
          Nombre completo
          <input
            required
            minLength={2}
            maxLength={80}
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className={input}
            placeholder="María González"
          />
        </label>

        <label className={label}>
          Teléfono
          <input
            required
            type="tel"
            minLength={8}
            maxLength={20}
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            className={input}
            placeholder="+56 9 1234 5678"
          />
          <span className="mt-1 block text-xs font-normal text-cafe-400">
            Por WhatsApp coordinamos tu comprobante y te enviamos las entradas.
          </span>
        </label>
      </div>

      {/* Resumen y pago */}
      <div className="border-t border-salvia-100 bg-durazno-50/50 px-6 py-5">
        <dl className="space-y-1.5 text-sm">
          <div className="flex justify-between text-cafe-600">
            <dt>
              {cantidad} {cantidad === 1 ? 'entrada' : 'entradas'} × {clp(precio)}
            </dt>
            <dd className="tabular-nums">{clp(total)}</dd>
          </div>
          <div className="flex items-baseline justify-between border-t border-salvia-100 pt-2.5">
            <dt className="font-medium text-salvia-800">Total</dt>
            <dd className="text-2xl font-bold tabular-nums text-salvia-800">
              {clp(total)}
            </dd>
          </div>
        </dl>

        {error && (
          <p
            role="alert"
            className="mt-4 rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-700"
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={cargando}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-salvia-600 py-3.5 font-medium text-durazno-50 transition hover:bg-salvia-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {cargando && (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-durazno-50/40 border-t-durazno-50" />
          )}
          {cargando ? 'Reservando tu cupo…' : 'Reservar y ver datos para transferir'}
        </button>

        <p className="mt-3 text-center text-xs leading-relaxed text-cafe-400">
          Tu cupo queda reservado 5 minutos mientras transfieres y nos avisas.
        </p>
      </div>
    </form>
  )
}

function EntradasAgotadas({ slug }: { slug: string }) {
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [anotado, setAnotado] = useState(false)

  async function anotarse(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setCargando(true)
    try {
      const res = await fetch('/api/lista-espera', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventoSlug: slug, nombre, telefono }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'No pudimos anotarte. Inténtalo de nuevo.')
        setCargando(false)
        return
      }
      setAnotado(true)
    } catch {
      setError('Sin conexión. Revisa tu internet e inténtalo de nuevo.')
    }
    setCargando(false)
  }

  const input =
    'mt-1.5 w-full rounded-lg border border-salvia-100 bg-durazno-50/60 px-3.5 py-2.5 text-cafe-900 outline-none transition focus:border-salvia-400 focus:bg-white'
  const label = 'block text-sm font-medium text-salvia-700'

  return (
    <div className="rounded-2xl border border-salvia-100 bg-white p-8 text-center">
      <p className="text-2xl">🌿</p>
      <p className="mt-3 text-lg font-semibold text-salvia-800">Entradas agotadas</p>
      <p className="mt-2 text-sm text-cafe-600">
        Se liberan cupos cuando una reserva no se completa. Deja tu WhatsApp y te
        avisamos apenas se libere uno. Si no se libera ninguno, próximamente se
        anunciará un nuevo bingo.
      </p>

      {anotado ? (
        <p className="mt-5 rounded-lg bg-salvia-50 px-4 py-3 text-sm font-medium text-salvia-700">
          ¡Listo! Quedaste anotado. Te escribimos por WhatsApp si se libera un cupo.
        </p>
      ) : (
        <form onSubmit={anotarse} className="mt-5 space-y-3 text-left">
          <label className={label}>
            Nombre completo
            <input
              required
              minLength={2}
              maxLength={80}
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className={input}
              placeholder="María González"
            />
          </label>

          <label className={label}>
            Teléfono
            <input
              required
              type="tel"
              minLength={8}
              maxLength={20}
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              className={input}
              placeholder="+56 9 1234 5678"
            />
          </label>

          {error && (
            <p role="alert" className="rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={cargando}
            className="w-full rounded-lg bg-salvia-600 py-3 font-medium text-durazno-50 transition hover:bg-salvia-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {cargando ? 'Anotando…' : 'Avísame si se libera un cupo'}
          </button>
        </form>
      )}
    </div>
  )
}

function InstruccionesTransferencia({
  reserva,
  nombre,
}: {
  reserva: ReservaTransferencia
  nombre: string
}) {
  const numero = LOCAL.telefono.replace(/\D/g, '')
  const mensaje = encodeURIComponent(
    `Hola! Soy ${nombre}, ya transferí ${clp(reserva.montoTotal)} para mi reserva de entradas (código ${reserva.reservaId.slice(0, 8)}). Te comparto el comprobante.`,
  )

  const dato = 'flex items-baseline justify-between border-b border-salvia-100 py-2.5 last:border-0'
  const etiqueta = 'text-sm text-cafe-600'
  const valor = 'font-medium text-salvia-800'

  return (
    <div className="overflow-hidden rounded-2xl border border-salvia-100 bg-white shadow-sm">
      <div className="border-b border-salvia-100 bg-salvia-50/60 px-6 py-5">
        <h2 className="font-semibold text-salvia-800">Cupo reservado</h2>
        <p className="mt-0.5 text-sm text-cafe-600">
          Transfiere <strong>{clp(reserva.montoTotal)}</strong> en los próximos 5
          minutos para asegurar tu entrada.
        </p>
      </div>

      <div className="p-6">
        <div>
          <div className={dato}>
            <span className={etiqueta}>Banco</span>
            <span className={valor}>{CUENTA_BANCARIA.banco}</span>
          </div>
          <div className={dato}>
            <span className={etiqueta}>Tipo de cuenta</span>
            <span className={valor}>{CUENTA_BANCARIA.tipoCuenta}</span>
          </div>
          <div className={dato}>
            <span className={etiqueta}>N° de cuenta</span>
            <span className={valor}>{CUENTA_BANCARIA.numero}</span>
          </div>
          <div className={dato}>
            <span className={etiqueta}>Titular</span>
            <span className={valor}>{CUENTA_BANCARIA.titular}</span>
          </div>
          <div className={dato}>
            <span className={etiqueta}>RUT</span>
            <span className={valor}>{CUENTA_BANCARIA.rut}</span>
          </div>
          <div className={dato}>
            <span className={etiqueta}>Email</span>
            <span className={valor}>{CUENTA_BANCARIA.email}</span>
          </div>
          <div className={dato}>
            <span className={etiqueta}>Monto a transferir</span>
            <span className="text-lg font-bold text-salvia-800">
              {clp(reserva.montoTotal)}
            </span>
          </div>
        </div>

        <a
          href={`https://wa.me/${numero}?text=${mensaje}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-salvia-600 py-3.5 font-medium text-durazno-50 transition hover:bg-salvia-700"
        >
          Enviar comprobante por WhatsApp
        </a>

        <p className="mt-3 text-center text-xs leading-relaxed text-cafe-400">
          Una vez que confirmemos tu pago, te enviamos las entradas por este
          mismo WhatsApp. Si no llega el comprobante a tiempo, el cupo se
          libera automáticamente.
        </p>
      </div>
    </div>
  )
}
