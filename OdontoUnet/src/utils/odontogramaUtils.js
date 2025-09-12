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
 * @param {Object} odontogramaData - objeto con pares {numero: estado}
 * @param {number} toothSize - tamaño del diente (default 30px)
 * @param {number} toothSpacing - espacio entre dientes (default 10px)
 */
export function drawTeeth(ctx, odontogramaData, toothSize = 30, toothSpacing = 10) {
  const teethCount = 32;
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // Crear un mapa para acceder rápido por número
  const odontogramaMap = {};
  odontogramaData.forEach(d => {
    odontogramaMap[d.numero] = d.estado;
  });

  for (let i = 1; i <= teethCount; i++) {
    const x = ((i - 1) % 16) * (toothSize + toothSpacing) + 20;
    const y = i <= 16 ? 20 : 80;
    const status = odontogramaMap[i] || "Sano";

    ctx.fillStyle = coloresEstados[status] || "#ffffff";
    ctx.fillRect(x, y, toothSize, toothSize);
    ctx.strokeStyle = "#000000";
    ctx.strokeRect(x, y, toothSize, toothSize);

    ctx.fillStyle = "#000000";
    ctx.font = "12px Arial";
    ctx.fillText(i, x + 8, y + 20);
  }
}
