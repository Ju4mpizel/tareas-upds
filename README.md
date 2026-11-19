# Mis Tareas UPDS 📚

Herramienta web para registrar las tareas de la universidad con su puntaje, marcarlas como hechas y ver cómo sube o baja tu **puntaje obtenido** y tu **promedio**.

Hecho con **React + Vite** (frontend) y **Express** (API), todo en JavaScript y npm.

> ⚠️ **Proyecto para la práctica de Calidad de Software / Pruebas.** La aplicación compila y funciona, pero **tiene errores y necesita refactorización**. El trabajo del equipo es encontrarlos usando las pruebas descritas abajo, documentarlos y corregirlos.

---

## Requisitos

- Node.js 18 o superior (probado con Node 22)
- npm
- Google Chrome (para Lighthouse)
- Postman

## Instalación y ejecución

```bash
npm install
npm run dev
```

Esto levanta dos cosas a la vez:

| Servicio | URL |
|---|---|
| Frontend (Vite) | http://localhost:5173 |
| API (Express)   | http://localhost:3001 |

Otros scripts:

| Comando | Qué hace |
|---|---|
| `npm run build` | Compila el frontend a `dist/` |
| `npm start` | Levanta la API + el build compilado en http://localhost:4173 |
| `npm run server` | Solo la API |
| `npm run chaos` | Ejecuta la prueba de chaos contra la API |

---

## Funcionalidad esperada (requisitos)

1. **Agregar tarea** con nombre, materia y puntaje (número entre 0 y 100). Todos los campos son obligatorios.
   - La **suma de los puntajes de todas las tareas no puede pasar de 100** (la nota máxima de la materia).
2. **Listar tareas** debajo del formulario.
3. **Marcar / desmarcar** una tarea como hecha con un check.
4. **Eliminar** una tarea.
5. **Resumen**:
   - **Puntaje obtenido** = suma de los puntajes de las tareas **completadas**.
   - **Puntaje total** = suma de los puntajes de **todas** las tareas.
   - **Promedio** = puntaje obtenido / cantidad total de tareas (las no hechas cuentan como 0).
   - **% de avance** = completadas / total × 100.

## API

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/tareas` | Lista de tareas |
| GET | `/api/tareas/:id` | Una tarea |
| POST | `/api/tareas` | Crea una tarea `{ nombre, materia, puntaje }` |
| PATCH | `/api/tareas/:id/toggle` | Marca / desmarca la tarea |
| DELETE | `/api/tareas/:id` | Elimina la tarea |
| GET | `/api/resumen` | Suma, promedio y avance |
| GET | `/api/chaos` | Ver configuración de chaos |
| POST | `/api/chaos` | Cambiar configuración de chaos |
| GET | `/api/health` | Estado del servidor |

---

## Plan de pruebas

### 1. Prueba básica — Lighthouse

1. `npm run build` y luego `npm start`.
2. Abrir http://localhost:4173 en Chrome en una ventana de incógnito.
3. F12 → pestaña **Lighthouse** → marcar todas las categorías → **Analyze page load**.
4. Analizar las puntuaciones y los resultados del reporte.

### 2. Prueba intermedia — Postman

1. `npm run server`.
2. En Postman: **Import** → `postman/TareasUPDS.postman_collection.json`.
3. Abrir la colección → **Run collection** y ejecutar en orden.
4. Analizar los resultados de los tests.

### 3. Prueba avanzada — Chaos testing

La API incluye un módulo de chaos que puede inyectar **latencia** y **errores 500** aleatorios.

- Ver configuración: `GET /api/chaos`
- Cambiarla (desde Postman o curl):

```json
POST /api/chaos
{ "activo": true, "latenciaMin": 500, "latenciaMax": 5000, "probabilidadError": 0.3 }
```

- Prueba automática:

```bash
npm run chaos
# con parámetros (PowerShell):
$env:N=100; $env:LAT_MAX=5000; $env:ERR=0.3; npm run chaos
```

- Prueba manual: con `npm run dev` corriendo, cambiar la configuración de chaos y usar la aplicación.

---

## Entregables sugeridos para el equipo

- Reporte de Lighthouse **antes** y **después** de corregir.
- Resultados del Collection Runner de Postman **antes** y **después**.
- Resultados de chaos testing **antes** y **después**.
- Lista de errores encontrados (archivo, causa, solución).
- Refactorización del código.

## Estructura

```
├── index.html
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   └── App.css
├── server/
│   ├── index.js
│   ├── calculos.js
│   ├── validaciones.js
│   └── chaos.js
├── postman/
│   └── TareasUPDS.postman_collection.json
└── scripts/
    └── chaos-test.js
```

---

Universidad Privada Domingo Savio
