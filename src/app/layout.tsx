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

const OG_IMAGE = {
  url: '/fotos/mosaico-platos.jpg',
  width: 1600,
  height: 899,
  alt: 'Platos de Prego Coffee House: tostadas, ensaladas y desayunos artesanales',
}

export const metadata: Metadata = {
  metadataBase: new URL('https://pregocoffeehouse.cl'),
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
    images: [OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Prego Coffee House · Talca',
    description: 'Cafetería de especialidad y panadería artesanal.',
    images: [OG_IMAGE.url],
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
