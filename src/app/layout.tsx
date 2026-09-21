import type { Metadata } from 'next'
import './globals.css'
import LogoPrego from '@/components/LogoPrego'
import { LOCAL } from '@/data/local'
import DatosEstructurados from '@/components/DatosEstructurados'
import BotonWhatsApp from '@/components/BotonWhatsApp'

export const metadata: Metadata = {
  title: 'Pregò Coffee House — Cafetería de especialidad y panadería en Talca',
  description:
    'Cafetería de especialidad y panadería artesanal en 1 Sur 899, Talca. Café de origen, pan de masa madre y eventos.',
  openGraph: {
    title: 'Pregò Coffee House · Talca',
    description: 'Cafetería de especialidad y panadería artesanal.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-CL">
      <body>
        <DatosEstructurados />
        <header className="border-b border-salvia-100 bg-durazno-50/85 backdrop-blur sticky top-0 z-20">
          <nav className="flex w-full items-center justify-between px-5 py-4 sm:px-8 lg:px-12">
            <a href="/" className="flex items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/fotos/logo-prego-rect.png" alt="Pregò Coffee House" className="h-9 w-auto" />
            </a>
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="hidden items-center gap-1 md:flex">
                {[
                  ['Nosotros', '/#nosotros'],
                  ['Carta', '/#carta'],
                  ['Galería', '/#galeria'],
                  ['Visítanos', '/#visitanos'],
                ].map(([texto, href]) => (
                  <a
                    key={href}
                    href={href}
                    className="rounded-full px-3 py-2 text-sm font-medium text-cafe-600 transition hover:bg-salvia-50 hover:text-salvia-700"
                  >
                    {texto}
                  </a>
                ))}
              </div>
              <a
                href="/evento"
                className="rounded-full bg-salvia-600 px-4 py-2 text-sm font-medium text-durazno-50 transition hover:bg-salvia-700"
              >
                Entradas
              </a>
            </div>
          </nav>
        </header>
        <main className="w-full px-5 py-10 sm:px-8 lg:px-12">{children}</main>
        <footer className="mt-20 border-t border-salvia-100 bg-white/50">
          <div className="grid w-full gap-8 px-5 py-12 sm:grid-cols-3 sm:px-8 lg:px-12">
            <div>
              <LogoPrego className="h-10 w-auto text-salvia-600" />
              <p className="mt-3 text-xs tracking-[0.3em] text-salvia-700">
                PREGO · COFFEE HOUSE
              </p>
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

            <div className="text-sm">
              <p className="font-semibold text-salvia-800">Enlaces</p>
              <ul className="mt-3 space-y-1.5 text-cafe-600">
                {[
                  ['Carta', '/#carta'],
                  ['Para llevar', '/#para-llevar'],
                  ['Galería', '/#galeria'],
                  ['Coffee Break corporativo', '/#eventos'],
                  ['Entradas Bingo', '/evento'],
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
          </div>
        </footer>
        <BotonWhatsApp />
      </body>
    </html>
  )
}
