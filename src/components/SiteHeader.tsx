'use client'

import { usePathname, useRouter } from 'next/navigation'
import { supabaseBrowser } from '@/lib/supabase/client'
import { useBingoVigente } from '@/lib/useBingoVigente'

// Header compartido. En /admin, el botón "Entradas" (irrelevante para el
// equipo, ya que ahí mismo se gestionan los eventos) se reemplaza por
// "Cerrar sesión", visible siempre arriba sin depender del scroll.
export default function SiteHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const enAdmin = pathname.startsWith('/admin')
  const enInicioAdmin = pathname === '/admin'
  const bingoVigente = useBingoVigente()

  async function cerrarSesion() {
    await supabaseBrowser().auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <header className="border-b border-salvia-100 bg-durazno-50/85 backdrop-blur sticky top-0 z-20">
      <nav className="flex w-full items-center justify-between px-5 py-4 sm:px-8 lg:px-12">
        <a href={enAdmin ? '/admin' : '/'} className="flex items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/fotos/logo-prego-rect.png" alt="Prego Coffee House" className="h-9 w-auto" />
        </a>
        <div className="flex items-center gap-2 sm:gap-3">
          {enAdmin && !enInicioAdmin && (
            <a
              href="/admin"
              className="inline-flex items-center gap-1 text-sm font-medium text-salvia-700 hover:text-salvia-800"
            >
              ← Volver
            </a>
          )}
          {!enAdmin && (
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
          )}
          {enAdmin ? (
            <button
              onClick={cerrarSesion}
              className="rounded-full border border-salvia-100 px-4 py-2 text-sm font-medium text-salvia-700 transition hover:bg-salvia-50"
            >
              Cerrar sesión
            </button>
          ) : bingoVigente ? (
            <a
              href="/evento"
              className="rounded-full bg-salvia-600 px-4 py-2 text-sm font-medium text-durazno-50 transition hover:bg-salvia-700"
            >
              Entradas
            </a>
          ) : null}
        </div>
      </nav>
    </header>
  )
}
