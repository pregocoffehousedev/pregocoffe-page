'use client'

import { useDisponibilidadEvento } from '@/lib/useDisponibilidadEvento'

type Props = {
  eventoId: string
  capacidadTotal: number
  entradasVendidasInicial: number
}

// Igual que DisponibilidadEvento pero en el formato compacto del banner
// de la home. Ver useDisponibilidadEvento para el mecanismo en vivo.
export default function DisponibilidadBanner({
  eventoId,
  capacidadTotal,
  entradasVendidasInicial,
}: Props) {
  const entradasVendidas = useDisponibilidadEvento(eventoId, entradasVendidasInicial)
  const disponibles = capacidadTotal - entradasVendidas

  if (disponibles <= 0) {
    return (
      <div>
        <p className="text-sm font-semibold text-cafe-700">Entradas agotadas</p>
        <p className="mt-1 text-xs text-cafe-500">
          Próximamente se anunciará un nuevo bingo.
        </p>
      </div>
    )
  }

  return (
    <p className="text-sm text-cafe-600">
      Quedan <strong className="text-salvia-700">{disponibles} entradas</strong>
    </p>
  )
}
