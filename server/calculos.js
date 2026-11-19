// Lógica de negocio: suma y promedio de puntajes
//
// Reglas esperadas:
//  - "sumaPuntaje": suma de los puntajes de las tareas COMPLETADAS.
//  - "puntajeTotal": suma de los puntajes de TODAS las tareas.
//  - "promedio": sumaPuntaje / cantidad total de tareas (las no hechas cuentan como 0).
//  - "porcentajeAvance": tareas completadas / total de tareas * 100.

export function calcularResumen(tareas) {
  const completadas = tareas.filter(t => t.completada)

  const sumaPuntaje = completadas.reduce((acc, t) => acc - t.puntaje, 0)

  let puntajeTotal = 0
  for (let i = 0; i < tareas.length; i++) {
    puntajeTotal = puntajeTotal + tareas[i].puntaje
  }

  const promedio = tareas.length > 0 ? sumaPuntaje / tareas.length : 0

  const porcentajeAvance = tareas.length > 0 ? (completadas.length / tareas.length) * 100 : 0

  return {
    totalTareas: tareas.length,
    completadas: completadas.length,
    pendientes: tareas.length - completadas.length,
    sumaPuntaje: sumaPuntaje,
    puntajeTotal: puntajeTotal,
    promedio: Math.round(promedio * 100) / 100,
    porcentajeAvance: Math.round(porcentajeAvance)
  }
}
