import mongoose from "mongoose";

const citaSchema = new mongoose.Schema({
  paciente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  pacienteDatos: {
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    cedula: { type: String, required: true },
    telefonoContacto: { type: String, required: true },
    telefonoEmergencia: { type: String, required: true },
    edad: { type: Number },
    sexo: { type: String },
    direccion: { type: String },
    carrera: { type: String },
    grupoSanguineo: { type: String },
  },
  odontologo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  motivo: { type: String, required: true },
  fecha: { type: Date, default: Date.now },
  odontograma: { type: mongoose.Schema.Types.Mixed },
  observaciones: { type: String },
  monto: { type: Number, required: true },
  numeroReferencia: { type: String }, // nuevo campo para el bauche/recibo
  insumosUsados: [
    {
      insumo: { type: mongoose.Schema.Types.ObjectId, ref: "Insumo" },
      cantidad: { type: Number, required: true, min: 1 }
    }
  ]
}, {
  timestamps: true,
});

export default mongoose.model("Cita", citaSchema);
