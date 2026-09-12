/**
 * ⚠️ DATOS DEL LOCAL — REEMPLAZAR ANTES DE PUBLICAR
 *
 * Todo lo editable del sitio vive aquí: dirección, horarios, redes y carta.
 * No hace falta tocar componentes para actualizar precios u horarios.
 */

export const LOCAL = {
  nombre: 'Pregò Coffee House',
  descriptor: 'Cafetería de especialidad y panadería artesanal',
  direccion: '1 Sur 899',
  comuna: 'Talca',
  // TODO: teléfono real (formato internacional para el link de WhatsApp)
  telefono: '+56912345678',
  telefonoVisible: '+56 9 1234 5678',
  // TODO: email real de contacto
  email: 'hola@pregocoffee.cl',
  instagram: 'pregocoffeehouse',
  // TODO: link real de la tienda en PedidosYa (perfil del local → compartir)
  pedidosYa: 'https://www.pedidosya.cl/',
  // TODO: afinar coordenadas exactas del local.
  // Google Maps → clic derecho sobre el punto → copiar coordenadas.
  // Estas apuntan al centro de Talca, cerca de 1 Sur 899.
  coords: { lat: -35.4264, lng: -71.6554 },
} as const

/**
 * ⚠️ DATOS BANCARIOS — REEMPLAZAR ANTES DE PUBLICAR
 *
 * Se muestran en el checkout de eventos para pagos por transferencia
 * (sin intermediario, sin comisión). El comprobante se coordina por
 * WhatsApp: no se sube ni se guarda ningún archivo.
 */
export const CUENTA_BANCARIA = {
  banco: 'Banco Estado',
  tipoCuenta: 'Cuenta RUT',
  numero: '12345678',
  titular: 'Pregò Coffee House SpA',
  rut: '76.123.456-7',
  email: 'hola@pregocoffee.cl',
} as const

/**
 * Horarios por día. `abre: null` significa cerrado ese día.
 */
export type Horario =
  | { dia: string; abre: string; cierra: string }
  | { dia: string; abre: null; cierra: null }

export const HORARIOS: readonly Horario[] = [
  { dia: 'Lunes', abre: '08:00', cierra: '19:30' },
  { dia: 'Martes', abre: '08:00', cierra: '19:30' },
  { dia: 'Miércoles', abre: '08:00', cierra: '19:30' },
  { dia: 'Jueves', abre: '08:00', cierra: '19:30' },
  { dia: 'Viernes', abre: '08:00', cierra: '19:30' },
  { dia: 'Sábado', abre: '09:30', cierra: '15:30' },
  { dia: 'Domingo', abre: null, cierra: null },
] as const

/** Carta. Precios en pesos chilenos, sin decimales. */
export const CARTA = [
  {
    categoria: 'Café',
    items: [
      { nombre: 'Espresso', desc: 'Doble, de origen', precio: 2500 },
      { nombre: 'Cortado', desc: 'Espresso con un toque de leche', precio: 3000 },
      { nombre: 'Flat white', desc: 'Leche texturizada, sin espuma seca', precio: 4200 },
      { nombre: 'Latte', desc: 'Suave y cremoso', precio: 4200 },
      { nombre: 'Cappuccino', desc: 'Con cacao espolvoreado', precio: 4000 },
      { nombre: 'Iced coffee', desc: 'Café frío sobre hielo', precio: 4000 },
      { nombre: 'Filtrado V60', desc: 'Método manual, grano de la semana', precio: 4500 },
      { nombre: 'Affogato', desc: 'Helado de vainilla ahogado en espresso', precio: 4800 },
    ],
  },
  {
    categoria: 'Sin café',
    items: [
      { nombre: 'Iced matcha', desc: 'Matcha ceremonial y leche fría', precio: 5000 },
      { nombre: 'Matcha naranja', desc: 'Matcha sobre jugo de naranja y hielo', precio: 5200 },
      { nombre: 'Matcha latte', desc: 'Caliente, con leche vaporizada', precio: 5000 },
      { nombre: 'Chai latte', desc: 'Especias infusionadas en casa', precio: 4500 },
      { nombre: 'Matcha affogato', desc: 'Helado sobre matcha ceremonial', precio: 5300 },
      { nombre: 'Chocolate caliente', desc: 'Chocolate 70%', precio: 4300 },
      { nombre: 'Limonada de la casa', desc: 'Menta y jengibre', precio: 3800 },
    ],
  },
  {
    categoria: 'Panadería y pastelería',
    items: [
      { nombre: 'Pan de masa madre', desc: 'Hogaza entera, fermentación de 24 h', precio: 5500 },
      { nombre: 'Croissant', desc: 'Mantequilla, laminado cada mañana', precio: 3200 },
      { nombre: 'Croissant de almendras', desc: 'Relleno de frangipane', precio: 4000 },
      { nombre: 'Rol de canela', desc: 'Con glaseado de queso crema', precio: 4200 },
      { nombre: 'New York cookie', desc: 'Centro blando, chips de chocolate', precio: 3500 },
      { nombre: 'Red velvet', desc: 'Porción individual', precio: 4500 },
      { nombre: 'Cheesecake del día', desc: 'Consultar sabor en vitrina', precio: 4800 },
    ],
  },
  {
    categoria: 'Cocina',
    items: [
      { nombre: 'Pizza margarita', desc: 'Masa de fermentación lenta', precio: 8900 },
      { nombre: 'Pizza de la casa', desc: 'Rúcula, tomate confitado y parmesano', precio: 10500 },
      { nombre: 'Tabla para compartir', desc: 'Quesos, charcutería y pan', precio: 14900 },
      { nombre: 'Sándwich de pollo', desc: 'En pan de masa madre', precio: 7500 },
      { nombre: 'Avocado toast', desc: 'Palta, huevo, sésamo negro y flor comestible', precio: 7900 },
      { nombre: 'Huevos revueltos', desc: 'En sartén de hierro, con pan tostado', precio: 6900 },
    ],
  },
] as const

