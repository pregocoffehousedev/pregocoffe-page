import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

// Google redirige aquí tras el login. Intercambiamos el código de OAuth por
// una sesión y mandamos al usuario de vuelta al panel admin.
export async function GET(req: Request) {
  const url = new URL(req.url)
  const code = url.searchParams.get('code')
  const next = url.searchParams.get('next') ?? '/admin'
  const errorParam = url.searchParams.get('error')
  const errorDescription = url.searchParams.get('error_description')

  if (errorParam) {
    console.error('[auth/callback] Google devolvió error:', errorParam, errorDescription)
    return NextResponse.redirect(
      new URL(`/admin/login?error=${encodeURIComponent(errorDescription || errorParam)}`, url.origin),
    )
  }

  if (code) {
    const supabase = await supabaseServer()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) {
      console.error('[auth/callback] exchangeCodeForSession falló:', error.message)
      return NextResponse.redirect(
        new URL(`/admin/login?error=${encodeURIComponent(error.message)}`, url.origin),
      )
    }
  }

  return NextResponse.redirect(new URL(next, url.origin))
}
