import type { Metadata, Viewport } from 'next'
import { Oswald } from 'next/font/google'
import './globals.css'
import DatosEstructurados from '@/components/DatosEstructurados'
import BotonWhatsApp from '@/components/BotonWhatsApp'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'

const oswald = Oswald({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-oswald',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: 'Prego Coffee House — Cafetería de especialidad y panadería en Talca',
  description:
    'Cafetería de especialidad y panadería artesanal en 1 Sur 899, Talca. Café de origen, panadería artesanal y eventos.',
  icons: {
    icon: '/fotos/logo-prego-favicon-final.png',
  },
  openGraph: {
    title: 'Prego Coffee House · Talca',
    description: 'Cafetería de especialidad y panadería artesanal.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-CL" className={oswald.variable}>
      <body>
        <DatosEstructurados />
        <SiteHeader />
        <main className="w-full px-5 py-10 sm:px-8 lg:px-12">{children}</main>
        <SiteFooter />
        <BotonWhatsApp />
      </body>
    </html>
  )
}
