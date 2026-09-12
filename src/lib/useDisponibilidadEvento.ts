'use client'

import { useEffect, useState } from 'react'
import { supabaseBrowser } from './supabase/client'

/**
 * Se suscribe a Supabase Realtime para reflejar `entradas_vendidas` en vivo:
 * apenas alguien reserva o se confirma un pago, el valor cambia en la base
 * y este hook lo entrega actualizado sin que nadie recargue la página.
 * Arranca con el valor que trajo el Server Component (así la primera carga
 * sigue siendo rápida vía ISR).
 */
export function useDisponibilidadEvento(eventoId: string, entradasVendidasInicial: number) {
  const [entradasVendidas, setEntradasVendidas] = useState(entradasVendidasInicial)

  useEffect(() => {
    const supabase = supabaseBrowser()
    let activo = true

    // Nombre único por montaje: evita colisión con el canal del montaje
    // anterior si el cleanup (async) todavía no terminó — p.ej. bajo
    // React StrictMode, que monta/desmonta el efecto dos veces en dev.
    const canal = supabase
      .channel(`evento-${eventoId}-${Math.random().toString(36).slice(2)}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'eventos', filter: `id=eq.${eventoId}` },
        (payload) => {
          if (!activo) return
          const nuevo = payload.new as { entradas_vendidas: number }
          setEntradasVendidas(nuevo.entradas_vendidas)
        },
      )
      .subscribe()

    return () => {
      activo = false
      supabase.removeChannel(canal)
    }
  }, [eventoId])

  return entradasVendidas
}
