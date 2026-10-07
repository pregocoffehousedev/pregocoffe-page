import { obtenerBingoActivo } from './bingoActivo'

// ¿Hay un bingo activo cuya fecha aún no pasó? Compartido entre el layout
// (lo resuelve en el servidor para el primer render, sin parpadeo) y el
// endpoint /api/eventos/bingo-vigente (usado por el cliente tras montar).
export async function obtenerBingoVigente() {
  const bingo = await obtenerBingoActivo()
  return Boolean(bingo && new Date(bingo.fecha).getTime() >= Date.now())
}
