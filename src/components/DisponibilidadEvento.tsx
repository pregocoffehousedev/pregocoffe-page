'use client'

import { useDisponibilidadEvento } from '@/lib/useDisponibilidadEvento'

type Props = {
  eventoId: string
  capacidadTotal: number
  entradasVendidasInicial: number
}

// Contador de disponibilidad en vivo (ver useDisponibilidadEvento).
export default function DisponibilidadEvento({
  eventoId,
  capacidadTotal,
  entradasVendidasInicial,
}: Props) {
  const entradasVendidas = useDisponibilidadEvento(eventoId, entradasVendidasInicial)

  const disponibles = capacidadTotal - entradasVendidas
  const agotado = disponibles <= 0
  const porcentaje = Math.round((entradasVendidas / capacidadTotal) * 100)
  const quedanPocas = !agotado && (disponibles <= 25 || disponibles / capacidadTotal < 0.2)

  return (
    <div className="rounded-2xl border border-salvia-100 bg-white p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="font-semibold text-salvia-800">
          {agotado
            ? 'Entradas agotadas'
            : `${disponibles} ${disponibles === 1 ? 'entrada disponible' : 'entradas disponibles'}`}
        </p>
        <p className="text-sm tabular-nums text-cafe-400">
          {entradasVendidas} de {capacidadTotal} vendidas
        </p>
      </div>

      <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-salvia-100">
        <div
          className={`h-full rounded-full transition-all ${
            agotado ? 'bg-cafe-400' : quedanPocas ? 'bg-durazno-600' : 'bg-salvia-600'
          }`}
          style={{ width: `${Math.min(100, Math.max(3, porcentaje))}%` }}
        />
      </div>

      {quedanPocas && (
        <p className="mt-3 flex items-center gap-2 text-sm font-medium text-durazno-600">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-durazno-600 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-durazno-600" />
          </span>
          ¡Quedan pocas! Las entradas se están agotando.
        </p>
      )}
    </div>
  )
}
