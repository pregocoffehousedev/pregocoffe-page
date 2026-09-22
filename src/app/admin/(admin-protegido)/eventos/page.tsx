'use client'

import { useEffect, useState } from 'react'
import { clp, fechaLarga } from '@/lib/format'

type Categoria = 'bingo' | 'taller'

const CATEGORIAS: readonly { valor: Categoria; label: string }[] = [
  { valor: 'bingo', label: 'Bingo' },
  { valor: 'taller', label: 'Taller' },
]

type Evento = {
  id: string
  slug: string
  nombre: string
  descripcion: string | null
  categoria: Categoria
  instructor: string | null
  instructor_instagram: string | null
  fecha: string
  venta_abre_en: string | null
  lugar: string
  precio_clp: number
  capacidad_total: number
  entradas_vendidas: number
  max_por_compra: number
  activo: boolean
}

type FormEvento = {
  slug: string
  nombre: string
  descripcion: string
  categoria: Categoria
  instructor: string
  instructorInstagram: string
  fecha: string
  ventaAbreEn: string
  lugar: string
  precio_clp: string
  capacidad_total: string
  max_por_compra: string
  activo: boolean
}

const FORM_VACIO: FormEvento = {
  slug: '',
  nombre: '',
  descripcion: '',
  categoria: 'bingo',
  instructor: '',
  instructorInstagram: '',
  fecha: '',
  ventaAbreEn: '',
  lugar: '',
  precio_clp: '',
  capacidad_total: '',
  max_por_compra: '6',
  activo: true,
}

