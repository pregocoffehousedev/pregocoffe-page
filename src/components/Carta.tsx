import { CARTA } from '@/data/local'
import { clp } from '@/lib/format'
import { ICONOS } from './IconosCarta'

export default function Carta() {
  return (
    <section id="carta" className="scroll-mt-24">
      <header className="text-center">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-salvia-400">
          Nuestra carta
        </p>
        <h2 className="mt-2 text-3xl font-bold text-salvia-800">Para tomar y comer</h2>
      </header>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {CARTA.map((grupo) => {
          const Icono = ICONOS[grupo.categoria]

          return (
            <div
              key={grupo.categoria}
              className="rounded-2xl border border-salvia-100 bg-white p-6 sm:p-7"
            >
              {/* Cabecera con la ilustración */}
              <div className="flex items-center gap-4 border-b border-salvia-100 pb-4">
                {Icono && (
                  <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-salvia-50 text-salvia-600">
                    <Icono className="h-10 w-10" />
                  </span>
                )}
                <h3 className="text-lg font-semibold text-salvia-800">
                  {grupo.categoria}
                </h3>
              </div>

              <ul className="mt-5 space-y-3.5">
                {grupo.items.map((item) => (
                  <li key={item.nombre} className="flex items-baseline gap-3">
                    <div className="min-w-0">
                      <p className="font-medium text-cafe-900">{item.nombre}</p>
                      <p className="text-sm text-cafe-600">{item.desc}</p>
                    </div>
                    <span className="mt-2 h-px flex-1 border-b border-dashed border-salvia-200" />
                    <span className="shrink-0 font-medium tabular-nums text-salvia-700">
                      {clp(item.precio)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>

      <p className="mt-8 text-center text-xs text-cafe-400">
        Precios en pesos chilenos, IVA incluido. La vitrina cambia según la temporada.
      </p>
    </section>
  )
}
