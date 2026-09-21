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

/** Tetera: infusiones y especialidades */
export function IconoTetera({ className = '' }: Props) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <g {...base}>
        {/* Cuerpo */}
        <path d="M10 24c0-2.2 1.8-4 4-4h16c4.4 0 8 3.6 8 8s-3.6 8-8 8H14c-2.2 0-4-1.8-4-4v-8Z" />
        {/* Pico */}
        <path d="M38 25l6-3.5" />
        {/* Asa */}
        <path d="M10 24H6.5a3 3 0 0 0 0 8H10" opacity=".8" />
        {/* Tapa */}
        <path d="M17 20v-3.5a3 3 0 0 1 3-3h0a3 3 0 0 1 3 3V20" opacity=".7" />
        <circle cx="20" cy="12" r="1.4" />
        {/* Vapor */}
        <path d="M27 8c0-1.8 1.4-2.2 1.4-3.8" opacity=".55" />
      </g>
    </svg>
  )
}

/** Copa con sombrilla y burbujas: mocktails */
export function IconoMocktail({ className = '' }: Props) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <g {...base}>
        {/* Copa */}
        <path d="M12 10h24l-10 14v14" />
        <path d="M17 38h14" />
        {/* Nivel de líquido */}
        <path d="M15 14h18" opacity=".6" />
        {/* Burbujas */}
        <circle cx="22" cy="17" r="1.1" opacity=".7" />
        <circle cx="26" cy="19.5" r="1" opacity=".6" />
        {/* Sombrilla */}
        <path d="M30 8c3-2.4 6.6-2.4 8.4.6-2.8 1.4-6 1-8.4-.6Z" opacity=".85" />
        <path d="M30 8l3 9" />
      </g>
    </svg>
  )
}

/** Vaso alto con hielo y bombilla: bebidas frías */
export function IconoBebidaFria({ className = '' }: Props) {
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

/** Bocata: pan alargado relleno, en diagonal */
export function IconoBocata({ className = '' }: Props) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <g {...base}>
        {/* Pan, forma alargada en diagonal */}
        <path d="M6 30 34 8c3-2.3 7 1.7 4.7 4.7L16 40c-2 2.6-6 1.8-6.8-1.3L6 30Z" />
        {/* Relleno asomando */}
        <path d="M14 27l6 5M18 22l6 5M22 17l5 4" opacity=".6" />
        {/* Semillas */}
        <circle cx="27" cy="14" r=".9" opacity=".7" />
        <circle cx="30" cy="17.5" r=".9" opacity=".7" />
      </g>
    </svg>
  )
}

/** Sándwich apilado en capas: sándwiches de cocina */
export function IconoSandwich({ className = '' }: Props) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <g {...base}>
        {/* Pan superior */}
        <path d="M8 20 24 9l16 11" />
        {/* Capas del relleno */}
        <path d="M8 20h32v3H8zM9 26h30v3H9z" opacity=".7" />
        {/* Pan inferior */}
        <path d="M10 32h28l-2 5H12l-2-5Z" />
        {/* Palillo */}
        <path d="M24 9v-4" opacity=".6" />
        <circle cx="24" cy="4" r="1.3" opacity=".6" />
      </g>
    </svg>
  )
}

/** Tostadora con pan saliendo: tostadas */
export function IconoTostada({ className = '' }: Props) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <g {...base}>
        {/* Cuerpo de la tostadora */}
        <path d="M8 20a3 3 0 0 1 3-3h26a3 3 0 0 1 3 3v16a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V20Z" />
        {/* Ranuras */}
        <path d="M17 17v-2M31 17v-2" opacity=".7" />
        {/* Pan saliendo */}
        <path d="M15 17v-6a2.5 2.5 0 0 1 2.5-2.5h0A2.5 2.5 0 0 1 20 11v6" />
        <path d="M28 17v-6a2.5 2.5 0 0 1 2.5-2.5h0A2.5 2.5 0 0 1 33 11v6" />
        {/* Palanca */}
        <path d="M35 24h4" opacity=".6" />
      </g>
    </svg>
  )
}

/** Huevo frito en sartén: desayunos */
export function IconoDesayuno({ className = '' }: Props) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <g {...base}>
        {/* Sartén */}
        <path d="M4 21h26v4a13 13 0 0 1-13 13A13 13 0 0 1 4 25v-4Z" />
        {/* Mango */}
        <path d="M30 23.5l12-4.5" />
        <path d="M41 17.4l2.6-1" opacity=".7" />
        {/* Clara del huevo */}
        <path d="M9.5 28.6c0-3.3 2.7-6 6-6 2.6 0 4.4 1.4 5.6 3.3 1 1.6 2.4 2.4 4 2.6" opacity=".8" />
        {/* Yema */}
        <circle cx="15" cy="29.5" r="2.6" />
        {/* Vapor */}
        <path d="M13 15.5c0-1.8 1.4-2.2 1.4-3.8M20 15.5c0-1.8 1.4-2.2 1.4-3.8" opacity=".55" />
      </g>
    </svg>
  )
}

