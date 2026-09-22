import crypto from 'crypto'

/**
 * Base de datos en memoria para desarrollar sin Supabase configurado.
 *
 * Replica el subconjunto de tablas y funciones RPC de supabase/schema.sql
 * que este proyecto usa, con la misma lógica de negocio (anti-overselling,
 * TTL de reservas, generación de códigos QR). Vive solo en el proceso del
 * servidor: se reinicia cada vez que corre `next dev`.
 *
 * Se activa automáticamente en lib/supabase.ts cuando faltan las variables
 * de entorno de Supabase — ningún otro archivo necesita saber que existe.
 */

type EstadoReserva = 'pendiente' | 'pagada' | 'expirada' | 'cancelada'

type EventoRow = {
  id: string
  slug: string
  nombre: string
  descripcion: string | null
  categoria: 'bingo' | 'taller'
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
  agotado: boolean
}

type ReservaRow = {
  id: string
  evento_id: string
  cantidad: number
  monto_total_clp: number
  estado: EstadoReserva
  comprador_nombre: string
  comprador_telefono: string
  confirmada_por: string | null
  expira_en: string
  pagada_en: string | null
  creada_en: string
}

type EntradaRow = {
  id: string
  reserva_id: string
  evento_id: string
  codigo: string
  usada: boolean
  usada_en: string | null
  creada_en: string
}

type ListaEsperaRow = {
  id: string
  evento_id: string
  nombre: string
  telefono: string
  notificado: boolean
  creada_en: string
}

const g = globalThis as unknown as {
  __mockDb?: {
    eventos: EventoRow[]
    reservas: ReservaRow[]
    entradas: EntradaRow[]
    listaEspera: ListaEsperaRow[]
  }
}

function seed() {
  const evento: EventoRow = {
    id: crypto.randomUUID(),
    slug: process.env.NEXT_PUBLIC_EVENTO_SLUG || 'plantitas-y-cafe-4',
    nombre: 'Plantitas & Café — Bingo de Plantas 4.0',
    descripcion:
      'Una tarde de bingo impartida por el equipo de Prego, con premios en plantas. Café de especialidad y pastelería disponibles para comprar aparte en el local.',
    categoria: 'bingo',
    instructor: null,
    instructor_instagram: null,
    fecha: new Date(Date.now() + 7 * 24 * 3600_000).toISOString(),
    venta_abre_en: null,
    lugar: '1 Sur 899, Talca',
    precio_clp: 5000,
    capacidad_total: 50,
    entradas_vendidas: 0,
    max_por_compra: 6,
    activo: true,
    agotado: false,
  }
  return { eventos: [evento], reservas: [], entradas: [], listaEspera: [] }
}

function db() {
  if (!g.__mockDb) g.__mockDb = seed()
  return g.__mockDb
}

// 4 letras + 2 números (ej. ABCD12) — mismo formato que generar_codigo_entrada()
// en supabase/schema.sql, para que el mock se comporte igual que producción.
function codigoEntrada() {
  const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let codigo = ''
  for (let i = 0; i < 4; i++) {
    codigo += letras[Math.floor(Math.random() * letras.length)]
  }
  codigo += String(Math.floor(Math.random() * 100)).padStart(2, '0')
  return codigo
}

function err(message: string) {
  return { message, code: 'MOCK' }
}

// ---------- RPCs ----------

function reservarEntradas(args: {
  p_evento_slug: string
  p_cantidad: number
  p_nombre: string
  p_telefono: string
  p_ttl_minutos?: number
}) {
  const store = db()
  const evento = store.eventos.find((e) => e.slug === args.p_evento_slug && e.activo)
  if (!evento) return { data: null, error: err('EVENTO_NO_ENCONTRADO') }

  if (evento.venta_abre_en && Date.now() < new Date(evento.venta_abre_en).getTime()) {
    return { data: null, error: err('VENTA_NO_ABIERTA') }
  }

  if (args.p_cantidad > evento.max_por_compra) {
    return { data: null, error: err('EXCEDE_MAX_POR_COMPRA') }
  }

  if (evento.entradas_vendidas + args.p_cantidad > evento.capacidad_total) {
    return { data: null, error: err('SIN_CUPO') }
  }

  evento.entradas_vendidas += args.p_cantidad

  const monto = evento.precio_clp * args.p_cantidad
  const expiraEn = new Date(
    Date.now() + (args.p_ttl_minutos ?? 10) * 60_000,
  ).toISOString()

  const reserva: ReservaRow = {
    id: crypto.randomUUID(),
    evento_id: evento.id,
    cantidad: args.p_cantidad,
    monto_total_clp: monto,
    estado: 'pendiente',
    comprador_nombre: args.p_nombre,
    comprador_telefono: args.p_telefono.trim(),
    confirmada_por: null,
    expira_en: expiraEn,
    pagada_en: null,
    creada_en: new Date().toISOString(),
  }
  store.reservas.push(reserva)

  return {
    data: [
      {
        reserva_id: reserva.id,
        monto_total_clp: monto,
        expira_en: expiraEn,
        disponibles: evento.capacidad_total - evento.entradas_vendidas,
      },
    ],
    error: null,
  }
}

