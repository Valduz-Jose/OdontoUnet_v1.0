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

// Middleware para asegurar que siempre haya un odontograma válido
patientSchema.pre('save', function(next) {
  // Si no hay odontograma o está vacío, crear uno inicial
  if (!this.odontograma || this.odontograma.length === 0) {
    this.odontograma = initialOdontograma;
  }
  
  // Asegurar que todos los números de diente están presentes
  const existingNumbers = this.odontograma.map(d => d.numero);
  for (let i = 1; i <= 32; i++) {
    if (!existingNumbers.includes(i)) {
      this.odontograma.push({ numero: i, estado: "Sano" });
    }
  }
  
  // Ordenar por número de diente
  this.odontograma.sort((a, b) => a.numero - b.numero);
  
  next();
});

export default mongoose.model("Patient", patientSchema);