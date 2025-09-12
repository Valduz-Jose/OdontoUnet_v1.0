// Lista de estados válidos del odontograma
export const estadosDiente = [
  "Sano",
  "Cariado",
  "Obturado",
  "Extraído",
  "Endodoncia",
  "Corona",
  "Fracturado",
  "Implante",
  "Sellado",
  "Ausente"
];

// Colores asociados a cada estado
export const coloresEstados = {
  Sano: "#ffffff",        // blanco
  Cariado: "#f87171",     // rojo claro
  Obturado: "#60a5fa",    // azul
  Extraído: "#9ca3af",    // gris
  Endodoncia: "#fbbf24",  // amarillo
  Corona: "#a78bfa",      // morado
  Fracturado: "#000000",  // negro
  Implante: "#22c55e",    // verde
  Sellado: "#0ea5e9",     // celeste
  Ausente: "#facc15"      // amarillo claro
};

/**
 * Dibuja un odontograma en un canvas
 * @param {CanvasRenderingContext2D} ctx - contexto del canvas
 * @param {Object|Array} odontogramaData - objeto con pares {numero: estado} o array de objetos {numero, estado}
 * @param {number} toothSize - tamaño del diente (default 30px)
 * @param {number} toothSpacing - espacio entre dientes (default 10px)
 */
export function drawTeeth(ctx, odontogramaData, toothSize = 30, toothSpacing = 10) {
  const teethCount = 32;
  
  // Limpiar el canvas
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  
  // Normalizar los datos - convertir array a objeto si es necesario
  let odontogramaMap = {};
  
  if (Array.isArray(odontogramaData)) {
    // Si es array, convertir a objeto
    odontogramaData.forEach(d => {
      if (d && d.numero && d.estado) {
        odontogramaMap[d.numero] = d.estado;
      }
    });
  } else if (typeof odontogramaData === 'object' && odontogramaData !== null) {
    // Si ya es objeto, usar directamente
    odontogramaMap = { ...odontogramaData };
  }

  console.log("drawTeeth - Dibujando con mapa:", odontogramaMap);

  // Dibujar cada diente
  for (let i = 1; i <= teethCount; i++) {
    const x = ((i - 1) % 16) * (toothSize + toothSpacing) + 20;
    const y = i <= 16 ? 20 : 80;
    const status = odontogramaMap[i] || "Sano";

    // Dibujar el cuadrado del diente
    ctx.fillStyle = coloresEstados[status] || "#ffffff";
    ctx.fillRect(x, y, toothSize, toothSize);
    
    // Dibujar el borde
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, toothSize, toothSize);

    // Dibujar el número del diente
    ctx.fillStyle = status === "Sano" || status === "Sellado" ? "#000000" : "#ffffff";
    ctx.font = "12px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(i, x + toothSize/2, y + toothSize/2);
  }
  
  console.log("drawTeeth - Dibujado completado");
}