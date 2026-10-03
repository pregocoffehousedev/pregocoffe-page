import { supabasePublic } from './supabase'

const SLUG_DEFAULT = process.env.NEXT_PUBLIC_EVENTO_SLUG || 'plantitas-y-cafe-4'

// ¿Hay un bingo activo cuya fecha aún no pasó? Compartido entre el layout
// (lo resuelve en el servidor para el primer render, sin parpadeo) y el
// endpoint /api/eventos/bingo-vigente (usado por el cliente tras montar).
export async function obtenerBingoVigente() {
  try {
    const { data } = await supabasePublic()
      .from('eventos')
      .select('fecha')
      .eq('slug', SLUG_DEFAULT)
      .eq('categoria', 'bingo')
      .eq('activo', true)
      .single<{ fecha: string }>()

    return Boolean(data && new Date(data.fecha).getTime() >= Date.now())
  } catch (e) {
    console.error('[bingoVigente] error', e)
    return false
  }
}
