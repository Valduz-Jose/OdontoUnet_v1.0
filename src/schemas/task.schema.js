import {z} from 'zod'

export const createTaskSchema = z.object({
    title:z.string({
        required_error:'Title is required',
        message: 'Title is required'
    }),
    description: z.string({
        required_error: "Description must be a string",
        message:"Description must be a string"
    }),
    date: z.string().datetime().optional(),
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