function anotarseListaEspera(args: {
  p_evento_slug: string
  p_nombre: string
  p_telefono: string
}) {
  const store = db()
  const evento = store.eventos.find((e) => e.slug === args.p_evento_slug && e.activo)
  if (!evento) return { data: null, error: err('EVENTO_NO_ENCONTRADO') }

  if (evento.entradas_vendidas < evento.capacidad_total) {
    return { data: null, error: err('AUN_HAY_CUPO') }
  }

  const fila: ListaEsperaRow = {
    id: crypto.randomUUID(),
    evento_id: evento.id,
    nombre: args.p_nombre.trim(),
    telefono: args.p_telefono.trim(),
    notificado: false,
    creada_en: new Date().toISOString(),
  }
  store.listaEspera.push(fila)

  return { data: fila.id, error: null }
}

function confirmarPago(reservaId: string, confirmadaPor: string) {
  const store = db()
  const reserva = store.reservas.find((r) => r.id === reservaId)
  if (!reserva) return { data: null, error: err('RESERVA_NO_ENCONTRADA') }

  if (reserva.estado === 'pagada') {
    const codigos = store.entradas.filter((e) => e.reserva_id === reservaId).map((e) => e.codigo)
    return { data: [{ ya_procesada: true, cantidad: reserva.cantidad, codigos }], error: null }
  }

  if (reserva.estado === 'cancelada') {
    return { data: null, error: err('RESERVA_CANCELADA') }
  }

  if (reserva.estado === 'expirada') {
    const evento = store.eventos.find((e) => e.id === reserva.evento_id)!
    if (evento.entradas_vendidas + reserva.cantidad > evento.capacidad_total) {
      return { data: null, error: err('SIN_CUPO_TRAS_EXPIRAR') }
    }
    evento.entradas_vendidas += reserva.cantidad
  }

  reserva.estado = 'pagada'
  reserva.pagada_en = new Date().toISOString()
  reserva.confirmada_por = confirmadaPor

  const codigos: string[] = []
  for (let i = 0; i < reserva.cantidad; i++) {
    const codigo = codigoEntrada()
    store.entradas.push({
      id: crypto.randomUUID(),
      reserva_id: reserva.id,
      evento_id: reserva.evento_id,
      codigo,
      usada: false,
      usada_en: null,
      creada_en: new Date().toISOString(),
    })
    codigos.push(codigo)
  }

  return { data: [{ ya_procesada: false, cantidad: reserva.cantidad, codigos }], error: null }
}

function liberarReservasVencidas() {
  const store = db()
  const ahora = Date.now()
  let liberadas = 0
  for (const r of store.reservas) {
    if (r.estado === 'pendiente' && new Date(r.expira_en).getTime() < ahora) {
      r.estado = 'expirada'
      const evento = store.eventos.find((e) => e.id === r.evento_id)!
      evento.entradas_vendidas = Math.max(0, evento.entradas_vendidas - r.cantidad)
      liberadas++
    }
  }
  return { data: liberadas, error: null }
}

function cancelarReservaAdmin(reservaId: string) {
  const store = db()
  const reserva = store.reservas.find((r) => r.id === reservaId)
  if (!reserva) return { data: null, error: err('RESERVA_NO_ENCONTRADA') }

  if (reserva.estado === 'cancelada') return { data: true, error: null }

  if (reserva.estado === 'pendiente' || reserva.estado === 'pagada') {
    const evento = store.eventos.find((e) => e.id === reserva.evento_id)!
    evento.entradas_vendidas = Math.max(0, evento.entradas_vendidas - reserva.cantidad)
  }

  store.entradas = store.entradas.filter((e) => e.reserva_id !== reservaId)
  reserva.estado = 'cancelada'

  return { data: true, error: null }
}

