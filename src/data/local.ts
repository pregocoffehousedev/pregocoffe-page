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
  telefono: '+56981646129',
  telefonoVisible: '+56 9 8164 6129',
  email: 'info@pregocoffeehouse.com',
  instagram: 'pregocoffeehouse',
  pedidosYa:
    'https://www.pedidosya.cl/restaurantes/talca/prego-coffee-house-7766cb4a-244b-470e-a214-d71c014405fc-menu',
  // Coordenadas exactas del local (extraídas del embed de Google Maps).
  coords: { lat: -35.4270218, lng: -71.6640935 },
} as const

/**
 * Datos bancarios. Se muestran en el checkout de eventos para pagos por
 * transferencia (sin intermediario, sin comisión). El comprobante se
 * coordina por WhatsApp: no se sube ni se guarda ningún archivo.
 */
export const CUENTA_BANCARIA = {
  banco: 'Banco Santander',
  tipoCuenta: 'Cuenta Corriente',
  numero: '0-000-9485265-0',
  titular: 'Comercial Ryc Limitada',
  rut: '77.943.242-4',
  email: 'info@pregocoffeehouse.com',
} as const

/**
 * Horarios por día. `abre: null` significa cerrado ese día.
 */
export type Horario =
  | { dia: string; abre: string; cierra: string }
  | { dia: string; abre: null; cierra: null }

export const HORARIOS: readonly Horario[] = [
  { dia: 'Lunes', abre: '08:00', cierra: '20:30' },
  { dia: 'Martes', abre: '08:00', cierra: '20:30' },
  { dia: 'Miércoles', abre: '08:00', cierra: '20:30' },
  { dia: 'Jueves', abre: '08:00', cierra: '20:30' },
  { dia: 'Viernes', abre: '08:00', cierra: '20:30' },
  { dia: 'Sábado', abre: '09:30', cierra: '15:00' },
  { dia: 'Domingo', abre: null, cierra: null },
] as const

