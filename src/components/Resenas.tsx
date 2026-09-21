import { RESENAS, GOOGLE_MAPS_URL } from '@/data/local'

function Estrellas({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${n} de 5 estrellas`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className={`h-4 w-4 ${i < n ? 'text-durazno-600' : 'text-salvia-100'}`}
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M10 1.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8-5.3-2.8-5.3 2.8 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
        </svg>
      ))}
    </div>
  )
}

/**
 * Reseñas de clientes. Si el array está vacío la sección no se
 * renderiza, así el sitio nunca muestra testimonios de relleno.
 */
export default function Resenas() {
  if (RESENAS.length === 0) return null

  return (
    <section id="resenas" className="scroll-mt-24">
      <header className="text-center">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-salvia-400">
          Lo que dicen
        </p>
        <h2 className="mt-2 text-3xl font-bold text-salvia-800">
          Nuestros clientes
        </h2>
      </header>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {RESENAS.map((r) => (
          <figure
            key={`${r.autor}-${r.texto.slice(0, 24)}`}
            className="flex flex-col rounded-2xl border border-salvia-100 bg-white p-6"
          >
            <Estrellas n={r.estrellas} />
            <blockquote className="mt-4 flex-1 text-cafe-700">
              “{r.texto}”
            </blockquote>
            <figcaption className="mt-4 border-t border-salvia-100 pt-3 text-sm">
              <span className="font-medium text-salvia-800">{r.autor}</span>
              {r.fuente && (
                <span className="text-cafe-400"> · {r.fuente}</span>
              )}
            </figcaption>
          </figure>
        ))}
      </div>

      <p className="mt-8 text-center">
        <a
          href={GOOGLE_MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-salvia-700 underline underline-offset-4 hover:text-salvia-800"
        >
          Ver todas las reseñas en Google Maps →
        </a>
      </p>
    </section>
  )
}
