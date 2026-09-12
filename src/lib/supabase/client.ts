import { createBrowserClient } from '@supabase/ssr'

// Cliente de Supabase para componentes 'use client'. Maneja la sesión del
// usuario admin (login con Google) vía cookies del navegador.
export function supabaseBrowser() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}
