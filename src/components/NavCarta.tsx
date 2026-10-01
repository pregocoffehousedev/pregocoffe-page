'use client'

import { useEffect, useRef, useState } from 'react'
import { slugCategoria } from './GrupoCarta'

// Barra pegajosa de chips para saltar directo a una categoría de la carta.
// Resalta el chip de la sección visible mientras el usuario hace scroll.
export default function NavCarta({ categorias }: { categorias: readonly string[] }) {
  const [activa, setActiva] = useState(categorias[0])
  const chipsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const secciones = categorias
      .map((c) => document.getElementById(slugCategoria(c)))
      .filter((el): el is HTMLElement => el !== null)

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
        if (visible) setActiva(visible.target.id)
      },
      { rootMargin: '-120px 0px -70% 0px', threshold: 0 },
    )

    secciones.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [categorias])

  useEffect(() => {
    const contenedor = chipsRef.current
    const chipActivo = contenedor?.querySelector<HTMLElement>(`[data-slug="${activa}"]`)
    if (!contenedor || !chipActivo) return
    // No usamos scrollIntoView: en Safari/iOS puede arrastrar el scroll
    // VERTICAL de la página (no solo el horizontal de este contenedor) al
    // intentar centrar el chip, dejando la página trabada al hacer scroll.
    // Desplazamos manualmente solo el scroll horizontal del contenedor.
    const offset =
      chipActivo.offsetLeft -
      contenedor.clientWidth / 2 +
      chipActivo.clientWidth / 2
    contenedor.scrollTo({ left: offset, behavior: 'smooth' })
  }, [activa])

  return (
    <div className="sticky top-16 z-10 -mx-5 border-b border-salvia-100 bg-durazno-50/95 px-5 py-3 backdrop-blur sm:mx-0 sm:rounded-xl sm:border sm:px-3">
      <div ref={chipsRef} className="flex gap-2 overflow-x-auto [scrollbar-width:none]">
        {categorias.map((categoria) => {
          const slug = slugCategoria(categoria)
          return (
            <a
              key={slug}
              href={`#${slug}`}
              data-slug={slug}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                activa === slug
                  ? 'bg-salvia-600 text-white'
                  : 'bg-white text-salvia-700 hover:bg-salvia-50'
              }`}
            >
              {categoria}
            </a>
          )
        })}
      </div>
    </div>
  )
}
