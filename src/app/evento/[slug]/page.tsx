import { notFound } from 'next/navigation'
import { supabasePublic, type Evento } from '@/lib/supabase'
import { fechaLarga } from '@/lib/format'
import { LOCAL } from '@/data/local'
import FormularioCompra from '@/components/FormularioCompra'
import DisponibilidadEvento from '@/components/DisponibilidadEvento'

// ISR: la página se sirve desde el CDN y se regenera cada 30s.
// 150 personas recargando NO golpean la base de datos.
export const revalidate = 30

const INCLUYE = [
  { t: 'Cartón de bingo', d: 'Un cartón por entrada para todas las rondas.' },
  { t: 'Premios en plantas', d: 'Suculentas, macetas y plantas de interior.' },
]

const APARTE = [
  { t: 'Café o bebida', d: 'A elección de la carta de la casa.' },
  { t: 'Algo dulce', d: 'De nuestra panadería, recién horneado.' },
]

// Solo bingos tienen flujo de compra/reserva propio. Los talleres son
// informativos y se inscriben por Instagram (ver components/Talleres.tsx).
export default async function EventoPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  let evento: Evento | null = null
  try {
    const { data } = await supabasePublic()
      .from('eventos')
      .select('*')
      .eq('slug', slug)
      .eq('categoria', 'bingo')
      .eq('activo', true)
      .single<Evento>()
    evento = data
  } catch (e) {
    console.error('[evento/:slug] no se pudo leer el evento:', e)
  }

  if (!evento) {
    notFound()
  }

  const yaPaso = new Date(evento.fecha).getTime() < Date.now()

  if (yaPaso) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-salvia-100 bg-white p-10 text-center">
        <p className="text-2xl">🌱</p>
        <h1 className="mt-3 text-xl font-bold text-salvia-800">
          Próximamente anunciaremos el siguiente bingo
        </h1>
        <p className="mt-2 text-sm text-cafe-600">
          Síguenos en Instagram para enterarte apenas abran las entradas del próximo.
        </p>
        <a
          href="/"
          className="mt-6 inline-block rounded-full bg-salvia-600 px-6 py-2.5 text-sm font-medium text-durazno-50 transition hover:bg-salvia-700"
        >
          Volver al inicio
        </a>
      </div>
    )
  }

  return (
    <div className="space-y-12">
      {/* ---------- Cabecera con ilustración de fondo ---------- */}
      <header className="relative -mx-5 overflow-hidden border-y border-salvia-900/10 bg-durazno-50 sm:mx-0 sm:rounded-2xl sm:border">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center opacity-90"
          style={{ backgroundImage: "url('/fotos/plantas-coffe.jpeg')" }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(250,247,243,.4) 0%, rgba(250,247,243,.85) 55%, rgba(250,247,243,.97) 100%)',
          }}
        />
        <div className="relative z-10 px-6 py-16 text-center sm:py-20">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/fotos/logo-prego-rect.png"
            alt="Prego Coffee House"
            className="mx-auto h-14 w-auto sm:h-16"
          />
          <h1 className="mx-auto mt-4 max-w-2xl font-oswald text-3xl font-bold uppercase tracking-tight text-salvia-800 sm:text-[2.3rem] sm:leading-[1.15]">
            {evento.nombre}
          </h1>

          <dl className="mt-7 flex flex-col items-center justify-center gap-4 lg:flex-row lg:gap-x-10">
            <div className="flex flex-col items-center gap-1 lg:flex-row lg:gap-3">
              <dt className="font-oswald text-lg uppercase tracking-wide text-salvia-700/70 sm:text-xl">
                Cuándo
              </dt>
              <dd className="text-sm font-semibold text-salvia-800 sm:text-base">
                {fechaLarga(evento.fecha)}
              </dd>
            </div>
            <span className="hidden h-4 w-px bg-salvia-900/15 lg:block" />
            <div className="flex flex-col items-center gap-1 lg:flex-row lg:gap-3">
              <dt className="font-oswald text-lg uppercase tracking-wide text-salvia-700/70 sm:text-xl">
                Dónde
              </dt>
              <dd className="text-sm font-semibold text-salvia-800 sm:text-base">{evento.lugar}</dd>
            </div>
          </dl>
        </div>
      </header>

      <div className="grid gap-10 lg:grid-cols-[1fr_26rem] lg:items-start">
        {/* ---------- Columna informativa ---------- */}
        <div className="space-y-8">
          {evento.descripcion && (
            <p className="text-lg leading-relaxed text-cafe-700">
              {evento.descripcion}
            </p>
          )}

          {/* Disponibilidad — se actualiza sola en vivo (Supabase Realtime) */}
          <DisponibilidadEvento
            eventoId={evento.id}
            capacidadTotal={evento.capacidad_total}
            entradasVendidasInicial={evento.entradas_vendidas}
          />

          {/* Qué incluye */}
          <div>
            <h2 className="text-lg font-semibold text-salvia-800">
              Qué incluye tu entrada
            </h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {INCLUYE.map((i) => (
                <li
                  key={i.t}
                  className="rounded-xl border border-salvia-100 bg-white p-4"
                >
                  <p className="font-medium text-salvia-800">{i.t}</p>
                  <p className="mt-1 text-sm text-cafe-600">{i.d}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* No incluido: se compra aparte en el local el mismo día */}
          <div>
            <h2 className="text-lg font-semibold text-salvia-800">
              Para comprar aparte
            </h2>
            <p className="mt-1 text-sm text-cafe-600">
              No vienen incluidos en el valor de la entrada.
            </p>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {APARTE.map((i) => (
                <li
                  key={i.t}
                  className="rounded-xl border border-dashed border-salvia-200 bg-durazno-50/40 p-4"
                >
                  <p className="font-medium text-salvia-800">{i.t}</p>
                  <p className="mt-1 text-sm text-cafe-600">{i.d}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Cómo funciona */}
          <div>
            <h2 className="text-lg font-semibold text-salvia-800">Cómo funciona</h2>
            <ol className="mt-4 space-y-4">
              {[
                ['Compra tu entrada', 'Reserva tu cupo y transfiere el monto. Tienes 5 minutos para avisarnos por WhatsApp.'],
                ['Recibe tu entrada', 'Apenas confirmamos tu pago, te la enviamos por el mismo WhatsApp.'],
                ['Preséntalo en la puerta', 'Impreso o desde tu teléfono. Cada código sirve una sola vez.'],
              ].map(([t, d], i) => (
                <li key={t} className="flex gap-4">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-salvia-100 text-sm font-semibold text-salvia-700">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-medium text-salvia-800">{t}</p>
                    <p className="mt-0.5 text-sm text-cafe-600">{d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <p className="text-sm text-cafe-600">
            ¿Dudas? Escríbenos por{' '}
            <a
              href={`https://wa.me/${LOCAL.telefono.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-salvia-700 underline underline-offset-4"
            >
              WhatsApp
            </a>{' '}
            o pásate por {LOCAL.direccion}, {LOCAL.comuna}.
          </p>
        </div>

        {/* ---------- Formulario (sticky en desktop) ---------- */}
        <div className="lg:sticky lg:top-24">
          <FormularioCompra
            slug={evento.slug}
            eventoId={evento.id}
            precio={evento.precio_clp}
            maxPorCompra={evento.max_por_compra}
            capacidadTotal={evento.capacidad_total}
            entradasVendidasInicial={evento.entradas_vendidas}
            ventaAbreEn={evento.venta_abre_en}
          />
        </div>
      </div>
    </div>
  )
}
