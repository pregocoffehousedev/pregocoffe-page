'use client'

import { useEffect } from 'react'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[error boundary]', error)
  }, [error])

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-salvia-100 bg-white p-10 text-center">
      <p className="text-2xl">☕</p>
      <h1 className="mt-3 text-xl font-bold text-salvia-800">
        Algo salió mal
      </h1>
      <p className="mt-2 text-sm text-cafe-600">
        Tuvimos un problema al cargar esta página. Intenta de nuevo, o vuelve
        más tarde si el problema sigue.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button
          onClick={reset}
          className="rounded-full bg-salvia-600 px-6 py-2.5 text-sm font-medium text-durazno-50 transition hover:bg-salvia-700"
        >
          Intentar de nuevo
        </button>
        <a
          href="/"
          className="rounded-full border border-salvia-100 px-6 py-2.5 text-sm font-medium text-salvia-700 transition hover:bg-salvia-50"
        >
          Volver al inicio
        </a>
      </div>
    </div>
  )
}
