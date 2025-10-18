import mongoose from "mongoose";

const insumoSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, unique: true, trim: true },
    descripcion: { type: String, trim: true },
    cantidadDisponible: { type: Number, required: true, min: 0 },
    unidadMedida: { type: String, required: true, trim: true }, // Ej: unidades, ml, cajas
    precioUnitario: { type: Number, default: 0 }, // opcional
    user: {
      // usuario que registró el insumo
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Insumo", insumoSchema);

// Fragmento de app.js - Configuración de CORS
const allowedOrigins = [
  "http://localhost:5173",
  "https://odontounet-frontend.vercel.app", // Frontend en Producción
];

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       // ... Lógica de verificación
//     },
//     credentials: true, // Crucial para el envío de HttpOnly Cookies
//     // ...
//   })
// );