/** Plato con cubiertos: brunchealo */
export function IconoBrunch({ className = '' }: Props) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <g {...base}>
        {/* Plato */}
        <circle cx="24" cy="24" r="14" />
        <circle cx="24" cy="24" r="8" opacity=".5" />
        {/* Tenedor */}
        <path d="M8 10v8M11 10v8M8 10v-4M11 10v-4M9.5 18v14" />
        {/* Cuchillo */}
        <path d="M40 6v13c0 2-1.5 3-3 3v11" />
      </g>
    </svg>
  )
}

/** Bowl con hojas: ensaladas */
export function IconoEnsalada({ className = '' }: Props) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <g {...base}>
        {/* Bowl */}
        <path d="M6 22h36c-1 9-8.5 16-18 16S7 31 6 22Z" />
        <path d="M6 22a18 6 0 0 1 36 0" opacity=".6" />
        {/* Hojas */}
        <path d="M16 17c-1.5-3 .5-6 4-6 .5 3-1 5.5-4 6Z" opacity=".8" />
        <path d="M26 15c1-3.2 4.4-4.4 7-2.6-1 3-4 4.5-7 2.6Z" opacity=".8" />
        <path d="M20 20c.5-2.6 3-4 5.4-3-.2 2.6-2.6 4-5.4 3Z" opacity=".6" />
      </g>
    </svg>
  )
}

/** Plato de pasta con tenedor enrollado: especialidades de la Nonna */
export function IconoPasta({ className = '' }: Props) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <g {...base}>
        {/* Plato */}
        <ellipse cx="22" cy="30" rx="18" ry="7" />
        <ellipse cx="22" cy="28" rx="18" ry="7" opacity=".5" />
        {/* Nido de pasta */}
        <path d="M13 24c4-3 6 3 10 0s6 3 10 0" opacity=".8" />
        <path d="M15 20c3-2.4 5 2 8 0s5 2 8 0" opacity=".6" />
        {/* Tenedor enrollando */}
        <path d="M38 8v8M35 8v8M38 8v-4M35 8v-4M36.5 16v10" />
      </g>
    </svg>
  )
}

/** Bandeja/menú: promo almuerzo */
export function IconoPromo({ className = '' }: Props) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <g {...base}>
        {/* Bandeja */}
        <rect x="6" y="14" width="36" height="24" rx="3" />
        {/* Divisiones */}
        <path d="M6 26h36M20 14v24" opacity=".55" />
        {/* Etiqueta de precio */}
        <path d="M30 6l6 0 4 4-8 8-6-6 4-6Z" opacity=".8" />
        <circle cx="33" cy="9.5" r="1" opacity=".8" />
      </g>
    </svg>
  )
}

/** Waffle cuadriculado: waffles */
export function IconoWaffle({ className = '' }: Props) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <g {...base}>
        {/* Contorno redondeado */}
        <rect x="8" y="8" width="32" height="32" rx="6" />
        {/* Cuadrícula */}
        <path d="M16 8v32M24 8v32M32 8v32M8 16h32M8 24h32M8 32h32" opacity=".6" />
        {/* Toque de miel */}
        <path d="M24 4c1.5 1.6 1.5 3-.2 4.6" opacity=".7" />
      </g>
    </svg>
  )
}

/** Cono de helado: helados y postres */
export function IconoHelado({ className = '' }: Props) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <g {...base}>
        {/* Bolas de helado */}
        <circle cx="24" cy="14" r="7" />
        <circle cx="24" cy="24" r="8" opacity=".85" />
        {/* Barquillo */}
        <path d="M15 30h18l-7 14a2 2 0 0 1-3.6 0L15 30Z" />
        <path d="M17 33l14 0M18.5 37l11 0" opacity=".5" />
      </g>
    </svg>
  )
}

/** Croissant: pastelería artesanal */
export function IconoPasteleria({ className = '' }: Props) {
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

/** Mapa categoría → ilustración */
export const ICONOS: Record<string, (p: Props) => React.ReactElement> = {
  'Café': IconoCafe,
  'Infusiones y especialidades': IconoTetera,
  'Mocktails Prego': IconoMocktail,
  'Bebidas frías': IconoBebidaFria,
  'Bocatas Prego': IconoBocata,
  'Sándwiches de cocina': IconoSandwich,
  'Tostadas': IconoTostada,
  'Desayunos Prego': IconoDesayuno,
  'Brunchealo': IconoBrunch,
  'Ensaladas': IconoEnsalada,
  'Especialidades de la Nonna': IconoPasta,
  'Hazlo promo almuerzo': IconoPromo,
  'Waffles': IconoWaffle,
  'Helados y postres': IconoHelado,
  'Pastelería artesanal': IconoPasteleria,
}
