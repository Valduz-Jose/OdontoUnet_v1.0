import dotenv from "dotenv";
dotenv.config();

export const TOKEN_SECRET = process.env.TOKEN_SECRET || "clavesecreta";
export const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/odontounet";
export const ADMIN_CREATION_KEY =
  process.env.ADMIN_CREATION_KEY || "admin_unet_2024";
export const DOCTOR_REGISTRATION_KEY =
  process.env.DOCTOR_REGISTRATION_KEY || "doctor_unet_2024";
