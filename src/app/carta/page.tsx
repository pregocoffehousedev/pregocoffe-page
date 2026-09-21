import type { Metadata } from 'next'
import { CARTA } from '@/data/local'
import GrupoCarta from '@/components/GrupoCarta'
import NavCarta from '@/components/NavCarta'

export const metadata: Metadata = {
  title: 'Carta — Pregò Coffee House',
  description: 'Carta completa de Pregò Coffee House: café de especialidad, bocatas, desayunos, pastas y más.',
}

export default function CartaPage() {
  return (
    <div className="space-y-10">
      <div>
        <a
          href="/#carta"
          className="inline-block text-sm font-medium text-salvia-700 underline underline-offset-4 hover:text-salvia-800"
        >
          ← Volver al inicio
        </a>
      </div>

      <header className="text-center">
        <h1 className="text-3xl font-bold text-salvia-800 sm:text-4xl">
          Nuestra carta completa
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-cafe-600">
          Carta de otoño-invierno, con los precios vigentes en nuestro local.
        </p>
      </header>

      <NavCarta categorias={CARTA.map((g) => g.categoria)} />

      <div className="grid gap-6 lg:grid-cols-2">
        {CARTA.map((grupo) => (
          <GrupoCarta key={grupo.categoria} grupo={grupo} />
        ))}
      </div>

      <div className="text-center">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-salvia-400">
          Sabores europeos, alma artesanal
        </p>
        <p className="mt-2 text-xs text-cafe-400">
          Precios en pesos chilenos, IVA incluido. La vitrina cambia según la temporada.
        </p>
      </div>
    </div>
  )
}
