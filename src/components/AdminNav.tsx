'use client'

import { usePathname } from 'next/navigation'

const SECCIONES = [
  { href: '/admin/eventos', label: 'Eventos' },
  { href: '/admin/reservas', label: 'Reserva bingos' },
]

// Cabecera compartida entre todas las páginas de /admin: título y pestañas
// de navegación entre secciones. El botón de volver y el cierre de sesión
// viven en el header del sitio (ver SiteHeader).
export default function AdminNav() {
  const pathname = usePathname()

  return (
    <div className="mx-auto mb-8 max-w-3xl">
      <h1 className="text-xl font-bold text-salvia-800">Panel de administración</h1>
      <p className="mt-1 text-sm text-salvia-700">
        Gestión de eventos, reservas y control de acceso.
      </p>

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
