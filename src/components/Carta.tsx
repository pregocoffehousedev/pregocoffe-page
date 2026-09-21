import { CARTA } from '@/data/local'
import GrupoCarta from './GrupoCarta'

// Adelanto en la home: solo las categorías más representativas. La carta
// completa (15 categorías) vive en /carta para no alargar la home.
const DESTACADAS = new Set(['Café', 'Bocatas Prego', 'Desayunos Prego'])

export default function Carta() {
  const destacadas = CARTA.filter((g) => DESTACADAS.has(g.categoria))

  return (
    <section id="carta" className="scroll-mt-24">
      <header className="text-center">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-salvia-400">
          Nuestra carta
        </p>
        <h2 className="mt-2 text-3xl font-bold text-salvia-800">Para tomar y comer</h2>
      </header>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {destacadas.map((grupo) => (
          <GrupoCarta key={grupo.categoria} grupo={grupo} />
        ))}
      </div>

      <div className="mt-8 text-center">
        <a
          href="/carta"
          className="inline-block rounded-full bg-salvia-600 px-6 py-3 font-medium text-durazno-50 transition hover:bg-salvia-700"
        >
          Ver carta completa →
        </a>
        <p className="mt-3 text-xs text-cafe-400">
          Precios en pesos chilenos, IVA incluido. La vitrina cambia según la temporada.
        </p>
      </div>
    </section>
  )
}
