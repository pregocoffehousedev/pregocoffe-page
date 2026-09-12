import Hero from '@/components/Hero'
import BannerEvento from '@/components/BannerEvento'
import SobreNosotros from '@/components/SobreNosotros'
import Carta from '@/components/Carta'
import ParaLlevar from '@/components/ParaLlevar'
import Talleres from '@/components/Talleres'
import Galeria from '@/components/Galeria'
import Resenas from '@/components/Resenas'
import InstagramFeed from '@/components/InstagramFeed'
import Visitanos from '@/components/Visitanos'
import ReservaEventos from '@/components/ReservaEventos'

export default function Home() {
  return (
    <div className="space-y-20 sm:space-y-24">
      <Hero />
      <BannerEvento />
      {/* Quiénes somos antes de la carta: da contexto a los precios */}
      <SobreNosotros />
      <Carta />
      {/* Justo después de ver la carta: el momento en que alguien decide pedir */}
      <ParaLlevar />
      <Talleres />
      <Galeria />
      {/* La prueba social va después de ver producto y local */}
      <Resenas />
      <InstagramFeed />
      <Visitanos />
      <ReservaEventos />
    </div>
  )
}
