import mongoose from "mongoose";
import dienteSchema from "./dienteSchema.js";

// Generar odontograma inicial con 32 dientes en "Sano"
const initialOdontograma = Array.from({ length: 32 }, (_, i) => ({
  numero: i + 1,
  estado: "Sano",
}));

const patientSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true },
    apellido: { type: String, required: true, trim: true },
    cedula: { type: String, required: true, unique: true },
    fechaNacimiento: { type: String, required: true },
    edad: { type: Number },
    sexo: { type: String, enum: ["M", "F"], required: true },
    telefonoContacto: { type: String, required: true },
    telefonoEmergencia: { type: String, required: true },
    direccion: { type: String, required: true },
    carrera: { type: String, required: true },
    grupoSanguineo: { type: String, required: true },
    motivoConsulta: { type: String, required: true },
    historiaMedicaGeneral: { type: String },
    alergias: { type: String },
    enfermedadesCronicas: { type: String },
    medicamentos: { type: String },
    condicionEspecial: { type: String },
    cirugias: { type: String },
    antecedentesFamiliares: { type: String },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Odontograma actual del paciente
    odontograma: {
      type: [dienteSchema],
      default: initialOdontograma,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Patient", patientSchema);
