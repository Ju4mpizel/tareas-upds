// Prueba de chaos: manda muchas peticiones a la API con el chaos activado
// y mide latencias y errores.
//
// Uso:
//   npm run server          (en una terminal)
//   npm run chaos           (en otra terminal)
//
// Opciones por variables de entorno:
//   N=100                  cantidad de peticiones
//   LAT_MAX=5000           latencia máxima inyectada (ms)
//   ERR=0.3                probabilidad de error (0 a 1)
//   SLA=1000               tiempo máximo aceptable por petición (ms)

const BASE = process.env.BASE_URL || 'http://localhost:3001'
const N = Number(process.env.N || 50)
const SLA = Number(process.env.SLA || 1000)

async function configurarChaos() {
  const config = {
    activo: true,
    latenciaMin: 100,
    latenciaMax: Number(process.env.LAT_MAX || 3000),
    probabilidadError: Number(process.env.ERR || 0.2)
  }
  const res = await fetch(BASE + '/api/chaos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config)
  })
  return res.json()
}

async function unaPeticion(ruta) {
  const inicio = Date.now()
  try {
    const res = await fetch(BASE + ruta)
    return { ok: res.ok, status: res.status, ms: Date.now() - inicio }
  } catch (e) {
    return { ok: false, status: 'ERR', ms: Date.now() - inicio }
  }
}

async function main() {
  console.log('== Chaos test contra', BASE, '==')
  const config = await configurarChaos()
  console.log('Configuración de chaos:', config)

  const rutas = ['/api/tareas', '/api/resumen', '/api/health']
  const promesas = []
  for (let i = 0; i < N; i++) {
    promesas.push(unaPeticion(rutas[i % rutas.length]))
  }
  const resultados = await Promise.all(promesas)

  const tiempos = resultados.map(r => r.ms).sort((a, b) => a - b)
  const errores = resultados.filter(r => !r.ok).length
  const fueraDeSla = resultados.filter(r => r.ms > SLA).length
  const p = q => tiempos[Math.min(tiempos.length - 1, Math.floor(q * tiempos.length))]

  console.log('\nPeticiones:      ', N)
  console.log('Errores (5xx):   ', errores, `(${((errores / N) * 100).toFixed(1)}%)`)
  console.log('Latencia mínima: ', tiempos[0], 'ms')
  console.log('Latencia p50:    ', p(0.5), 'ms')
  console.log('Latencia p95:    ', p(0.95), 'ms')
  console.log('Latencia máxima: ', tiempos[tiempos.length - 1], 'ms')
  console.log(`Fuera de SLA (>${SLA}ms):`, fueraDeSla)

  const pasa = errores === 0 && fueraDeSla === 0
  console.log('\nResultado:', pasa ? 'PASA ✅' : 'FALLA ❌ (la API no es resiliente a latencia/errores)')
  process.exit(pasa ? 0 : 1)
}

main()
