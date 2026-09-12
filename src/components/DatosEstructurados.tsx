import { LOCAL, HORARIOS } from '@/data/local'

const DIA_SCHEMA: Record<string, string> = {
  Lunes: 'Monday',
  Martes: 'Tuesday',
  Miércoles: 'Wednesday',
  Jueves: 'Thursday',
  Viernes: 'Friday',
  Sábado: 'Saturday',
  Domingo: 'Sunday',
}

/**
 * JSON-LD para Google. Hace que la ficha del negocio muestre dirección,
 * horarios y estado abierto/cerrado directamente en los resultados de
 * búsqueda y en Maps. Clave para un local con clientela de barrio.
 */
export default function DatosEstructurados() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CafeOrCoffeeShop',
    name: LOCAL.nombre,
    description: LOCAL.descriptor,
    address: {
      '@type': 'PostalAddress',
      streetAddress: LOCAL.direccion,
      addressLocality: LOCAL.comuna,
      addressRegion: 'Maule',
      addressCountry: 'CL',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: LOCAL.coords.lat,
      longitude: LOCAL.coords.lng,
    },
    telephone: LOCAL.telefono,
    email: LOCAL.email,
    sameAs: [`https://instagram.com/${LOCAL.instagram}`],
    servesCuisine: ['Café', 'Panadería', 'Pastelería'],
    priceRange: '$$',
    // Solo los días con horario: omitir domingo indica que está cerrado
    openingHoursSpecification: HORARIOS.filter((h) => h.abre !== null).map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: `https://schema.org/${DIA_SCHEMA[h.dia]}`,
      opens: h.abre,
      closes: h.cierra,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
