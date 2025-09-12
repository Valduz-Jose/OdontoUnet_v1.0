import mongoose from "mongoose";

const dienteSchema = new mongoose.Schema({
  numero: {
    type: Number,
    required: true,
    min: 1,
    max: 32, // 32 dientes
  },
  estado: {
    type: String,
    enum: [
      "Sano",
      "Cariado",
      "Obturado",
      "Endodoncia",
      "Ausente",
      "Extraído",
      "Sellado",
      "Corona",
      "Fracturado",
      "Implante",
    ],
    default: "Sano",
  },
}, { _id: false }); // No necesitamos _id en cada diente

export default dienteSchema;
