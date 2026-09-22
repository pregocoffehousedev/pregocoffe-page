export const clp = (n: number) =>
  new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(n)

export const fechaLarga = (iso: string) =>
  new Intl.DateTimeFormat('es-CL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Santiago',
  }).format(new Date(iso))

// Acepta "@usuario", "usuario" o un link completo de Instagram y devuelve
// solo el nombre de usuario, igual formato que LOCAL.instagram.
export function normalizarInstagram(valor: string) {
  const limpio = valor.trim()
  if (!limpio) return ''
  const match = /instagram\.com\/([^/?]+)/i.exec(limpio)
  if (match) return match[1]
  return limpio.replace(/^@/, '')
}
