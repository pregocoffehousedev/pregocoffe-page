/**
 * Ilustraciones de línea para las categorías de la carta.
 * Trazo fino y uniforme, igual que el isotipo del logo, para que
 * la carta se lea como parte del mismo sistema gráfico.
 */

type Props = { className?: string }

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

/** Taza de café con platillo y vapor */
export function IconoCafe({ className = '' }: Props) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <g {...base}>
        {/* Vapor */}
        <path d="M19 9c0-2 1.6-2.4 1.6-4.2 0-1-.6-1.8-1.6-2.3" opacity=".7" />
        <path d="M25 9c0-2 1.6-2.4 1.6-4.2 0-1-.6-1.8-1.6-2.3" opacity=".7" />
        {/* Cuerpo de la taza */}
        <path d="M11 15h24v10a10 10 0 0 1-10 10h-4a10 10 0 0 1-10-10V15Z" />
        {/* Asa */}
        <path d="M35 18h3.5a4.5 4.5 0 0 1 0 9H35" />
        {/* Platillo */}
        <path d="M7 40h32" />
      </g>
    </svg>
  )
}

/** Vaso alto con hielo y bombilla: bebidas frías sin café */
export function IconoSinCafe({ className = '' }: Props) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <g {...base}>
        {/* Vaso */}
        <path d="M13 12h22l-2.5 28a2 2 0 0 1-2 1.8H17.5a2 2 0 0 1-2-1.8L13 12Z" />
        {/* Nivel de líquido */}
        <path d="M14.2 21h19.6" opacity=".65" />
        {/* Hielos */}
        <path d="M19 26.5h4.5v4.5H19zM26 31h4v4h-4z" opacity=".55" />
        {/* Bombilla */}
        <path d="M27 12l4-8" />
        {/* Hoja de menta */}
        <path d="M31.5 8c2.2-1.2 4.4-.6 5.5.8-1.2 1.8-3.6 2.3-5.5.9Z" opacity=".8" />
      </g>
    </svg>
  )
}

/** Croissant: panadería y pastelería */
export function IconoPanaderia({ className = '' }: Props) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <g {...base}>
        {/*
          Silueta CERRADA de media luna. Las curvas abiertas se leían como
          un arco; el contorno cerrado hace inconfundible el croissant.
          Arco exterior de izquierda a derecha, y vuelta por el interior.
        */}
        <path d="M8 33
                 C 6 21, 15 12, 26 12
                 C 34 12, 40 17, 41.5 24
                 C 39 22.5, 36.5 23, 35.5 25
                 C 34 20.5, 30 17.5, 25 17.5
                 C 17.5 17.5, 12 24, 13.5 31.5
                 C 12 29.8, 9.6 30.5, 8 33 Z" />
        {/* Pliegues internos */}
        <path d="M20 18.6c-.5 2.4-.6 4.8-.3 7.2M26 17.7c.2 2.6.1 5.2-.4 7.7M31.6 19.6c-.2 2.2-.2 4.3.1 6.4"
              opacity=".45" />
      </g>
    </svg>
  )
}

/** Sartén con huevo: cocina */
export function IconoCocina({ className = '' }: Props) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <g {...base}>
        {/* Sartén: más ancha que alta, claramente un recipiente */}
        <path d="M4 21h26v4a13 13 0 0 1-13 13A13 13 0 0 1 4 25v-4Z" />
        {/* Mango largo, inclinado: lo que la distingue de una taza */}
        <path d="M30 23.5l12-4.5" />
        <path d="M41 17.4l2.6-1" opacity=".7" />
        {/* Clara del huevo, descentrada */}
        <path d="M9.5 28.6c0-3.3 2.7-6 6-6 2.6 0 4.4 1.4 5.6 3.3 1 1.6 2.4 2.4 4 2.6" opacity=".8" />
        {/* Yema */}
        <circle cx="15" cy="29.5" r="2.6" />
        {/* Vapor */}
        <path d="M13 15.5c0-1.8 1.4-2.2 1.4-3.8M20 15.5c0-1.8 1.4-2.2 1.4-3.8" opacity=".55" />
      </g>
    </svg>
  )
}

/** Mapa categoría → ilustración */
export const ICONOS: Record<string, (p: Props) => React.ReactElement> = {
  'Café': IconoCafe,
  'Sin café': IconoSinCafe,
  'Panadería y pastelería': IconoPanaderia,
  'Cocina': IconoCocina,
}
