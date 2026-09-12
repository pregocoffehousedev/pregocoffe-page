import { LOCAL } from '@/data/local'

export default function ParaLlevar() {
  const numero = LOCAL.telefono.replace(/\D/g, '')
  const mensaje = encodeURIComponent(
    'Hola! Quiero hacer un pedido para retirar en el local.',
  )

  return (
    <section id="para-llevar" className="scroll-mt-24">
      <div className="overflow-hidden rounded-2xl border border-salvia-100 bg-white p-8 sm:p-10">
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
          <div>
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-salvia-400">
              Para llevar
            </p>
            <h2 className="mt-2 text-2xl font-bold text-salvia-800 sm:text-3xl">
              ¿Prefieres pedirlo desde casa?
            </h2>
            <p className="mt-3 max-w-lg text-cafe-600">
              Pide por PedidosYa y te lo llevamos, o escríbenos por WhatsApp
              para coordinar el retiro en el local.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <a
              href={LOCAL.pedidosYa}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-full bg-[#FF0546] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Pedir por PedidosYa
            </a>
            <a
              href={`https://wa.me/${numero}?text=${mensaje}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-full border border-salvia-200 px-6 py-3 text-sm font-medium text-salvia-700 transition hover:bg-salvia-50"
            >
              Retiro por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
