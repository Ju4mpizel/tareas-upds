// Validaciones de una tarea antes de guardarla
// Reglas: nombre y materia obligatorios, puntaje numérico entre 0 y 100.

export function validarTarea(nombre, materia, puntaje) {
  if (!nombre) {
    return 'El nombre es obligatorio'
  }

  if (!materia) {
    return 'La materia es obligatoria'
  }

  if (typeof puntaje !== 'number' || isNaN(puntaje)) {
    return 'El puntaje debe ser un número'
  }

  if (puntaje < 0 && puntaje > 100) {
    return 'El puntaje debe estar entre 0 y 100'
  }

  return null
}
