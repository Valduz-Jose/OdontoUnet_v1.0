import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
    nombre: { type: String, required: true, trim: true },
    apellido: { type: String, required: true, trim: true },
    cedula: { type: String, required: true, unique: true },
    fechaNacimiento: { type: Date, required: true },
    edad: { type: Number, required: true },
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
    user:{//para asignar a quien pertenece
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true
    }
},{
    timestamps:true
})

export default mongoose.model("Patient",patientSchema);