import { redirect } from 'next/navigation'
import { obtenerBingoActivo } from '@/lib/bingoActivo'

// /evento sin slug: redirige al bingo activo detectado automáticamente,
// para no romper los links existentes ("Comprar entradas" del header y
// del banner). Cada evento individual vive en /evento/[slug].
export default async function EventoIndexPage() {
  const bingo = await obtenerBingoActivo()

  // Sin ningún bingo activo no hay a dónde mandar con sentido: mejor la
  // home (que ya oculta los links a "Entradas" en este caso) que un 404.
  redirect(bingo ? `/evento/${bingo.slug}` : '/')
}
