'use client'

import { useEffect, useState } from 'react'
import { fechaLarga } from '@/lib/format'

type Props = {
  ventaAbreEn: string
  onAbierta: () => void
}

function calcularRestante(objetivoMs: number) {
  const restante = Math.max(0, objetivoMs - Date.now())
  const dias = Math.floor(restante / 86_400_000)
  const horas = Math.floor((restante % 86_400_000) / 3_600_000)
  const minutos = Math.floor((restante % 3_600_000) / 60_000)
  const segundos = Math.floor((restante % 60_000) / 1_000)
  return { restante, dias, horas, minutos, segundos }
}

// Cuenta regresiva hasta que abre la venta de entradas. Al llegar a cero,
// avisa al padre (onAbierta) para que muestre el formulario de compra real.
export default function ContadorVenta({ ventaAbreEn, onAbierta }: Props) {
  const objetivoMs = new Date(ventaAbreEn).getTime()
  const [tiempo, setTiempo] = useState(() => calcularRestante(objetivoMs))
  // Intl.DateTimeFormat puede diferir en bytes invisibles (espacios NNBSP)
  // entre el ICU del servidor y el del navegador — formateamos solo tras
  // montar en el cliente para no romper la hidratación con ese mismatch.
  const [fechaTexto, setFechaTexto] = useState<string | null>(null)

  useEffect(() => {
    setFechaTexto(fechaLarga(ventaAbreEn))
  }, [ventaAbreEn])

  useEffect(() => {
    const id = setInterval(() => {
      const t = calcularRestante(objetivoMs)
      setTiempo(t)
      if (t.restante <= 0) {
        clearInterval(id)
        onAbierta()
      }
    }, 1000)
    return () => clearInterval(id)
  }, [objetivoMs, onAbierta])

  const bloques = [
    { valor: tiempo.dias, label: 'días' },
    { valor: tiempo.horas, label: 'horas' },
    { valor: tiempo.minutos, label: 'min' },
    { valor: tiempo.segundos, label: 'seg' },
  ]

  return (
    <div className="overflow-hidden rounded-2xl border border-salvia-100 bg-white p-6 text-center shadow-sm">
      <p className="font-semibold text-salvia-800">La venta de entradas aún no abre</p>
      <p className="mt-1 text-sm text-cafe-600">
        Disponibles desde el {fechaTexto ?? '…'}
      </p>

      <div className="mt-5 flex justify-center gap-3">
        {bloques.map((b) => (
          <div
            key={b.label}
            className="w-16 rounded-xl bg-salvia-50 py-3 text-salvia-800"
          >
            <p className="text-2xl font-bold tabular-nums">{b.valor}</p>
            <p className="text-[0.65rem] uppercase tracking-wide text-salvia-600">
              {b.label}
            </p>
          </div>
        ))}
      </div>

      <button
        type="button"
        disabled
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-salvia-600 py-3.5 font-medium text-durazno-50 opacity-50 disabled:cursor-not-allowed"
      >
        Comprar entradas
      </button>

      <p className="mt-4 text-xs text-cafe-400">
        El botón se activa apenas se abra la venta — no necesitas recargar la página.
      </p>
    </div>
  )
}
