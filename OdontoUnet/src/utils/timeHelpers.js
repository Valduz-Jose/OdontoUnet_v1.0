// timeHelpers.js

// Convierte un horario en formato '8:00 AM' a '08:00' para el input de tipo time
export const handleTimeChange = (timeValue) => {
  if (!timeValue) return "";
  const [time, modifier] = timeValue.split(" ");
  let [hours, minutes] = time.split(":");

  if (hours === "12") {
    hours = "00";
  }
  if (modifier === "PM") {
    hours = parseInt(hours, 10) + 12;
  }
  return `${hours.toString().padStart(2, "0")}:${minutes}`;
};

// Valida si la hora de fin es posterior a la de inicio
export const validateTimeRange = (startTime, endTime) => {
  if (!startTime || !endTime) return true;
  const startHours = parseInt(startTime.split(":")[0]);
  const startMinutes = parseInt(startTime.split(":")[1].split(" ")[0]);
  const endHours = parseInt(endTime.split(":")[0]);
  const endMinutes = parseInt(endTime.split(":")[1].split(" ")[0]);

  if (startHours < endHours) return true;
  if (startHours === endHours && startMinutes < endMinutes) return true;
  return false;
};
