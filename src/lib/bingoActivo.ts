import { supabasePublic, type Evento } from './supabase'

/**
 * El "bingo activo" del sitio: entre los eventos con categoria='bingo' y
 * activo=true, el de fecha más próxima que aún no haya pasado: o, si todos
 * ya pasaron, el más reciente (así la página no queda sin nada que mostrar
 * justo después de un evento, hasta que se cargue el siguiente).
 *
 * Reemplaza el viejo mecanismo de NEXT_PUBLIC_EVENTO_SLUG fijo: antes había
 * que actualizar esa variable de entorno y redeployar cada vez que se
 * creaba un bingo nuevo con un slug distinto. Ahora se detecta solo.
 */
export async function obtenerBingoActivo(): Promise<Evento | null> {
  try {
    const { data } = await supabasePublic()
      .from('eventos')
      .select('*')
      .eq('categoria', 'bingo')
      .eq('activo', true)
      .order('fecha', { ascending: true })

    const bingos = (data as Evento[] | null) ?? []
    if (bingos.length === 0) return null

    const ahora = Date.now()
    const proximo = bingos.find((b) => new Date(b.fecha).getTime() >= ahora)
    return proximo ?? bingos[bingos.length - 1]
  } catch (e) {
    console.error('[bingoActivo] error', e)
    return null
  }
}
