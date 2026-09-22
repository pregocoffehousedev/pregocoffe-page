'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { LOCAL } from '@/data/local'

/**
 * Burbuja flotante de WhatsApp.
 * Aparece al hacer scroll para no competir con el hero, y en móvil
 * se esconde cuando hay un formulario enfocado (evita tapar el botón
 * de envío con el teclado abierto). No se muestra dentro del panel
 * admin: es contenido para visitantes del sitio público, no para el equipo.
 */
export default function BotonWhatsApp() {
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)
  const [escribiendo, setEscribiendo] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const activo = () => {
      const el = document.activeElement
      const esCampo =
        el instanceof HTMLInputElement ||
        el instanceof HTMLTextAreaElement ||
        el instanceof HTMLSelectElement
      setEscribiendo(Boolean(esCampo))
    }
    document.addEventListener('focusin', activo)
    document.addEventListener('focusout', activo)
    return () => {
      document.removeEventListener('focusin', activo)
      document.removeEventListener('focusout', activo)
    }
  }, [])

  if (pathname?.startsWith('/admin')) return null

  const numero = LOCAL.telefono.replace(/\D/g, '')
  const mensaje = encodeURIComponent(
    '¡Hola! Los encontré en su página web y quería consultar por…',
  )

  return (
    <a
      href={`https://wa.me/${numero}?text=${mensaje}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      className={`group fixed bottom-5 right-5 z-40 flex items-center gap-3 rounded-full bg-[#25D366] py-3.5 pl-4 pr-4 text-white shadow-lg shadow-black/15 transition-all duration-300 hover:pr-5 sm:bottom-7 sm:right-7 ${
        visible && !escribiendo
          ? 'translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-4 opacity-0'
      }`}
    >
      <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884a9.82 9.82 0 0 1 6.988 2.896 9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.359.101 11.945c0 2.096.547 4.142 1.588 5.945L0 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.582 0 11.941-5.359 11.944-11.945A11.86 11.86 0 0 0 20.52 3.45" />
      </svg>
      <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-medium opacity-0 transition-all duration-300 group-hover:max-w-[10rem] group-hover:opacity-100">
        Escríbenos
      </span>
    </a>
  )
}
