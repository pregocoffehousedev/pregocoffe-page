'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabaseBrowser } from '@/lib/supabase/client'

function LoginForm() {
  const params = useSearchParams()
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const errorUrl = params.get('error')
    if (errorUrl) setError(errorUrl)
  }, [params])

  async function entrarConGoogle() {
    setCargando(true)
    setError(null)
    const supabase = supabaseBrowser()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) {
      setError('No pudimos iniciar sesión. Inténtalo de nuevo.')
      setCargando(false)
    }
    // Si no hay error, el navegador redirige a Google — no hace falta más.
  }

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="text-xl font-bold text-salvia-800">Panel de administración</h1>
      <p className="mt-1 text-sm text-salvia-700">
        Acceso solo para el equipo de Prego.
      </p>

      <button
        onClick={entrarConGoogle}
        disabled={cargando}
        className="mt-8 flex w-full items-center justify-center gap-3 rounded-lg border border-salvia-100 bg-white py-3 font-medium text-cafe-900 transition hover:bg-salvia-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M23.52 12.27c0-.85-.07-1.48-.22-2.13H12v3.86h6.61c-.13 1.07-.86 2.7-2.47 3.79l-.02.15 3.59 2.78.25.02c2.28-2.1 3.59-5.19 3.59-8.47z"
          />
          <path
            fill="#34A853"
            d="M12 24c3.24 0 5.95-1.06 7.94-2.88l-3.78-2.93c-1.02.7-2.4 1.19-4.16 1.19-3.18 0-5.88-2.09-6.84-4.99l-.14.01-3.72 2.88-.05.14C2.36 21.3 6.84 24 12 24z"
          />
          <path
            fill="#FBBC05"
            d="M5.16 14.39A7.4 7.4 0 0 1 4.75 12c0-.83.15-1.63.4-2.39l-.01-.16-3.77-2.93-.12.06A11.98 11.98 0 0 0 0 12c0 1.93.47 3.76 1.25 5.38l3.91-3z"
          />
          <path
            fill="#EA4335"
            d="M12 4.75c2.25 0 3.77.97 4.64 1.79l3.39-3.31C17.94 1.19 15.24 0 12 0 6.84 0 2.36 2.7.25 6.62l3.9 3.03C5.12 6.84 7.82 4.75 12 4.75z"
          />
        </svg>
        {cargando ? 'Conectando…' : 'Iniciar sesión con Google'}
      </button>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-700">{error}</p>
      )}

      <p className="mt-6 text-center text-xs text-cafe-400">
        Solo cuentas autorizadas del equipo Prego pueden entrar.
      </p>
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<p className="text-center text-salvia-700">Cargando…</p>}>
      <LoginForm />
    </Suspense>
  )
}