function editarReservaAdmin(args: {
  p_reserva_id: string
  p_nombre: string
  p_telefono: string
  p_cantidad?: number | null
}) {
  const store = db()
  const reserva = store.reservas.find((r) => r.id === args.p_reserva_id)
  if (!reserva) return { data: null, error: err('RESERVA_NO_ENCONTRADA') }

  const nuevaCantidad = args.p_cantidad ?? null

  if (nuevaCantidad !== null && nuevaCantidad !== reserva.cantidad) {
    if (reserva.estado === 'pagada') {
      return { data: null, error: err('NO_SE_PUEDE_CAMBIAR_CANTIDAD_PAGADA') }
    }

    const evento = store.eventos.find((e) => e.id === reserva.evento_id)!
    const delta = nuevaCantidad - reserva.cantidad

    if (reserva.estado === 'pendiente') {
      if (evento.entradas_vendidas + delta > evento.capacidad_total) {
        return { data: null, error: err('SIN_CUPO') }
      }
      evento.entradas_vendidas = Math.max(0, evento.entradas_vendidas + delta)
    }

    reserva.cantidad = nuevaCantidad
    reserva.monto_total_clp = evento.precio_clp * nuevaCantidad
  }

  reserva.comprador_nombre = args.p_nombre
  reserva.comprador_telefono = args.p_telefono.trim()

  return { data: true, error: null }
}

function validarEntrada(codigo: string) {
  const store = db()
  const entrada = store.entradas.find((e) => e.codigo === codigo.trim().toUpperCase())
  if (!entrada) {
    return {
      data: [{ valida: false, motivo: 'CODIGO_INEXISTENTE', comprador: null, usada_en: null, cantidad: null }],
      error: null,
    }
  }

  const reserva = store.reservas.find((r) => r.id === entrada.reserva_id)!

  if (entrada.usada) {
    return {
      data: [
        {
          valida: false,
          motivo: 'YA_USADA',
          comprador: reserva.comprador_nombre,
          usada_en: entrada.usada_en,
          cantidad: reserva.cantidad,
        },
      ],
      error: null,
    }
  }

  entrada.usada = true
  entrada.usada_en = new Date().toISOString()

  return {
    data: [
      {
        valida: true,
        motivo: 'OK',
        comprador: reserva.comprador_nombre,
        usada_en: entrada.usada_en,
        cantidad: reserva.cantidad,
      },
    ],
    error: null,
  }
}

// ---------- Mini query builder (solo lo que este proyecto usa) ----------

type Filtro = { columna: string; valor: unknown }

// Separa por comas ignorando las que están dentro de un join `tabla(...)`,
// p.ej. "a, b, eventos(nombre, fecha)" → ["a", "b", "eventos(nombre, fecha)"]
function columnasSeparadas(columnas: string) {
  const partes: string[] = []
  let actual = ''
  let profundidad = 0
  for (const char of columnas) {
    if (char === '(') profundidad++
    if (char === ')') profundidad--
    if (char === ',' && profundidad === 0) {
      partes.push(actual.trim())
      actual = ''
    } else {
      actual += char
    }
  }
  if (actual.trim()) partes.push(actual.trim())
  return partes
}

