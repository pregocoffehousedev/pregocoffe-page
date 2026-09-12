import { supabaseAdmin } from '@/lib/supabase'
import { fechaLarga } from '@/lib/format'

export const dynamic = 'force-dynamic'

// Vista pública de una entrada (lo que abre el QR al escanearlo).
// No marca la entrada como usada — eso lo hace el panel de la puerta.
export default async function EntradaPage({
  params,
}: {
  params: Promise<{ codigo: string }>
}) {
  const { codigo } = await params

  const { data } = await supabaseAdmin()
    .from('entradas')
    .select('codigo, usada, usada_en, eventos(nombre, fecha, lugar), reservas(comprador_nombre)')
    .eq('codigo', codigo.toUpperCase())
    .single()

  if (!data) {
    return (
      <div className="mx-auto max-w-sm rounded-xl border border-red-200 bg-red-50 p-8 text-center">
        <p className="text-lg font-semibold text-red-800">Entrada no encontrada</p>
        <p className="mt-2 text-sm text-red-600">Verifica el código e inténtalo de nuevo.</p>
      </div>
    )
  }

  const evento: any = Array.isArray(data.eventos) ? data.eventos[0] : data.eventos
  const reserva: any = Array.isArray(data.reservas) ? data.reservas[0] : data.reservas

  return (
    <div className="mx-auto max-w-sm overflow-hidden rounded-xl border border-salvia-100 bg-white">
      <div className="bg-salvia-600 p-6 text-center text-white">
        <p className="text-xs uppercase tracking-wider opacity-80">Entrada</p>
        <p className="mt-1 text-lg font-semibold">{evento?.nombre}</p>
      </div>
      <div className="space-y-3 p-6 text-sm">
        <div>
          <p className="text-cafe-400">A nombre de</p>
          <p className="font-medium text-salvia-800">{reserva?.comprador_nombre}</p>
        </div>
        <div>
          <p className="text-cafe-400">Fecha</p>
          <p className="font-medium text-salvia-800">{fechaLarga(evento?.fecha)}</p>
        </div>
        <div>
          <p className="text-cafe-400">Lugar</p>
          <p className="font-medium text-salvia-800">{evento?.lugar}</p>
        </div>
        <div>
          <p className="text-cafe-400">Código</p>
          <p className="font-mono text-lg tracking-widest text-cafe-900">{data.codigo}</p>
        </div>
      </div>
      <div
        className={`p-4 text-center text-sm font-medium ${
          data.usada ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
        }`}
      >
        {data.usada ? '⚠️ Entrada ya utilizada' : '✓ Entrada válida'}
      </div>
    </div>
  )
}
