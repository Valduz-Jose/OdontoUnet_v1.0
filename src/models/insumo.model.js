import mongoose from "mongoose";

const insumoSchema = new mongoose.Schema({
  nombre: { type: String, required: true, unique: true, trim: true },
  descripcion: { type: String, trim: true },
  cantidadDisponible: { type: Number, required: true, min: 0 },
  unidadMedida: { type: String, required: true, trim: true }, // Ej: unidades, ml, cajas
  precioUnitario: { type: Number, default: 0 }, // opcional
  user: { // usuario que registró el insumo
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
}, {
  timestamps: true
});

export default mongoose.model("Insumo", insumoSchema);
