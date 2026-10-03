import { NextResponse } from 'next/server'
import { obtenerBingoVigente } from '@/lib/bingoVigente'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Endpoint público y liviano: ¿hay un bingo activo cuya fecha aún no pasó?
// Lo consulta el header para refrescar tras montar — el primer render ya
// viene resuelto desde el servidor (ver src/app/layout.tsx).
export async function GET() {
  const vigente = await obtenerBingoVigente()
  return NextResponse.json({ vigente })
}
