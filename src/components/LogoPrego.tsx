/**
 * Isotipo Pregò: espirales entrelazadas que forman un grano de café.
 * Cuatro volutas por lado (dos arriba, dos abajo), espejadas sobre el
 * eje vertical central que hace de hendidura del grano.
 */
export default function LogoPrego({ className = '' }: { className?: string }) {
  // Una voluta: arranca en el eje (x=50), se abre hacia afuera y enrolla.
  // dir = 1 derecha / -1 izquierda · flip = 1 abajo / -1 arriba
  const voluta = (cy: number, dir: number, flip: number) => {
    const x = (v: number) => 50 + v * dir
    const y = (v: number) => cy + v * flip
    return [
      `M50 ${cy}`,
      `C${x(0)} ${y(-11)} ${x(8)} ${y(-18)} ${x(18)} ${y(-18)}`,
      `C${x(28)} ${y(-18)} ${x(35)} ${y(-11)} ${x(35)} ${y(-1)}`,
      `C${x(35)} ${y(8)} ${x(28)} ${y(15)} ${x(20)} ${y(15)}`,
      `C${x(13)} ${y(15)} ${x(7)} ${y(10)} ${x(7)} ${y(3)}`,
      `C${x(7)} ${y(-4)} ${x(12)} ${y(-8)} ${x(18)} ${y(-8)}`,
      `C${x(23)} ${y(-8)} ${x(26)} ${y(-5)} ${x(26)} ${y(-1)}`,
      `C${x(26)} ${y(3)} ${x(24)} ${y(6)} ${x(20)} ${y(6)}`,
    ].join(' ')
  }

  return (
    <svg viewBox="0 0 100 108" fill="none" className={className} aria-label="Pregò">
      <g
        stroke="currentColor"
        strokeWidth="2.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        {/* Eje central: hendidura del grano */}
        <path d="M50 7v94" />

        {/* Superiores */}
        <path d={voluta(31, -1, -1)} />
        <path d={voluta(31, 1, -1)} />
        {/* Inferiores (espejo vertical) */}
        <path d={voluta(77, -1, 1)} />
        <path d={voluta(77, 1, 1)} />
      </g>
    </svg>
  )
}
