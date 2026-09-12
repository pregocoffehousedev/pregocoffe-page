import { LOCAL } from '@/data/local'
import Horarios from './Horarios'

export default function Visitanos() {
  const query = encodeURIComponent(`${LOCAL.direccion}, ${LOCAL.comuna}`)
  const comoLlegar = `https://www.google.com/maps/dir/?api=1&destination=${query}`
  // Mapa embebido sin API key: usa el modo `q=` de Google Maps.
  const mapa = `https://maps.google.com/maps?q=${LOCAL.coords.lat},${LOCAL.coords.lng}&z=16&output=embed`

  return (
    <section id="visitanos" className="scroll-mt-24">
      <header className="text-center">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-salvia-400">
          Dónde estamos
        </p>
        <h2 className="mt-2 text-3xl font-bold text-salvia-800">Visítanos</h2>
      </header>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Mapa */}
        <div className="overflow-hidden rounded-2xl border border-salvia-100 bg-white">
          <iframe
            src={mapa}
            title={`Mapa de ${LOCAL.nombre}`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-72 w-full border-0 sm:h-[22rem]"
          />
          <div className="flex flex-wrap items-center justify-between gap-3 p-5">
            <div>
              <p className="font-medium text-cafe-900">{LOCAL.direccion}</p>
              <p className="text-sm text-cafe-600">{LOCAL.comuna}</p>
            </div>
            <a
              href={comoLlegar}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-salvia-600 px-5 py-2.5 text-sm font-medium text-durazno-50 transition hover:bg-salvia-700"
            >
              Cómo llegar →
            </a>
          </div>
        </div>

        <Horarios />
      </div>
    </section>
  )
}
