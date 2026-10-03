'use client'

import { useEffect, useState } from 'react'

// ¿Hay un bingo activo cuya fecha aún no pasó? Lo usan el header y el
// footer para ocultar los links a "Entradas" cuando ya no queda nada
// que comprar (evita mandar a una página que solo dice "próximamente").
//
// Recibe el valor ya resuelto por el servidor (ver layout.tsx) como estado
// inicial, para que el primer render ya sea correcto y no haya parpadeo del
// botón "Entradas" mientras se espera la respuesta del fetch.
export function useBingoVigente(inicial: boolean) {
  const [vigente, setVigente] = useState(inicial)

  useEffect(() => {
    let vivo = true
    fetch('/api/eventos/bingo-vigente')
      .then((r) => r.json())
      .then((d) => {
        if (vivo) setVigente(Boolean(d.vigente))
      })
      .catch(() => {
        // Si falla la consulta, dejamos el link visible por defecto:
        // preferimos uno que redirige a "próximamente" antes que
        // esconder la entrada al bingo por un error de red pasajero.
      })
    return () => {
      vivo = false
    }
  }, [])

  return vigente
}
