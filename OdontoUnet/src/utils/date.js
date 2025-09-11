// src/utils/date.js

// Convierte "YYYY-MM-DD" a un objeto Date en hora local (12:00)
// para evitar que se corra un día por la zona horaria
export function toLocalDate(dateString) {
  if (!dateString) return undefined
  const [year, month, day] = dateString.split("-").map(Number)
  return new Date(year, month - 1, day, 12)
}
