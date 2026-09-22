'use client'

import { usePathname } from 'next/navigation'
import { LOCAL } from '@/data/local'
import { useBingoVigente } from '@/lib/useBingoVigente'

// Footer del sitio público. No se muestra en /admin: es contenido para
// visitantes, no para el equipo gestionando el panel.
export default function SiteFooter() {
  const pathname = usePathname()
  const bingoVigente = useBingoVigente()
  if (pathname.startsWith('/admin')) return null

  return (
    <footer className="mt-20 border-t border-salvia-100 bg-white/50">
      <div className="grid w-full gap-8 px-5 py-12 sm:grid-cols-3 sm:px-8 lg:px-12">
        <div className="text-center sm:text-left">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logos/prego-footer.png"
            alt="Prego Coffee House"
            className="mx-auto h-28 w-52 rounded-xl object-cover sm:mx-0"
          />
          <p className="mt-3 text-sm text-cafe-600">
            {LOCAL.descriptor}.
          </p>
        </div>

        <div className="text-sm">
          <p className="font-semibold text-salvia-800">Visítanos</p>
          <address className="mt-3 space-y-1 not-italic text-cafe-600">
            <p>{LOCAL.direccion}</p>
            <p>{LOCAL.comuna}</p>
            <a
              href={`tel:${LOCAL.telefono}`}
              className="block transition hover:text-salvia-700"
            >
              {LOCAL.telefonoVisible}
            </a>
            <a
              href={`mailto:${LOCAL.email}`}
              className="block transition hover:text-salvia-700"
            >
              {LOCAL.email}
            </a>
          </address>
        </div>

        <div className="hidden text-sm sm:block">
          <p className="font-semibold text-salvia-800">Enlaces</p>
          <ul className="mt-3 space-y-1.5 text-cafe-600">
            {[
              ['Carta', '/#carta'],
              ['Para llevar', '/#para-llevar'],
              ['Galería', '/#galeria'],
              ['Coffee Break corporativo', '/#eventos'],
              ...(bingoVigente ? [['Entradas Bingo', '/evento']] : []),
            ].map(([texto, href]) => (
              <li key={href}>
                <a href={href} className="transition hover:text-salvia-700">
                  {texto}
                </a>
              </li>
            ))}
            <li>
              <a
                href={`https://instagram.com/${LOCAL.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-salvia-700"
              >
                Instagram
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-salvia-100 py-5 text-center text-xs text-salvia-400">
        © {new Date().getFullYear()} {LOCAL.nombre} · Todos los derechos reservados
        <br className="sm:hidden" />
        <span className="sm:before:content-['·'] sm:before:mx-2">
          Página creada por{' '}
          <a
            href="https://my-portfolio-three-eta-88.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-2 hover:text-salvia-600"
          >
            karcabcas
          </a>
        </span>
      </div>
    </footer>
  )
}
