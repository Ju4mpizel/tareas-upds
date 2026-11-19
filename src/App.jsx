import { useState, useEffect } from 'react'

// TODO: separar en componentes (Formulario, ListaTareas, Resumen...)
// TODO: sacar los fetch a un servicio

function App() {
  const [tareas, setTareas] = useState([])
  const [resumen, setResumen] = useState({})
  const [nombre, setNombre] = useState('')
  const [materia, setMateria] = useState('')
  const [puntaje, setPuntaje] = useState('')
  const [mensaje, setMensaje] = useState('')

  useEffect(() => {
    fetch('/api/tareas')
      .then(res => res.json())
      .then(data => setTareas(data))

    fetch('/api/resumen')
      .then(res => res.json())
      .then(data => setResumen(data))
  }, [])

  function agregarTarea(e) {
    e.preventDefault()
    fetch('/api/tareas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: nombre, materia: materia, puntaje: parseInt(puntaje) })
    })
      .then(res => res.json())
      .then(data => {
        setMensaje('Tarea agregada: ' + data.nombre)
        setNombre('')
        setMateria('')
        setPuntaje('')
        fetch('/api/tareas')
          .then(res => res.json())
          .then(data => setTareas(data))
        fetch('/api/resumen')
          .then(res => res.json())
          .then(data => setResumen(data))
      })
  }

  function marcarTarea(id) {
    fetch('/api/tareas/' + id + '/toggle', { method: 'PATCH' })
      .then(res => res.json())
      .then(() => {
        fetch('/api/tareas')
          .then(res => res.json())
          .then(data => setTareas(data))
        fetch('/api/resumen')
          .then(res => res.json())
          .then(data => setResumen(data))
      })
  }

  function eliminarTarea(id) {
    fetch('/api/tareas/' + id, { method: 'DELETE' })
      .then(res => res.json())
      .then(() => {
        fetch('/api/tareas')
          .then(res => res.json())
          .then(data => setTareas(data))
        fetch('/api/resumen')
          .then(res => res.json())
          .then(data => setResumen(data))
      })
  }

  return (
    <div className="app">
      <div className="fondo">
        <div className="circulo"></div>
        <div className="circulo"></div>
        <div className="circulo"></div>
        <div className="circulo"></div>
        <div className="circulo"></div>
        <div className="circulo"></div>
      </div>

      <header className="encabezado">
        <div className="encabezado-uni">Universidad Privada Domingo Savio</div>
        <h1 className="encabezado-titulo">Mis Tareas</h1>
        <p className="encabezado-sub">Registra tus tareas, márcalas al terminarlas y revisa tu promedio.</p>
      </header>

      <section className="card">
        <h2 className="card-titulo">Agregar tarea</h2>
        <form onSubmit={agregarTarea} className="form">
          <input
            className="input"
            placeholder="Nombre de la tarea"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
          />
          <input
            className="input"
            placeholder="Materia"
            value={materia}
            onChange={e => setMateria(e.target.value)}
          />
          <input
            className="input"
            placeholder="Puntaje (0 - 100)"
            value={puntaje}
            onChange={e => setPuntaje(e.target.value)}
          />
          <button type="submit" className="boton">
            Agregar
          </button>
        </form>
        {mensaje && <div className="mensaje">{mensaje}</div>}
      </section>

      <section className="card">
        <h2 className="card-titulo">Mis tareas</h2>
        {tareas.length === 0 && <p className="vacio">No hay tareas todavía.</p>}
        <ul className="lista">
          {tareas.map(t => (
            <li key={t.id} className={t.completada ? 'item item-hecho' : 'item'}>
              <input
                type="checkbox"
                className="check"
                checked={t.completada}
                onChange={() => marcarTarea(t.id)}
              />
              <div className="item-info">
                <div className="item-nombre">{t.nombre}</div>
                <div className="item-materia">{t.materia}</div>
              </div>
              <div className="item-puntaje">{t.puntaje} pts</div>
              <button className="boton-eliminar" onClick={() => eliminarTarea(t.id)}>
                ✕
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="card">
        <h2 className="card-titulo">Resumen</h2>
        <div className="stats">
          <div className="stat">
            <div className="stat-valor">{resumen.sumaPuntaje}</div>
            <div className="stat-label">Puntaje obtenido</div>
          </div>
          <div className="stat">
            <div className="stat-valor">{resumen.puntajeTotal}</div>
            <div className="stat-label">Puntaje total</div>
          </div>
          <div className="stat">
            <div className="stat-valor">{resumen.promedio}</div>
            <div className="stat-label">Promedio</div>
          </div>
          <div className="stat">
            <div className="stat-valor">
              {resumen.completadas}/{resumen.totalTareas}
            </div>
            <div className="stat-label">Completadas</div>
          </div>
        </div>
        <div className="barra">
          <div className="barra-relleno" style={{ width: resumen.porcentajeAvance + '%' }}></div>
        </div>
        <p className="barra-texto">{resumen.porcentajeAvance}% de avance</p>
      </section>

      <footer className="footer">UPDS · {new Date().getFullYear()}</footer>
    </div>
  )
}

export default App
