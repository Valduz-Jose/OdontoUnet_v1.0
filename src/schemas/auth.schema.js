import { z } from "zod";

export const registerSchema = z.object({
  username: z
    .string({
      required_error: "El nombre de usuario es obligatorio",
    })
    .min(3, {
      message: "El nombre de usuario debe tener al menos 3 caracteres",
    })
    .max(20, {
      message: "El nombre de usuario no puede exceder 20 caracteres",
    })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message:
        "El nombre de usuario solo puede contener letras, números y guiones bajos",
    }),

  email: z
    .string({
      required_error: "El email es obligatorio",
    })
    .email({
      message: "Ingresa un email válido",
    })
    .min(1, {
      message: "El email no puede estar vacío",
    }),

  password: z
    .string({
      required_error: "La contraseña es obligatoria",
    })
    .min(6, {
      message: "La contraseña debe tener al menos 6 caracteres",
    })
    .max(50, {
      message: "La contraseña no puede exceder 50 caracteres",
    })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
      message:
        "La contraseña debe contener al menos una mayúscula, una minúscula y un número",
    }),

  doctorKey: z
    .string({
      required_error: "La clave de registro es obligatoria",
    })
    .min(1, {
      message: "La clave de registro no puede estar vacía",
    }),

  // Campos del perfil (opcionales en el registro)
  telefono: z.string().optional(),
  direccion: z.string().optional(),
  fechaNacimiento: z.string().optional(),
  especialidad: z.string().optional(),
  numeroLicencia: z.string().optional(),
  biografia: z.string().optional(),
});

export const loginSchema = z.object({
  email: z
    .string({
      required_error: "El email es obligatorio",
    })
    .email({
      message: "Ingresa un email válido",
    })
    .min(1, {
      message: "El email no puede estar vacío",
    }),

  password: z
    .string({
      required_error: "La contraseña es obligatoria",
    })
    .min(1, {
      message: "La contraseña no puede estar vacía",
    }),
});
