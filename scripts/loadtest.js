// Prueba de carga: simula 300 personas entrando a la vez (2x lo esperado).
// Uso: k6 run scripts/loadtest.js
//      BASE_URL=https://tu-sitio.vercel.app k6 run scripts/loadtest.js
import http from 'k6/http'
import { check, sleep } from 'k6'

const BASE = __ENV.BASE_URL || 'http://localhost:3000'

export const options = {
  stages: [
    { duration: '30s', target: 100 }, // rampa
    { duration: '1m', target: 300 },  // pico: 300 usuarios simultáneos
    { duration: '30s', target: 0 },   // bajada
  ],
  thresholds: {
    http_req_duration: ['p(95)<800'], // 95% bajo 800ms
    http_req_failed: ['rate<0.01'],   // menos de 1% de errores
  },
}

export default function () {
  const res = http.get(`${BASE}/evento`)
  check(res, {
    'status 200': (r) => r.status === 200,
    'carga rápida': (r) => r.timings.duration < 1000,
  })
  sleep(Math.random() * 3 + 1)
}
