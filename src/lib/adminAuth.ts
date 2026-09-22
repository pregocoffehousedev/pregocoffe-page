import { supabaseServer } from './supabase/server'

/**
 * Emails autorizados a usar el panel admin. Solo estas cuentas de Google
 * pueden entrar a /admin y llamar a los endpoints api/admin/* y api/validar,
 * sin importar que hayan iniciado sesión correctamente con Google.
 */
const EMAILS_PERMITIDOS = [
  'pregocoffehousedev@gmail.com',
  'info@pregocoffeehouse.com',
  'info@pregocoffeehouse.cl',
]

/**
 * Verifica que la petición venga de una sesión de Supabase Auth válida
 * (login con Google) y que el email de esa sesión esté en la whitelist.
 * Se usa al inicio de cada Route Handler admin, en vez del antiguo
 * `Bearer ADMIN_TOKEN`.
 */
export async function requireAdmin() {
  const supabase = await supabaseServer()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.email || !EMAILS_PERMITIDOS.includes(user.email)) {
    return null
  }

  return user
}

/**
 * Igual que requireAdmin, pero distingue POR QUÉ falló: sin sesión en
 * absoluto vs. sesión válida con un email fuera de la whitelist. Sirve
 * para diagnosticar problemas de login (el layout de /admin la usa para
 * mandar la razón exacta a /admin/login).
 */
export async function requireAdminConMotivo() {
  const supabase = await supabaseServer()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { admin: null, motivo: 'sin_sesion' as const }
  }
  if (!user.email || !EMAILS_PERMITIDOS.includes(user.email)) {
    return { admin: null, motivo: 'email_no_autorizado' as const, email: user.email }
  }

  return { admin: user, motivo: null }
}
