'use client'

import { usePathname, useRouter } from 'next/navigation'
import { supabaseBrowser } from '@/lib/supabase/client'

const SECCIONES = [
  { href: '/admin/eventos', label: 'Eventos' },
  { href: '/admin/reservas', label: 'Reserva bingos' },
]

// Cabecera compartida entre todas las páginas de /admin: título, pestañas
// de navegación y cierre de sesión.
export default function AdminNav() {
  const pathname = usePathname()
  const router = useRouter()

  async function cerrarSesion() {
    await supabaseBrowser().auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <div className="mx-auto mb-8 max-w-3xl">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-salvia-800">Panel de administración</h1>
          <p className="mt-1 text-sm text-salvia-700">
            Gestión de eventos, reservas y control de acceso.
          </p>
        </div>
        <button
          onClick={cerrarSesion}
          className="shrink-0 rounded-lg border border-salvia-100 px-3 py-1.5 text-sm font-medium text-salvia-700 hover:bg-salvia-50"
        >
          Cerrar sesión
        </button>
      </div>

      <nav className="mt-5 flex flex-wrap gap-1.5 border-b border-salvia-100 pb-4">
        {SECCIONES.map((s) => {
          const activo = pathname.startsWith(s.href)
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
      </nav>
    </div>
  )
}
