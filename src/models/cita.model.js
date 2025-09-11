import mongoose from "mongoose";

const citaSchema = new mongoose.Schema({
  // Referencia al paciente (por si luego quiero enlazar)
  paciente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  // Datos básicos del paciente en el momento de la cita (snapshots)
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
  fecha: { type: Date, default: Date.now }, // siempre en el momento
  odontograma: { type: mongoose.Schema.Types.Mixed }, // luego lo afinamos según diseño
  observaciones: { type: String },
  monto: { type: Number, required: true },
}, {
  timestamps: true,
});

export default mongoose.model("Cita", citaSchema);
