import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
// Cachea 1 hora: el feed no cambia tanto y la API de Meta tiene cuota.
export const revalidate = 3600

type Post = {
  id: string
  caption?: string
  media_type: string
  media_url: string
  thumbnail_url?: string
  permalink: string
}

/**
 * Últimas publicaciones de Instagram vía Instagram Basic Display API.
 *
 * Requiere INSTAGRAM_TOKEN (token de larga duración, 60 días).
 * IMPORTANTE: el token expira. Hay que renovarlo con:
 *   GET https://graph.instagram.com/refresh_access_token
 *       ?grant_type=ig_refresh_token&access_token=TOKEN_ACTUAL
 *
 * Sin token configurado devuelve lista vacía y la sección no se muestra.
 */
export async function GET() {
  const token = process.env.INSTAGRAM_TOKEN
  if (!token) {
    return NextResponse.json({ posts: [], motivo: 'sin_token' })
  }

  try {
    const campos = 'id,caption,media_type,media_url,thumbnail_url,permalink'
    const res = await fetch(
      `https://graph.instagram.com/me/media?fields=${campos}&limit=8&access_token=${token}`,
      { next: { revalidate: 3600 } },
    )

    if (!res.ok) {
      console.error('[instagram] respuesta', res.status, await res.text())
      return NextResponse.json({ posts: [], motivo: 'error_api' })
    }

    const json = await res.json()
    const posts: Post[] = (json.data ?? [])
      // Los videos usan thumbnail_url; los carruseles devuelven la portada
      .map((p: Post) => ({
        ...p,
        media_url: p.media_type === 'VIDEO' ? (p.thumbnail_url ?? p.media_url) : p.media_url,
      }))
      .slice(0, 8)

    return NextResponse.json({ posts })
  } catch (e) {
    console.error('[instagram] error', e)
    return NextResponse.json({ posts: [], motivo: 'excepcion' })
  }
}
