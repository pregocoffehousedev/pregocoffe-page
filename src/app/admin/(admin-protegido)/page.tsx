const SECCIONES = [
  {
    href: '/admin/eventos',
    titulo: 'Eventos',
    desc: 'Crear, editar, activar/desactivar y eliminar eventos (bingos y talleres): fecha, precio, cupos.',
  },
  {
    href: '/admin/reservas',
    titulo: 'Reservas',
    desc: 'Ver todas las reservas, confirmar pagos por transferencia, editar, cancelar y validar entradas en la puerta.',
  },
]

export default function AdminPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-xl font-bold text-salvia-800">Panel de administración</h1>
      <p className="mt-1 text-sm text-salvia-700">
        Gestión de eventos, reservas y control de acceso.
      </p>

      <ul className="mt-8 space-y-3">
        {SECCIONES.map((s) => (
          <li key={s.href}>
            <a
              href={s.href}
              className="block rounded-xl border border-salvia-100 bg-white p-5 transition hover:border-salvia-400"
            >
              <p className="font-semibold text-salvia-800">{s.titulo}</p>
              <p className="mt-1 text-sm text-cafe-600">{s.desc}</p>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
