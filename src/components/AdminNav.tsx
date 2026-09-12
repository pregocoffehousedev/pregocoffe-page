'use client'

import { usePathname, useRouter } from 'next/navigation'
import { supabaseBrowser } from '@/lib/supabase/client'

const SECCIONES = [
  { href: '/admin', label: 'Inicio' },
  { href: '/admin/eventos', label: 'Eventos' },
  { href: '/admin/reservas', label: 'Reservas' },
]

// Barra de navegación compartida entre todas las páginas de /admin, para
// poder moverse entre secciones sin depender del botón "atrás" del navegador.
export default function AdminNav() {
  const pathname = usePathname()
  const router = useRouter()

  async function cerrarSesion() {
    await supabaseBrowser().auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <nav className="mx-auto mb-8 flex max-w-3xl flex-wrap items-center justify-between gap-3 border-b border-salvia-100 pb-4">
      <div className="flex flex-wrap gap-1.5">
        {SECCIONES.map((s) => {
          const activo = s.href === '/admin' ? pathname === '/admin' : pathname.startsWith(s.href)
          return (
            <a
              key={s.href}
              href={s.href}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                activo
                  ? 'bg-salvia-600 text-white'
                  : 'text-salvia-700 hover:bg-salvia-50'
              }`}
            >
              {s.label}
            </a>
          )
        })}
      </div>
      <button
        onClick={cerrarSesion}
        className="shrink-0 rounded-lg border border-salvia-100 px-3 py-1.5 text-sm font-medium text-salvia-700 hover:bg-salvia-50"
      >
        Cerrar sesión
      </button>
    </nav>
  )
}
