import { TALLERES, LOCAL } from '@/data/local'
import { clp } from '@/lib/format'

/**
 * Talleres del mes. Si el array está vacío la sección no se renderiza,
 * igual que Reseñas: mejor no mostrar la sección que mostrarla sin nada.
 */
export default function Talleres() {
  if (TALLERES.length === 0) return null

  const numero = LOCAL.telefono.replace(/\D/g, '')

  return (
    <section id="talleres" className="scroll-mt-24">
      <header className="text-center">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-salvia-400">
          Este mes en Prego
        </p>
        <h2 className="mt-2 text-3xl font-bold text-salvia-800">Talleres</h2>
        <p className="mx-auto mt-3 max-w-md text-cafe-600">
          Dictados por nuestro equipo y por maestros invitados. Cupos limitados.
        </p>
      </header>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {TALLERES.map((t) => {
          const mensaje = encodeURIComponent(
            `Hola! Quiero inscribirme al taller "${t.nombre}" (${t.fecha}).`,
          )
          return (
            <article
              key={t.nombre}
              className="flex flex-col rounded-2xl border border-salvia-100 bg-white p-6"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-medium text-salvia-600">{t.fecha}</p>
                {t.externo && (
                  <span className="shrink-0 rounded-full bg-durazno-100 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wide text-durazno-700">
                    Instructor invitado
                  </span>
                )}
              </div>

              <h3 className="mt-2 text-lg font-bold text-salvia-800">{t.nombre}</h3>
              <p className="mt-1.5 flex-1 text-sm text-cafe-600">{t.desc}</p>

              <dl className="mt-4 flex items-center justify-between border-t border-salvia-100 pt-3 text-sm">
                <div>
                  <dt className="text-cafe-400">Con</dt>
                  <dd className="font-medium text-cafe-700">{t.instructor}</dd>
                </div>
                <div className="text-right">
                  <dt className="text-cafe-400">Cupos</dt>
                  <dd className="font-medium text-cafe-700">{t.cupos}</dd>
                </div>
              </dl>

              <a
                href={`https://wa.me/${numero}?text=${mensaje}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 flex items-center justify-center gap-2 rounded-full bg-salvia-600 px-6 py-2.5 text-sm font-semibold text-durazno-50 transition hover:bg-salvia-700"
              >
                Inscribirme · {clp(t.precio)}
              </a>
            </article>
          )
        })}
      </div>
    </section>
  )
}
