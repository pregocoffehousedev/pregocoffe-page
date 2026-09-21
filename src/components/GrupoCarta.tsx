import { clp } from '@/lib/format'
import { ICONOS } from './IconosCarta'
import type { CARTA } from '@/data/local'

type Grupo = (typeof CARTA)[number]

// Mismo slug que genera NavCarta, para que el anchor y el chip coincidan.
export function slugCategoria(categoria: string) {
  return categoria
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export default function GrupoCarta({ grupo }: { grupo: Grupo }) {
  const Icono = ICONOS[grupo.categoria]

  return (
    <div
      id={slugCategoria(grupo.categoria)}
      className="scroll-mt-28 rounded-2xl border border-salvia-100 bg-white p-6 sm:p-7"
    >
      {/* Cabecera con la ilustración */}
      <div className="flex items-center gap-4 border-b border-salvia-100 pb-4">
        {Icono && (
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-salvia-50 text-salvia-600">
            <Icono className="h-10 w-10" />
          </span>
        )}
        <h3 className="text-lg font-semibold text-salvia-800">{grupo.categoria}</h3>
      </div>

      <ul className="mt-5 space-y-3.5">
        {grupo.items.map((item) => (
          <li key={item.nombre} className="flex items-baseline gap-3">
            <div className="min-w-0">
              <p className="font-medium text-cafe-900">{item.nombre}</p>
              {item.desc && <p className="text-sm text-cafe-600">{item.desc}</p>}
            </div>
            <span className="mt-2 h-px flex-1 border-b border-dashed border-salvia-200" />
            <span className="shrink-0 font-medium tabular-nums text-salvia-700">
              {item.precio === 'variable' ? 'Consultar' : clp(item.precio)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
