import { redirect } from 'next/navigation'
import { supabasePublic } from '@/lib/supabase'

// /evento sin slug: redirige al bingo activo por defecto, para no romper
// los links existentes ("Comprar entradas" del header y del banner).
// Cada evento individual vive en /evento/[slug].
const SLUG_DEFAULT = process.env.NEXT_PUBLIC_EVENTO_SLUG || 'plantitas-y-cafe-4'

export default async function EventoIndexPage() {
  let slugDestino = SLUG_DEFAULT
  try {
    const { data } = await supabasePublic()
      .from('eventos')
      .select('slug')
      .eq('slug', SLUG_DEFAULT)
      .eq('activo', true)
      .single<{ slug: string }>()

    if (data) slugDestino = data.slug
  } catch (e) {
    console.error('[evento] no se pudo resolver el evento por defecto:', e)
  }

  redirect(`/evento/${slugDestino}`)
}
