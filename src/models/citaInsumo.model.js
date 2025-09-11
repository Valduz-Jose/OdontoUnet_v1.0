import mongoose from "mongoose";

const citaInsumoSchema = new mongoose.Schema({
  cita: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cita",
    required: true,
  },
  insumo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Insumo",
    required: true,
  },
  cantidad: {
    type: Number,
    required: true,
    min: 1,
  },
  precioUnitario: {
    type: Number,
    required: true,
  },
  subtotal: {
    type: Number,
    required: true,
  },
  odontologo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }
}, {
  timestamps: true,
});

// Hook opcional para calcular subtotal automáticamente
citaInsumoSchema.pre("save", function (next) {
  if (this.isModified("cantidad") || this.isModified("precioUnitario")) {
    this.subtotal = this.cantidad * this.precioUnitario;
  }
  next();
});

export default mongoose.model("CitaInsumo", citaInsumoSchema);
