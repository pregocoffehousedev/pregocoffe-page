import { supabasePublic, type Evento } from '@/lib/supabase'
import { clp, fechaLarga } from '@/lib/format'
import { LOCAL } from '@/data/local'

/**
 * Talleres del mes: eventos reales con categoría "taller" y activo=true.
 * Solo informativos — la inscripción se coordina por Instagram, no hay
 * reserva/pago propio como en los bingos.
 * Si no hay ninguno, la sección no se renderiza (igual que Reseñas).
 */
export default async function Talleres() {
  let talleres: Evento[] = []
  try {
    const { data } = await supabasePublic()
      .from('eventos')
      .select('*')
      .eq('categoria', 'taller')
      .eq('activo', true)
      .order('fecha', { ascending: true })
    // Un taller ya finalizado desaparece solo de la sección pública, sin
    // depender de que alguien recuerde desactivarlo a mano en el admin.
    talleres = ((data as Evento[] | null) ?? []).filter(
      (t) => new Date(t.fecha).getTime() >= Date.now(),
    )
  } catch (e) {
    console.error('[Talleres] no se pudieron leer los talleres:', e)
  }

  if (talleres.length === 0) return null

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
        {talleres.map((t) => (
          <article
            key={t.id}
            className="flex flex-col rounded-2xl border border-salvia-100 bg-white p-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-medium text-salvia-600">{fechaLarga(t.fecha)}</p>
              {t.agotado && (
                <span className="shrink-0 rounded-full bg-cafe-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cafe-600">
                  Agotado
                </span>
              )}
            </div>

            <h3 className="mt-2 text-lg font-bold text-salvia-800">{t.nombre}</h3>
            {t.descripcion && (
              <p className="mt-1.5 flex-1 text-sm text-cafe-600">{t.descripcion}</p>
            )}

            <dl className="mt-4 flex items-center justify-between border-t border-salvia-100 pt-3 text-sm">
              {t.instructor && (
                <div>
                  <dt className="text-cafe-400">Con</dt>
                  <dd className="font-medium text-cafe-700">{t.instructor}</dd>
                </div>
              )}
              <div className="text-right">
                <dt className="text-cafe-400">Valor</dt>
                <dd className="font-medium text-cafe-700">{clp(t.precio_clp)}</dd>
              </div>
            </dl>

            {t.agotado ? (
              <p className="mt-5 flex items-center justify-center rounded-full bg-salvia-50 px-6 py-2.5 text-sm font-semibold text-salvia-400">
                Sin cupos disponibles
              </p>
            ) : (
              <a
                href={`https://instagram.com/${t.instructor_instagram || LOCAL.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 flex items-center justify-center gap-2 rounded-full bg-salvia-600 px-6 py-2.5 text-sm font-semibold text-durazno-50 transition hover:bg-salvia-700"
              >
                {t.instructor_instagram
                  ? `Inscribirme con @${t.instructor_instagram}`
                  : 'Inscribirme por Instagram'}
              </a>
            )}
          </article>
        ))}
      </div>
    </section>
  )
}