/**
 * Galería. Fotos reales optimizadas desde public/galeria/prego/
 * (originales sin comprimir) a public/galeria/fotos/ (1600px, ~200 KB).
 */
export const GALERIA = [
  { src: '/fotos/brunch-mesa.jpg', alt: 'Mesa de brunch con tostadas de palta, latte y cheesecake' },
  { src: '/fotos/iced-matcha.jpg', alt: 'Iced matcha con naranja recién servido' },
  { src: '/fotos/ny-cookies.jpg', alt: 'New York cookies saliendo del horno' },
  { src: '/fotos/interior-local.jpg', alt: 'Interior del local con sillones verdes y mesas de mármol' },
  { src: '/fotos/affogato.jpg', alt: 'Affogato y matcha affogato con helado' },
  { src: '/fotos/huevos-pan.jpg', alt: 'Huevos revueltos en sartén con pan tostado' },
] as const

/**
 * ⚠️ TALLERES — REEMPLAZAR POR LOS TALLERES REALES DEL MES
 *
 * `instructor` puede ser alguien del equipo de Prego o una persona externa
 * (usa `externo: true` para mostrar el badge "Instructor invitado").
 */
export const TALLERES: readonly {
  nombre: string
  desc: string
  fecha: string
  instructor: string
  externo?: boolean
  cupos: number
  precio: number
}[] = [
  {
    nombre: 'Introducción a la cata de café',
    desc: 'Aromas, acidez y cuerpo: aprende a describir una taza como un catador.',
    fecha: 'Sáb 12 sep · 11:00',
    instructor: 'Equipo Prego',
    cupos: 12,
    precio: 15000,
  },
  {
    nombre: 'Latte art para principiantes',
    desc: 'Técnica de vertido y texturizado de leche, de cero a tu primer corazón.',
    fecha: 'Mié 16 sep · 18:30',
    instructor: 'Equipo Prego',
    cupos: 8,
    precio: 18000,
  },
  {
    nombre: 'Masa madre desde casa',
    desc: 'Cómo mantener y hornear con tu propio cultivo de masa madre.',
    fecha: 'Dom 20 sep · 10:30',
    instructor: 'Javiera Muñoz',
    externo: true,
    cupos: 10,
    precio: 22000,
  },
] as const

/**
 * ⚠️ RESEÑAS — REEMPLAZAR POR RESEÑAS REALES ANTES DE PUBLICAR
 *
 * Publicar testimonios inventados como si fueran de clientes reales
 * es engañoso y, en Chile, puede infringir la Ley del Consumidor.
 * Cópialas textuales desde Google Maps o Instagram, con el nombre
 * que la persona usó públicamente.
 *
 * Si aún no tienes reseñas, deja el array vacío: la sección
 * simplemente no se renderiza.
 */
export const RESENAS: readonly {
  texto: string
  autor: string
  estrellas: number
  fuente?: string
}[] = [
  // { texto: '…', autor: 'María G.', estrellas: 5, fuente: 'Google' },
]
