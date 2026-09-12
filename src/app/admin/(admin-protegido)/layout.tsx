import { redirect } from 'next/navigation'
import { requireAdminConMotivo } from '@/lib/adminAuth'
import AdminNav from '@/components/AdminNav'

// Protege todo /admin/* (salvo /admin/login): sin sesión de Google
// autorizada, redirige al login antes de renderizar cualquier página hija.
// También agrega la barra de navegación compartida entre secciones.
export default async function AdminProtegidoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { admin, motivo, email } = await requireAdminConMotivo()
  if (!admin) {
    if (motivo === 'email_no_autorizado') {
      console.warn('[admin] intento de acceso con email no autorizado:', email)
      redirect(`/admin/login?error=${encodeURIComponent(`La cuenta ${email} no tiene acceso al panel.`)}`)
    }
    redirect('/admin/login')
  }

  return (
    <>
      <AdminNav />
      {children}
    </>
  )
}
