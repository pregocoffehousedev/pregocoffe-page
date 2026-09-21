import { LOCAL } from '@/data/local'

const PILARES = [
  {
    t: 'Grano de especialidad',
    d: 'Seleccionamos lotes pequeños y los preparamos en métodos que respetan el origen.',
  },
  {
    t: 'Masa madre de 24 horas',
    d: 'Fermentación lenta para un pan con más sabor y mejor digestión.',
  },
  {
    t: 'Horneado cada mañana',
    d: 'Croissants, roles y panes salen del horno el mismo día que los sirves.',
  },
]

export default function SobreNosotros() {
  return (
    <section id="nosotros" className="scroll-mt-24">
      {/*
        Envolvemos todo en una tarjeta con borde: sin ella, en pantallas
        muy anchas la foto se estira demasiado y el texto queda flotando
        sin nada que lo contenga.
      */}
      <div className="overflow-hidden rounded-2xl border border-salvia-100 bg-white">
        <div className="grid lg:grid-cols-2">
          <div className="relative min-h-[20rem] lg:min-h-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/fotos/mosaico-platos.jpg"
              alt="Avocado toast, ensalada y huevos con tocino recién servidos"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>

          <div className="flex items-center p-8 sm:p-12">
            {/* max-w mantiene el párrafo legible aunque la columna sea ancha */}
            <div className="max-w-lg">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-salvia-400">
                Nuestra historia
              </p>
              <h2 className="mt-2 text-3xl font-bold text-salvia-800">
                Café y pan, hechos con tiempo
              </h2>

              <div className="mt-5 space-y-4 text-cafe-700">
                <p>
                  Abrimos en {LOCAL.comuna} el 2024 con una idea simple: que un
                  café de especialidad y un pan bien fermentado no tienen por
                  qué ser algo de ocasión. Tostamos, laminamos y horneamos con
                  la paciencia que cada cosa pide.
                </p>
                <p>
                  Detrás de la barra hay un equipo pequeño que se sabe los
                  nombres de los clientes habituales y el pedido de memoria.
                  Eso, más que cualquier receta, es lo que hace que la gente
                  vuelva.
                </p>
              </div>

              <ul className="mt-7 space-y-3.5">
                {PILARES.map((p) => (
                  <li key={p.t} className="flex gap-3.5">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-salvia-400" />
                    <div>
                      <p className="font-medium text-salvia-800">{p.t}</p>
                      <p className="text-sm text-cafe-600">{p.d}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