// Convierte un timestamptz ISO a lo que espera <input type="datetime-local">
function aInputDatetime(iso: string) {
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

// La sesión de Google (verificada por el layout de /admin) viaja en cookies:
// los fetch a /api/admin/* no necesitan ningún header manual.
export default function EventosAdminPage() {
  const [eventos, setEventos] = useState<Evento[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [editando, setEditando] = useState<string | null>(null) // id del evento, o 'nuevo'
  const [form, setForm] = useState<FormEvento>(FORM_VACIO)
  const [guardando, setGuardando] = useState(false)
  const [eliminando, setEliminando] = useState<string | null>(null)
  const [filtro, setFiltro] = useState<Categoria | 'todas'>('todas')

  async function cargar() {
    setCargando(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/eventos')
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'No pudimos cargar los eventos.')
        setCargando(false)
        return
      }
      setEventos(data.eventos ?? [])
    } catch {
      setError('Sin conexión.')
    }
    setCargando(false)
  }

  useEffect(() => {
    cargar()
  }, [])

  function abrirNuevo() {
    setForm(FORM_VACIO)
    setEditando('nuevo')
  }

  function abrirEditar(ev: Evento) {
    setForm({
      slug: ev.slug,
      nombre: ev.nombre,
      descripcion: ev.descripcion ?? '',
      categoria: ev.categoria,
      instructor: ev.instructor ?? '',
      instructorInstagram: ev.instructor_instagram ?? '',
      fecha: aInputDatetime(ev.fecha),
      ventaAbreEn: ev.venta_abre_en ? aInputDatetime(ev.venta_abre_en) : '',
      lugar: ev.lugar,
      precio_clp: String(ev.precio_clp),
      capacidad_total: String(ev.capacidad_total),
      max_por_compra: String(ev.max_por_compra),
      activo: ev.activo,
    })
    setEditando(ev.id)
  }

  async function guardar(e: React.FormEvent) {
    e.preventDefault()
    setGuardando(true)
    setError(null)

    const payload = {
      slug: form.slug,
      nombre: form.nombre,
      descripcion: form.descripcion,
      categoria: form.categoria,
      instructor: form.instructor,
      instructorInstagram: form.instructorInstagram,
      fecha: new Date(form.fecha).toISOString(),
      ventaAbreEn: form.ventaAbreEn ? new Date(form.ventaAbreEn).toISOString() : null,
      lugar: form.lugar,
      precio_clp: Number(form.precio_clp),
      capacidad_total: Number(form.capacidad_total),
      max_por_compra: Number(form.max_por_compra),
      activo: form.activo,
    }

    try {
      const esNuevo = editando === 'nuevo'
      const res = await fetch(
        esNuevo ? '/api/admin/eventos' : `/api/admin/eventos/${editando}`,
        {
          method: esNuevo ? 'POST' : 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        },
      )
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'No pudimos guardar el evento.')
        setGuardando(false)
        return
      }
      setEditando(null)
      await cargar()
    } catch {
      setError('Sin conexión.')
    }
    setGuardando(false)
  }

  async function cambiarActivo(ev: Evento) {
    setError(null)
    try {
      const res = await fetch(`/api/admin/eventos/${ev.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activo: !ev.activo }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'No pudimos actualizar el evento.')
        return
      }
      await cargar()
    } catch {
      setError('Sin conexión.')
    }
  }

  async function eliminar(ev: Evento) {
    if (!confirm(`¿Eliminar "${ev.nombre}"? Esta acción no se puede deshacer.`)) return
    setError(null)
    setEliminando(ev.id)
    try {
      const res = await fetch(`/api/admin/eventos/${ev.id}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'No pudimos eliminar el evento.')
        setEliminando(null)
        return
      }
      await cargar()
    } catch {
      setError('Sin conexión.')
    }
    setEliminando(null)
  }

  const label = 'block text-sm font-medium text-salvia-700'
  const input =
    'mt-1.5 w-full rounded-lg border border-salvia-100 bg-white px-3 py-2.5 text-cafe-900 outline-none focus:border-salvia-400'

  if (editando) {
    return (
      <div className="mx-auto max-w-lg">
        <h1 className="text-xl font-bold text-salvia-800">
          {editando === 'nuevo' ? 'Nuevo evento' : 'Editar evento'}
        </h1>

        <form onSubmit={guardar} className="mt-6 space-y-4">
          <label className={label}>
            Slug (identificador en la URL)
            <input
              required
              disabled={editando !== 'nuevo'}
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className={`${input} disabled:opacity-60`}
              placeholder="bingo-de-plantas-5"
            />
          </label>

          <label className={label}>
            Nombre
            <input
              required
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              className={input}
            />
          </label>

          <label className={label}>
            Categoría
            <select
              value={form.categoria}
              onChange={(e) => setForm({ ...form, categoria: e.target.value as Categoria })}
              className={input}
            >
              {CATEGORIAS.map((c) => (
                <option key={c.valor} value={c.valor}>
                  {c.label}
                </option>
              ))}
            </select>
          </label>

          <label className={label}>
            Descripción
            <textarea
              rows={3}
              value={form.descripcion}
              onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
              className={`${input} resize-none`}
            />
          </label>

          {form.categoria === 'taller' && (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className={label}>
                Instructor (quién lo imparte)
                <input
                  value={form.instructor}
                  onChange={(e) => setForm({ ...form, instructor: e.target.value })}
                  className={input}
                  placeholder="Equipo Prego, o el nombre del instructor invitado"
                />
              </label>
              <label className={label}>
                Instagram del instructor (opcional)
                <input
                  value={form.instructorInstagram}
                  onChange={(e) => setForm({ ...form, instructorInstagram: e.target.value })}
                  className={input}
                  placeholder="usuario, sin @"
                />
                <span className="mt-1 block text-xs font-normal text-cafe-400">
                  Si lo llenas, el botón de inscripción va directo a esta cuenta
                  en vez de a la del local.
                </span>
              </label>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <label className={label}>
              Fecha y hora
              <input
                required
                type="datetime-local"
                value={form.fecha}
                onChange={(e) => setForm({ ...form, fecha: e.target.value })}
                className={input}
              />
            </label>
            <label className={label}>
              Lugar
              <input
                required
                value={form.lugar}
                onChange={(e) => setForm({ ...form, lugar: e.target.value })}
                className={input}
              />
            </label>
          </div>

          <label className={label}>
            Venta de entradas abre el (opcional)
            <input
              type="datetime-local"
              value={form.ventaAbreEn}
              onChange={(e) => setForm({ ...form, ventaAbreEn: e.target.value })}
              className={input}
            />
            <span className="mt-1 block text-xs font-normal text-cafe-400">
              Si lo dejas vacío, las entradas se pueden comprar de inmediato. Si
              pones una fecha futura, el sitio muestra un contador regresivo hasta
              esa fecha y bloquea las compras hasta entonces.
            </span>
          </label>

          <div className="grid gap-4 sm:grid-cols-3">
            <label className={label}>
              Precio (CLP)
              <input
                required
                type="number"
                min={1}
                value={form.precio_clp}
                onChange={(e) => setForm({ ...form, precio_clp: e.target.value })}
                className={input}
              />
            </label>
            <label className={label}>
              Capacidad total
              <input
                required
                type="number"
                min={1}
                value={form.capacidad_total}
                onChange={(e) => setForm({ ...form, capacidad_total: e.target.value })}
                className={input}
              />
            </label>
            <label className={label}>
              Máx. por compra
              <input
                required
                type="number"
                min={1}
                value={form.max_por_compra}
                onChange={(e) => setForm({ ...form, max_por_compra: e.target.value })}
                className={input}
              />
            </label>
          </div>

          <label className="flex items-center gap-2 text-sm font-medium text-salvia-700">
            <input
              type="checkbox"
              checked={form.activo}
              onChange={(e) => setForm({ ...form, activo: e.target.checked })}
              className="h-4 w-4 rounded border-salvia-300"
            />
            Activo (visible en la página pública)
          </label>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-700">{error}</p>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={guardando}
              className="flex-1 rounded-lg bg-salvia-600 py-3 font-medium text-white hover:bg-salvia-700 disabled:opacity-60"
            >
              {guardando ? 'Guardando…' : 'Guardar'}
            </button>
            <button
              type="button"
              onClick={() => setEditando(null)}
              className="rounded-lg border border-salvia-100 px-6 py-3 text-sm font-medium text-salvia-700 hover:bg-salvia-50"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-salvia-800">Eventos</h1>
        <button
          onClick={abrirNuevo}
          className="rounded-lg bg-salvia-600 px-4 py-2 text-sm font-medium text-white hover:bg-salvia-700"
        >
          + Nuevo evento
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {(['todas', ...CATEGORIAS.map((c) => c.valor)] as const).map((valor) => (
          <button
            key={valor}
            onClick={() => setFiltro(valor)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
              filtro === valor
                ? 'bg-salvia-600 text-white'
                : 'border border-salvia-100 text-salvia-700 hover:bg-salvia-50'
            }`}
          >
            {valor === 'todas' ? 'Todas' : CATEGORIAS.find((c) => c.valor === valor)?.label}
          </button>
        ))}
      </div>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-700">{error}</p>
      )}

      {cargando ? (
        <p className="mt-8 text-sm text-cafe-600">Cargando…</p>
      ) : eventos.length === 0 ? (
        <p className="mt-8 text-sm text-cafe-600">No hay eventos creados.</p>
      ) : eventos.filter((ev) => filtro === 'todas' || ev.categoria === filtro).length === 0 ? (
        <p className="mt-8 text-sm text-cafe-600">No hay nada en esta categoría.</p>
      ) : (
        <ul className="mt-6 space-y-3">
          {eventos
            .filter((ev) => filtro === 'todas' || ev.categoria === filtro)
            .map((ev) => (
            <li key={ev.id} className="rounded-xl border border-salvia-100 bg-white p-4 sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-salvia-800">{ev.nombre}</p>
                    <span className="rounded-full bg-salvia-50 px-2 py-0.5 text-xs font-medium text-salvia-700">
                      {CATEGORIAS.find((c) => c.valor === ev.categoria)?.label ?? ev.categoria}
                    </span>
                  </div>
                  <p className="text-sm text-cafe-600">
                    {fechaLarga(ev.fecha)} · {ev.lugar}
                  </p>
                  {ev.categoria === 'taller' && ev.instructor && (
                    <p className="mt-0.5 text-sm text-cafe-600">Con {ev.instructor}</p>
                  )}
                  <p className="mt-1 text-sm text-cafe-600">
                    {clp(ev.precio_clp)} · {ev.entradas_vendidas} de {ev.capacidad_total} vendidas ·
                    máx. {ev.max_por_compra} por compra
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                    ev.activo ? 'bg-green-100 text-green-800' : 'bg-cafe-100 text-cafe-600'
                  }`}
                >
                  {ev.activo ? 'Activo' : 'Inactivo'}
                </span>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => abrirEditar(ev)}
                  className="rounded-lg border border-salvia-100 px-4 py-2 text-sm font-medium text-salvia-700 hover:bg-salvia-50"
                >
                  Editar
                </button>
                <button
                  onClick={() => cambiarActivo(ev)}
                  className="rounded-lg border border-salvia-100 px-4 py-2 text-sm font-medium text-salvia-700 hover:bg-salvia-50"
                >
                  {ev.activo ? 'Desactivar' : 'Activar'}
                </button>
                <button
                  onClick={() => eliminar(ev)}
                  disabled={eliminando === ev.id}
                  className="rounded-lg border border-red-100 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {eliminando === ev.id ? 'Eliminando…' : 'Eliminar'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