function proyectar(fila: Record<string, unknown>, columnas: string, extra: Record<string, unknown>) {
  if (columnas.trim() === '*') return { ...fila, ...extra }
  const out: Record<string, unknown> = {}
  for (const parte of columnasSeparadas(columnas)) {
    const nombreJoin = /^(\w+)\(/.exec(parte)?.[1]
    if (nombreJoin && nombreJoin in extra) {
      out[nombreJoin] = extra[nombreJoin]
    } else {
      out[parte] = fila[parte]
    }
  }
  return out
}

type ResultadoQuery = { data: unknown; error: { message: string; code: string } | null }

class MockQuery<T extends Record<string, unknown>> implements PromiseLike<ResultadoQuery> {
  private filtros: Filtro[] = []
  private columnas = '*'
  private modo: 'select' | 'update' | 'insert' | 'delete' = 'select'
  private cambios: Partial<T> | null = null
  private nuevaFila: Partial<T> | null = null
  private soloUno = false
  private orden: { columna: string; ascending: boolean } | null = null
  private limite: number | null = null

  constructor(
    private tabla: string,
    private filas: T[],
    private joins: Record<string, () => Record<string, unknown>[]> = {},
  ) {}

  select(columnas = '*') {
    this.columnas = columnas
    return this
  }

  insert(fila: Partial<T>) {
    this.modo = 'insert'
    this.nuevaFila = fila
    return this
  }

  eq(columna: string, valor: unknown) {
    this.filtros.push({ columna, valor })
    return this
  }

  in(columna: string, valores: unknown[]) {
    this.filtros.push({ columna, valor: valores })
    return this
  }

  order(columna: string, opts?: { ascending?: boolean }) {
    this.orden = { columna, ascending: opts?.ascending ?? true }
    return this
  }

  limit(n: number) {
    this.limite = n
    return this
  }

  update(cambios: Partial<T>) {
    this.modo = 'update'
    this.cambios = cambios
    return this
  }

  delete() {
    this.modo = 'delete'
    return this
  }

  single() {
    this.soloUno = true
    return this
  }

  private ejecutar() {
    if (this.modo === 'insert' && this.nuevaFila) {
      const fila = {
        id: crypto.randomUUID(),
        ...this.nuevaFila,
      } as unknown as T
      this.filas.push(fila)
      return this.soloUno
        ? { data: proyectar(fila as Record<string, unknown>, this.columnas, {}), error: null }
        : { data: [proyectar(fila as Record<string, unknown>, this.columnas, {})], error: null }
    }

    let coincidencias =
      this.filtros.length === 0
        ? this.filas
        : this.filas.filter((fila) =>
            this.filtros.every((f) =>
              Array.isArray(f.valor)
                ? f.valor.includes((fila as Record<string, unknown>)[f.columna])
                : (fila as Record<string, unknown>)[f.columna] === f.valor,
            ),
          )

    if (this.modo === 'update' && this.cambios) {
      coincidencias.forEach((fila) => Object.assign(fila, this.cambios))
      return { data: null, error: null }
    }

    if (this.modo === 'delete') {
      if (this.tabla === 'eventos') {
        const store = db()
        const idsABorrar = new Set(
          coincidencias.map((fila) => (fila as Record<string, unknown>).id),
        )
        const tieneReservas = store.reservas.some((r) => idsABorrar.has(r.evento_id))
        if (tieneReservas) {
          return { data: null, error: { message: 'FK_RESERVAS', code: '23503' } }
        }
      }
      for (const fila of coincidencias) {
        const idx = this.filas.indexOf(fila)
        if (idx !== -1) this.filas.splice(idx, 1)
      }
      return { data: null, error: null }
    }

    if (this.orden) {
      const { columna, ascending } = this.orden
      coincidencias = [...coincidencias].sort((a, b) => {
        const av = (a as Record<string, unknown>)[columna] as string
        const bv = (b as Record<string, unknown>)[columna] as string
        return ascending ? (av > bv ? 1 : -1) : av < bv ? 1 : -1
      })
    }
    if (this.limite != null) coincidencias = coincidencias.slice(0, this.limite)

    const extraPorFila = coincidencias.map((fila) => {
      const extra: Record<string, unknown> = {}
      for (const [nombre, resolver] of Object.entries(this.joins)) {
        extra[nombre] = resolver().filter(
          (r) => r.id === (fila as Record<string, unknown>)[`${nombre.replace(/s$/, '')}_id`],
        )
      }
      return extra
    })

    const proyectadas = coincidencias.map((fila, i) =>
      proyectar(fila as Record<string, unknown>, this.columnas, extraPorFila[i]),
    )

    if (this.soloUno) {
      if (proyectadas.length === 0) return { data: null, error: err('NOT_FOUND') }
      return { data: proyectadas[0], error: null }
    }
    return { data: proyectadas, error: null }
  }

  then<TResult1 = ResultadoQuery, TResult2 = never>(
    onfulfilled?: ((value: ResultadoQuery) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
  ): PromiseLike<TResult1 | TResult2> {
    return Promise.resolve(this.ejecutar()).then(onfulfilled, onrejected)
  }
}

export function mockSupabaseClient() {
  return {
    from(tabla: 'eventos' | 'reservas' | 'entradas' | 'lista_espera') {
      const store = db()
      if (tabla === 'eventos') return new MockQuery(tabla, store.eventos)
      if (tabla === 'reservas') {
        return new MockQuery(tabla, store.reservas, {
          eventos: () => store.eventos,
        })
      }
      if (tabla === 'lista_espera') return new MockQuery(tabla, store.listaEspera)
      return new MockQuery(tabla, store.entradas)
    },
    rpc(fn: string, args: Record<string, unknown> = {}) {
      switch (fn) {
        case 'reservar_entradas':
          return Promise.resolve(
            reservarEntradas(
              args as Parameters<typeof reservarEntradas>[0],
            ),
          )
        case 'confirmar_pago':
          return Promise.resolve(
            confirmarPago(args.p_reserva_id as string, args.p_confirmada_por as string),
          )
        case 'liberar_reservas_vencidas':
          return Promise.resolve(liberarReservasVencidas())
        case 'validar_entrada':
          return Promise.resolve(validarEntrada(args.p_codigo as string))
        case 'cancelar_reserva_admin':
          return Promise.resolve(cancelarReservaAdmin(args.p_reserva_id as string))
        case 'editar_reserva_admin':
          return Promise.resolve(
            editarReservaAdmin(args as Parameters<typeof editarReservaAdmin>[0]),
          )
        case 'anotarse_lista_espera':
          return Promise.resolve(
            anotarseListaEspera(args as Parameters<typeof anotarseListaEspera>[0]),
          )
        default:
          return Promise.resolve({ data: null, error: err(`RPC_NO_IMPLEMENTADA:${fn}`) })
      }
    },
  }
}

export function mockActivo() {
  return !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY
}
