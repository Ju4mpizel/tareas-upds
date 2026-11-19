// Middleware de "chaos engineering"
// Inyecta latencia aleatoria y errores 500 aleatorios en la API.
//
// Se puede configurar en caliente con:
//   GET  /api/chaos          -> ver configuración
//   POST /api/chaos  {json}  -> cambiar configuración
//
// Ejemplo: { "activo": true, "latenciaMin": 500, "latenciaMax": 5000, "probabilidadError": 0.3 }

export const chaosConfig = {
  activo: true,
  latenciaMin: 200,
  latenciaMax: 2500,
  probabilidadError: 0.1
}

export function chaosMiddleware(req, res, next) {
  if (!chaosConfig.activo) return next()

  // las rutas de configuración de chaos no se afectan
  if (req.path.startsWith('/api/chaos')) return next()

  const latencia =
    chaosConfig.latenciaMin +
    Math.random() * (chaosConfig.latenciaMax - chaosConfig.latenciaMin)

  setTimeout(() => {
    if (Math.random() < chaosConfig.probabilidadError) {
      return res.status(500).json({ error: 'Fallo interno simulado (chaos)' })
    }
    res.setHeader('X-Chaos-Latency', Math.round(latencia) + 'ms')
    next()
  }, latencia)
}
