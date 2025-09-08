import {z} from 'zod'

export const createPatientSchema = z.object({
    nombre: z.string({
    required_error: "Nombre  es requerido"
    }),
    apellido: z.string({
    required_error: "Apellido es requerido"
    }),
    cedula: z.string({
        required_error: "Cédula es requerida"
    }),
    fechaNacimiento: z.string({
        message: "Fecha de nacimiento inválida"
    }),
    edad: z.coerce.number({
        required_error: "Edad es requerida"
    }),
    sexo: z.enum(["M", "F"], {
        required_error: "Sexo es requerido"
    }),
    telefonoContacto: z.string({
        required_error: "Teléfono de contacto es requerido"
    }),
    telefonoEmergencia: z.string({
        required_error: "Teléfono de emergencia es requerido"
    }),
    direccion: z.string({
        required_error: "Dirección es requerida"
    }),
    carrera: z.string({
        required_error: "Carrera es requerida"
    }),
    grupoSanguineo: z.string({
        required_error: "Grupo sanguíneo es requerido"
    }),
    motivoConsulta: z.string({
        required_error: "Motivo de la consulta es requerido"
    }),
    historiaMedicaGeneral: z.string().optional(),
    alergias: z.string().optional(),
    enfermedadesCronicas: z.string().optional(),
    medicamentos: z.string().optional(),
    condicionEspecial: z.string().optional(),
    cirugias: z.string().optional(),
    antecedentesFamiliares: z.string().optional(),
});

// Nombre y Apellido 
// Cédula 
// Fecha de Nacimiento
// Edad 
// Sexo 
// Teléfono de contacto
// Telefono de emergencia
// Dirección
// Carrera
// Grupo Sanguíneo
// Motivo de la consulta
// Carga de historia médica general 
// Alergias 
// Enfermedades crónicas 
// Medicamentos.
// Condición Especial
// Cirugías
// antecedentes familiares
