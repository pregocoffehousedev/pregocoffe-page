'use client'

import { useState } from 'react'

type Resultado = {
  valida: boolean
  motivo: string
  comprador: string | null
  cantidad: number | null
}

const MENSAJES: Record<string, string> = {
  OK: '✓ Entrada válida — dejar pasar',
  YA_USADA: '⚠️ Esta entrada ya fue utilizada',
  CODIGO_INEXISTENTE: '✗ Código no existe',
  ERROR_RED: '✗ Sin conexión',
}

// "loki cabañas" -> "Loki Cabañas"
function capitalizarNombre(nombre: string) {
  return nombre
    .toLowerCase()
    .split(' ')
    .map((palabra) => (palabra ? palabra[0].toUpperCase() + palabra.slice(1) : palabra))
    .join(' ')
}

// Panel para la puerta del evento: escribe el código que la persona
// muestra (recibido por WhatsApp al confirmar su pago) y marca la
// entrada como usada. Cada código sirve una sola vez.
export default function ValidarEntradas() {
  const [codigo, setCodigo] = useState('')
  const [resultado, setResultado] = useState<Resultado | null>(null)
  const [cargando, setCargando] = useState(false)

  async function validar(e: React.FormEvent) {
    e.preventDefault()
    setCargando(true)
    setResultado(null)
    try {
      const res = await fetch('/api/validar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codigo }),
      })
      setResultado(await res.json())
    } catch {
      setResultado({ valida: false, motivo: 'ERROR_RED', comprador: null, cantidad: null })
    }
    setCodigo('')
    setCargando(false)
  }

  return (
    <div className="mx-auto max-w-sm">
      <p className="text-sm text-salvia-700">
        Escribe el código que la persona muestra en la puerta.
      </p>

      <form onSubmit={validar} className="mt-6 space-y-4">
        <label className="block text-sm font-medium text-salvia-700">
          Código de la entrada
          <input
            required
            autoFocus
            value={codigo}
            onChange={(e) => setCodigo(e.target.value.toUpperCase())}
            className="mt-1.5 w-full rounded-lg border border-salvia-100 bg-white px-3 py-3 font-mono text-lg tracking-widest outline-none focus:border-cafe-400"
            placeholder="ABCD12"
            maxLength={6}
          />
        </label>

        <button
          type="submit"
          disabled={cargando}
          className="w-full rounded-lg bg-salvia-600 py-3 font-medium text-white hover:bg-salvia-700 disabled:opacity-60"
        >
          {cargando ? 'Validando…' : 'Validar'}
        </button>
      </form>

      {resultado && (
        <div
          className={`mt-5 rounded-lg p-4 text-center font-medium ${
            resultado.valida ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          <p>{MENSAJES[resultado.motivo] ?? resultado.motivo}</p>
          {resultado.comprador && (
            <p className="mt-2 text-xl font-bold">{capitalizarNombre(resultado.comprador)}</p>
          )}
          {resultado.cantidad != null && (
            <p className="mt-1 text-2xl font-bold">
              {resultado.cantidad} {resultado.cantidad === 1 ? 'entrada' : 'entradas'}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
