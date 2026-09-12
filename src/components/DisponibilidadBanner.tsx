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
    return <p className="text-sm font-medium text-cafe-600">Entradas agotadas</p>
  }

  return (
    <p className="text-sm text-cafe-600">
      Quedan <strong className="text-salvia-700">{disponibles} entradas</strong>
    </p>
  )
}
