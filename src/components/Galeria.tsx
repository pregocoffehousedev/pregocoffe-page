import { GALERIA, LOCAL } from '@/data/local'

/**
 * Galería en mosaico. Si una foto aún no existe en /public/galeria/,
 * el navegador muestra el bloque de fondo con el texto alternativo,
 * así la sección nunca se ve rota mientras se cargan las imágenes reales.
 */
export default function Galeria() {
  return (
    <section id="galeria" className="scroll-mt-24">
      <header className="text-center">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-salvia-400">
          El local
        </p>
        <h2 className="mt-2 text-3xl font-bold text-salvia-800">Un vistazo</h2>
      </header>

      <div className="mt-10 grid auto-rows-[11rem] grid-cols-2 gap-3 sm:auto-rows-[13rem] sm:grid-cols-3">
        {GALERIA.map((foto, i) => (
          <figure
            key={foto.src}
            className={`group relative overflow-hidden rounded-xl border border-salvia-100 bg-salvia-50 ${
              // La primera foto de cada fila de 3 ocupa doble alto: rompe la grilla
              i % 3 === 0 ? 'row-span-2' : ''
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={foto.src}
              alt={foto.alt}
              loading="lazy"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
            <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 font-oswald text-sm font-semibold uppercase tracking-wide text-white opacity-0 transition group-hover:opacity-100">
              {foto.alt}
            </figcaption>
          </figure>
        ))}
      </div>

      <p className="mt-6 text-center text-sm text-cafe-600">
        Más fotos en{' '}
        <a
          href={`https://instagram.com/${LOCAL.instagram}`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-salvia-700 underline underline-offset-4 hover:text-salvia-800"
        >
          @{LOCAL.instagram}
        </a>
      </p>
    </section>
  )
}