/** Carta. Precios en pesos chilenos, sin decimales. */
export const CARTA = [
  {
    categoria: 'Café',
    items: [
      { nombre: 'Espresso', desc: 'Un shot intenso, aromático y concentrado', precio: 2500 },
      { nombre: 'Espresso Macchiato', desc: 'Espresso con una nube de leche texturizada', precio: 2700 },
      { nombre: 'Americano', desc: 'Espresso alargado con agua caliente', precio: 2900 },
      { nombre: 'Cappuccino', desc: 'Espresso, leche vaporizada y espuma cremosa', precio: 3200 },
      { nombre: 'Flat White', desc: 'Doble espresso con una capa fina de leche texturizada', precio: 3500 },
      { nombre: 'Latte', desc: 'Espresso con abundante leche vaporizada', precio: 3500 },
      { nombre: 'Mocaccino', desc: 'Espresso, leche vaporizada y chocolate amargo', precio: 3800 },
      { nombre: 'Babychino', desc: 'Espuma de leche con cacao para los más pequeños', precio: 2500 },
    ],
  },
  {
    categoria: 'Infusiones y especialidades',
    items: [
      { nombre: 'Chai Latte', desc: 'Infusión de especias con leche caliente y espumosa', precio: 3800 },
      { nombre: 'Matcha Latte', desc: 'Té verde matcha batido con leche', precio: 3800 },
      { nombre: 'Dirty Chai', desc: 'Chai latte con un shot de espresso', precio: 4100 },
      { nombre: 'Filtrado de Especialidad', desc: 'Preparado mediante método manual', precio: 5500 },
      { nombre: 'Tetera para Compartir', desc: '', precio: 5100 },
      { nombre: 'Selección de Té', desc: 'Según variedad', precio: 'variable' as const },
    ],
  },
  {
    categoria: 'Mocktails Prego',
    items: [
      { nombre: 'Espresso Tonic', desc: '', precio: 4200 },
      { nombre: 'Matcha Tonic', desc: '', precio: 4200 },
      { nombre: 'Ciao Sole', desc: 'Flor de jamaica y naranja', precio: 3800 },
      { nombre: 'Li Matcha', desc: 'Limonada de matcha con miel natural', precio: 3800 },
      { nombre: 'Mojito de Café', desc: '', precio: 3900 },
    ],
  },
  {
    categoria: 'Bebidas frías',
    items: [
      { nombre: 'Frappuccino', desc: 'Sabores: caramelo, mocaccino o vainilla', precio: 3800 },
      { nombre: 'Affogato', desc: 'Helado artesanal con espresso doble', precio: 4100 },
      { nombre: 'Iced Tea', desc: '', precio: 4200 },
      { nombre: 'Limonada Prego', desc: 'Limón fresco con menta o jengibre', precio: 3500 },
      { nombre: 'Leche con Plátano', desc: '', precio: 3800 },
      { nombre: 'Jugo Natural de Estación', desc: '', precio: 4200 },
    ],
  },
  {
    categoria: 'Bocatas Prego',
    items: [
      { nombre: 'Bocata Prego', desc: 'Jamón, mozzarella, pesto rosso y rúcula', precio: 6500 },
      { nombre: 'Bocata Salmón y Queso Crema', desc: 'Salmón ahumado, queso crema y rúcula fresca', precio: 6800 },
      { nombre: 'Bocata Salame y Queso', desc: 'Salame curado y mozzarella', precio: 5600 },
      { nombre: 'Bocata Hummus y Pimientos', desc: 'Hummus casero, pimientos salteados y rúcula', precio: 5800 },
      { nombre: 'Bocata Jamón y Queso', desc: 'Clásico y fundente', precio: 5600 },
    ],
  },
  {
    categoria: 'Sándwiches de cocina',
    items: [
      { nombre: 'Croissant Mediterráneo', desc: 'Queso, pesto rosso, aceitunas y pasta de tomate', precio: 6500 },
      { nombre: 'Croissant Salmón', desc: 'Queso crema, rúcula, cebollín y salmón ahumado', precio: 8000 },
      { nombre: 'Brioche de Pollo', desc: 'Pollo, cebolla caramelizada, pimientos asados, queso y rúcula', precio: 7000 },
      { nombre: 'Croissant Jamón & Queso', desc: '', precio: 5500 },
      { nombre: 'Brioche de Vacuno', desc: 'Vacuno, queso y cebollín', precio: 7500 },
      { nombre: 'Bagel Salmón', desc: 'Queso crema, pepino, rúcula y salmón ahumado', precio: 8500 },
      { nombre: 'Bagel Jamón & Queso', desc: '', precio: 6000 },
      { nombre: 'Bagel Mediterráneo', desc: 'Queso crema, aceitunas negras, jamón, tomate y rúcula', precio: 7500 },
      { nombre: 'Croissant Vegetariano', desc: 'Champiñones salteados, pimientos asados, queso y rúcula', precio: 6500 },
    ],
  },
  {
    categoria: 'Tostadas',
    items: [
      { nombre: 'Avocado Toast', desc: 'Tostadas de pan artesanal con palta fresca y huevo pochado o revuelto', precio: 8900 },
      { nombre: 'Tostadas con Palta', desc: '', precio: 6500 },
      { nombre: 'Tostadas con Mantequilla y Mermelada', desc: '', precio: 5500 },
      { nombre: 'Tostada Benedictina de Champiñones', desc: 'Pan de Viena con huevo pochado y salsa holandesa', precio: 10800 },
      { nombre: 'Tostada Benedictina de Jamón', desc: 'Pan de Viena con huevo pochado y salsa holandesa', precio: 11400 },
      { nombre: 'Tostada Benedictina de Salmón', desc: 'Pan de Viena con huevo pochado y salsa holandesa', precio: 12100 },
      { nombre: 'Tostada Benedictina de Tocino', desc: 'Pan de Viena con huevo pochado y salsa holandesa', precio: 11000 },
    ],
  },
  {
    categoria: 'Desayunos Prego',
    items: [
      { nombre: 'Paila de Huevos', desc: 'Tres huevos a la paila con pan de la casa', precio: 5600 },
      { nombre: 'Omelette Prego de Verduras', desc: 'Espinaca, zapallito italiano, queso y bechamel', precio: 6900 },
      { nombre: 'Omelette Prego de Tocino', desc: 'Queso, tocino, bechamel y ciboulette', precio: 7200 },
      { nombre: 'Tostadas Francesas', desc: 'Pan dorado con mantequilla y fruta de temporada', precio: 7800 },
      { nombre: 'Granola Bowl', desc: 'Yogurt griego, granola artesanal, frutos secos y fruta fresca', precio: 6100 },
      { nombre: 'Grilled Cheese de Champiñones', desc: 'Quesos fundidos, cebolla caramelizada y bechamel', precio: 5800 },
      { nombre: 'Grilled Cheese de Jamón', desc: 'Quesos fundidos, cebolla caramelizada y bechamel', precio: 6200 },
      { nombre: 'Grilled Cheese de Tocino', desc: 'Quesos fundidos, cebolla caramelizada y bechamel', precio: 6500 },
    ],
  },
  {
    categoria: 'Brunchealo',
    items: [
      {
        nombre: 'Brunchea tu plato favorito',
        desc: 'Adicional a cualquier plato: jugo natural, café a elección (espresso, americano o cappuccino), porción de granola con yogurt y rollito de canela, medialuna o mini pastelitos. Disponible de 08:00 a 13:00 hrs.',
        precio: 6500,
      },
    ],
  },
  {
    categoria: 'Ensaladas',
    items: [
      { nombre: 'Mediterránea', desc: 'Pollo a la plancha, quinoa, hojas verdes, palta y aderezo de mostaza', precio: 8500 },
      { nombre: 'Rústica', desc: 'Lomo liso con papas rústicas y vinagreta balsámica', precio: 10500 },
      { nombre: 'Ensalada di Salmone', desc: 'Salmón sellado con arroz basmati, hojas verdes y vinagreta cítrica', precio: 11500 },
    ],
  },
  {
    categoria: 'Especialidades de la Nonna',
    items: [
      { nombre: 'Lasagna al Ragù della Nonna', desc: '', precio: 11500 },
      { nombre: 'Lasagna Verde al Forno', desc: '', precio: 10500 },
      {
        nombre: 'Pasta Prego',
        desc: 'Spaghetti o rigattoni con salsa a elección: pomodoro, bolognesa, pesto, mantequilla y especias o alfredo. Proteína opcional (lomo o pollo) con costo adicional',
        precio: 9500,
      },
      { nombre: 'Berenjena Prego', desc: '', precio: 7800 },
      { nombre: 'Crema de Champiñones', desc: '', precio: 7500 },
      { nombre: 'Crema de Zapallo', desc: '', precio: 7100 },
    ],
  },
  {
    categoria: 'Hazlo promo almuerzo',
    items: [
      {
        nombre: 'Agrega la promoción',
        desc: 'Incluye jugo natural del día, un entrante (caldo del día o un picoteo) y una porción de mini pastelitos. Disponible desde las 13:00 hrs, sujeto a condiciones',
        precio: 3500,
      },
    ],
  },
  {
    categoria: 'Waffles',
    items: [
      { nombre: 'Waffle (2 unidades)', desc: 'Preparados con salsa y toppings a elección', precio: 5500 },
      { nombre: 'Waffle con Helado (2 unidades)', desc: 'Incluye una porción de helado a elección', precio: 7000 },
    ],
  },
  {
    categoria: 'Helados y postres',
    items: [
      { nombre: 'Affogato', desc: 'Helado artesanal con espresso', precio: 4100 },
      { nombre: 'Brownie con Helado', desc: '', precio: 7500 },
      { nombre: 'Copa de Helado', desc: 'Cuatro bolitas de helado y galleta', precio: 5000 },
      { nombre: 'Extra Bolita de Helado', desc: '', precio: 2500 },
    ],
  },
  {
    categoria: 'Pastelería artesanal',
    items: [
      {
        nombre: 'Selección del día',
        desc: 'Lo disponible en vitrina: productos hechos en casa, elaborados diariamente en nuestra cocina y panadería. Consulta a nuestro equipo por las opciones del día',
        precio: 'variable' as const,
      },
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
 * Reseñas reales de Google Maps, copiadas textuales con el nombre
 * público de quien las escribió. Si el array está vacío, la sección
 * simplemente no se renderiza.
 */
export const RESENAS: readonly {
  texto: string
  autor: string
  estrellas: number
  fuente?: string
}[] = [
  { texto: 'Rico para ser la primera vez ✨', autor: 'Joaquín Pavez', estrellas: 5, fuente: 'Google' },
  { texto: 'Excelente atención todo muy rico felicitaciones...', autor: 'Pilar Cabello', estrellas: 5, fuente: 'Google' },
  { texto: 'Excelente Latte', autor: 'Diego Cornejo Aburto', estrellas: 5, fuente: 'Google' },
  { texto: 'Fue agradable todo, además es petfriendly así que es un plus para talca', autor: 'Anette Parra', estrellas: 5, fuente: 'Google' },
  { texto: 'Muy buen matcha frío!', autor: 'Johann Blackaller', estrellas: 5, fuente: 'Google' },
]

/** Link al perfil de Google Maps, para "Ver todas las reseñas". */
export const GOOGLE_MAPS_URL =
  'https://www.google.com/maps/place/Prego+coffee+house/@-35.4270218,-71.6666684,17z/data=!4m8!3m7!1s0x9665c7f91ed4cee5:0x1e96ffb6a778f4ee!8m2!3d-35.4270218!4d-71.6640935!9m1!1b1!16s%2Fg%2F11wmqxkc36?entry=ttu'
