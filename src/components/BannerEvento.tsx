import { supabasePublic, type Evento } from '@/lib/supabase'
import { clp, fechaLarga } from '@/lib/format'
import DisponibilidadBanner from './DisponibilidadBanner'

function ventaAbierta(evento: Evento) {
  return !evento.venta_abre_en || new Date(evento.venta_abre_en).getTime() <= Date.now()
}

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

  const yaPaso = evento ? new Date(evento.fecha).getTime() < Date.now() : false

  if (!evento || yaPaso) {
    return (
      <section className="overflow-hidden rounded-2xl border border-salvia-200 bg-salvia-600">
        <div className="p-8 text-center sm:p-12">
          <span className="inline-block rounded-full bg-durazno-100/20 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-durazno-100">
            Próximo Bingo
          </span>
          <h2 className="mt-4 text-3xl font-bold text-durazno-50 sm:text-4xl">
            Próximamente anunciaremos el siguiente Bingo
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-durazno-100/90">
            Síguenos en Instagram para enterarte apenas abramos las entradas del próximo bingo.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-salvia-200 bg-salvia-600">
      <div className="grid items-center gap-8 p-8 sm:p-10 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <span className="inline-block rounded-full bg-durazno-100/20 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-durazno-100">
            Próximo Bingo
          </span>
          <h2 className="mt-4 text-3xl font-bold text-durazno-50 sm:text-4xl">
            {evento.nombre}
          </h2>
          <p className="mt-3 max-w-lg text-durazno-100/90">
            {evento.descripcion ??
              'Una tarde de bingo con premios en plantas. Café de especialidad y pastelería disponibles para comprar aparte.'}
          </p>

          <dl className="mt-6 flex flex-wrap gap-3">
            <div className="rounded-xl bg-durazno-50/15 px-4 py-3">
              <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-durazno-100/80">
                Cuándo
              </dt>
              <dd className="mt-0.5 text-lg font-bold capitalize text-durazno-50">
                {fechaLarga(evento.fecha)}
              </dd>
            </div>
            <div className="rounded-xl bg-durazno-50/15 px-4 py-3">
              <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-durazno-100/80">
                Valor
              </dt>
              <dd className="mt-0.5 text-lg font-bold text-durazno-50">
                {clp(evento.precio_clp)}
              </dd>
            </div>
          </dl>
        </div>

        <div className="rounded-xl bg-durazno-50 p-6 text-center">
          {ventaAbierta(evento) ? (
            <DisponibilidadBanner
              eventoId={evento.id}
              capacidadTotal={evento.capacidad_total}
              entradasVendidasInicial={evento.entradas_vendidas}
            />
          ) : (
            <div>
              <p className="text-sm font-semibold text-cafe-700">
                Venta de entradas desde el
              </p>
              <p className="mt-0.5 text-sm text-cafe-600">
                {fechaLarga(evento.venta_abre_en!)}
              </p>
            </div>
          )}

          <a
            href="/evento"
            className="mt-4 block rounded-full bg-salvia-600 px-6 py-3 font-medium text-durazno-50 transition hover:bg-salvia-700"
          >
            {ventaAbierta(evento) ? 'Comprar entradas →' : 'Ver detalles →'}
          </a>
          <p className="mt-3 text-xs text-cafe-400">Pago seguro por transferencia</p>
        </div>
      </div>
    </section>
  )
}
