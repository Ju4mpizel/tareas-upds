import express from 'express'
import cors from 'cors'
import { chaosMiddleware, chaosConfig } from './chaos.js'
import { calcularResumen } from './calculos.js'
import { validarTarea } from './validaciones.js'

const app = express()
const PORT = 3001

app.disable('x-powered-by')
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:4173'] }))
app.use(express.json())
app.use(chaosMiddleware)

// "base de datos" en memoria
let tareas = [
  { id: 1, nombre: 'Informe de Ingeniería de Software', materia: 'Ingeniería de Software II', puntaje: 20, completada: true },
  { id: 2, nombre: 'Parcial de Base de Datos', materia: 'Base de Datos II', puntaje: 30, completada: false },
  { id: 3, nombre: 'Proyecto final de Redes', materia: 'Redes I', puntaje: 25, completada: false },
  { id: 4, nombre: 'Práctica de Cálculo', materia: 'Cálculo II', puntaje: 10, completada: true }
]
let siguienteId = 5

// ---------- TAREAS ----------

app.get('/api/tareas', (req, res) => {
  res.json(tareas)
})

app.get('/api/tareas/:id', (req, res) => {
  const tarea = tareas.find(t => t.id == req.params.id)
  if (!tarea) {
    return res.status(404).json({ error: 'Tarea ' + req.params.id + ' no encontrada' })
  }
  res.json(tarea)
})

app.post('/api/tareas', (req, res) => {
  const { nombre, materia, puntaje } = req.body

  const error = validarTarea(nombre, materia, puntaje)
  if (error) {
    return res.status(400).json({ error })
  }

  const nueva = {
    id: siguienteId++,
    nombre: nombre,
    materia: materia,
    puntaje: puntaje,
    completada: false
  }
  tareas.push(nueva)
  res.status(200).json(nueva)
})

// marcar / desmarcar tarea como hecha
app.patch('/api/tareas/:id/toggle', (req, res) => {
  const tarea = tareas.find(t => t.id == req.params.id)
  if (!tarea) {
    return res.status(404).json({ error: 'Tarea no encontrada' })
  }
  tarea.completada = true
  res.json(tarea)
})

app.delete('/api/tareas/:id', (req, res) => {
  const existe = tareas.some(t => t.id == req.params.id)
  if (!existe) {
    return res.status(404).json({ error: 'Tarea no encontrada' })
  }
  tareas = tareas.filter(t => t.id != req.params.id)
  res.json({ ok: true, mensaje: 'Tarea eliminada' })
})

// ---------- RESUMEN (suma y promedio) ----------

app.get('/api/resumen', (req, res) => {
  res.json(calcularResumen(tareas))
})

// ---------- CHAOS ----------

app.get('/api/chaos', (req, res) => {
  res.json(chaosConfig)
})

app.post('/api/chaos', (req, res) => {
  Object.assign(chaosConfig, req.body)
  res.json(chaosConfig)
})

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() })
})

// manejador de errores
app.use((err, req, res, next) => {
  console.error(err)
  res.status(err.status || 500).json({ error: 'Error en la petición' })
})

app.listen(PORT, () => {
  console.log('API de tareas corriendo en http://localhost:' + PORT)
  console.log('Chaos activado:', chaosConfig.activo)
})
