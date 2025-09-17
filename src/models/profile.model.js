import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    telefono: { type: String, trim: true },
    direccion: { type: String, trim: true },
    fechaNacimiento: { type: Date },
    especialidad: { type: String, trim: true },
    numeroLicencia: { type: String, trim: true },
    biografia: { type: String, trim: true },
    foto: { type: String }, // nombre del archivo de la foto

    // Nuevo campo para días de trabajo
    diasTrabajo: [
      {
        type: String,
        enum: [
          "Lunes",
          "Martes",
          "Miércoles",
          "Jueves",
          "Viernes",
          "Sábado",
          "Domingo",
        ],
      },
    ],

    // Horarios de trabajo (opcional para futuro)
    horarioInicio: { type: String, default: "8:00 AM" },
    horarioFin: { type: String, default: "5:00 PM" },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Profile", profileSchema);
