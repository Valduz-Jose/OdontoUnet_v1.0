import mongoose from "mongoose";
import dienteSchema from "./dienteSchema.js";

const citaSchema = new mongoose.Schema(
  {
    paciente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    pacienteDatos: {
      nombre: String,
      apellido: String,
      cedula: String,
      telefonoContacto: String,
      telefonoEmergencia: String,
      edad: Number,
      sexo: String,
      direccion: String,
      carrera: String,
      grupoSanguineo: String,
    },
    odontologo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    motivo: {
      type: String,
      required: true,
    },
    odontograma: {
      type: [dienteSchema], // Snapshot del odontograma en esa cita
      default: undefined,
    },
    observaciones: {
      type: String,
      default: "",
    },
    tratamientos: {
      type: [String],   // lista de tratamientos
      default: [],
    },
    monto: {
      type: Number,
      default: 0,
    },
    numeroReferencia: {
      type: String,
      default: "",
    },
    insumosUsados: [
      {
        insumo: { type: mongoose.Schema.Types.ObjectId, ref: "Insumo" },
        cantidad: Number,
      },
    ],
    fecha: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Cita", citaSchema);
