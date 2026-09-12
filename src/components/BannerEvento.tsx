import { supabasePublic, type Evento } from '@/lib/supabase'
import { clp, fechaLarga } from '@/lib/format'
import DisponibilidadBanner from './DisponibilidadBanner'

const SLUG = process.env.NEXT_PUBLIC_EVENTO_SLUG || 'plantitas-y-cafe-4'

/**
 * Banner del próximo evento. Lee el estado real desde Supabase, así el
 * contador de cupos coincide con la página de compra.
 * Si la base no está configurada aún, cae a un texto genérico.
 */
export default async function BannerEvento() {
  let evento: Evento | null = null
  try {
    const { data } = await supabasePublic()
      .from('eventos')
      .select('*')
      .eq('slug', SLUG)
      .single<Evento>()
    evento = data
  } catch {
    evento = null
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-salvia-200 bg-salvia-600">
      <div className="grid items-center gap-8 p-8 sm:p-10 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <span className="inline-block rounded-full bg-durazno-100/20 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-durazno-100">
            Próximo evento
          </span>
          <h2 className="mt-4 text-3xl font-bold text-durazno-50 sm:text-4xl">
            {evento?.nombre ?? 'Plantitas & Café — Bingo de Plantas 4.0'}
          </h2>
          <p className="mt-3 max-w-lg text-durazno-100/90">
            {evento?.descripcion ??
              'Una tarde de bingo con premios en plantas. Café de especialidad y pastelería disponibles para comprar aparte.'}
          </p>

          {evento && (
            <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-2 text-sm text-durazno-100">
              <div>
                <dt className="opacity-70">Cuándo</dt>
                <dd className="font-medium">{fechaLarga(evento.fecha)}</dd>
              </div>
              <div>
                <dt className="opacity-70">Valor</dt>
                <dd className="font-medium">{clp(evento.precio_clp)}</dd>
              </div>
            </dl>
          )}
        </div>

        <div className="rounded-xl bg-durazno-50 p-6 text-center">
          {evento && (
            <DisponibilidadBanner
              eventoId={evento.id}
              capacidadTotal={evento.capacidad_total}
              entradasVendidasInicial={evento.entradas_vendidas}
            />
          )}

          <a
            href="/evento"
            className="mt-4 block rounded-full bg-salvia-600 px-6 py-3 font-medium text-durazno-50 transition hover:bg-salvia-700"
          >
            Comprar entradas →
          </a>
          <p className="mt-3 text-xs text-cafe-400">Pago seguro por transferencia</p>
        </div>
      </div>
    </section>
  )
}
