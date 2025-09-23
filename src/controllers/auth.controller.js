import User from "../models/user.model.js";
import Profile from "../models/profile.model.js"; // Asegúrate de importar el modelo de perfil
import bcrypt from "bcryptjs";
import { createAccessToken } from "../libs/jwt.js";
import jwt from "jsonwebtoken";
import {
  ADMIN_CREATION_KEY,
  TOKEN_SECRET,
  DOCTOR_REGISTRATION_KEY,
} from "../config.js";

export const register = async (req, res) => {
  const {
    email,
    password,
    username,
    doctorKey,
    // Los campos de perfil son opcionales en el registro
    // ya que se llenarán en la página de perfil
  } = req.body;

  try {
    if (
      doctorKey !== process.env.DOCTOR_REGISTRATION_KEY &&
      doctorKey !== DOCTOR_REGISTRATION_KEY
    ) {
      return res.status(403).json(["Clave de registro de doctor inválida"]);
    }

    const userFound = await User.findOne({ email });
    if (userFound) return res.status(400).json(["Este email ya está en uso"]);

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: passwordHash,
      role: "odontologo",
    });

    const savedUser = await newUser.save();

    // 🔑 **Cambio Clave:** Crear un perfil vacío justo después de crear el usuario.
    const newProfile = new Profile({
      user: savedUser._id,
      // Los demás campos se inician vacíos/por defecto
      telefono: "",
      direccion: "",
      fechaNacimiento: null,
      especialidad: "",
      numeroLicencia: "",
      biografia: "",
      foto: null,
      diasTrabajo: [],
      horarioInicio: "8:00 AM",
      horarioFin: "5:00 PM",
    });
    await newProfile.save();
    // --------------------------------------------------------------------------

    res.json({
      id: savedUser._id,
      username: savedUser.username,
      email: savedUser.email,
      role: savedUser.role,
      createdAt: savedUser.createdAt,
    });
  } catch (error) {
    console.error("Error en registro:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userFound = await User.findOne({ email });
    if (!userFound) return res.status(400).json(["Credenciales inválidas"]);

    const isMatch = await bcrypt.compare(password, userFound.password);
    if (!isMatch) return res.status(400).json(["Credenciales inválidas"]);

    const token = await createAccessToken({ id: userFound._id });

    res.cookie("token", token, {
      httpOnly: process.env.NODE_ENV !== "development",
      secure: process.env.NODE_ENV !== "development",
      sameSite: "none",
    });

    res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
      role: userFound.role,
      createdAt: userFound.createdAt,
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const logout = (req, res) => {
  res.cookie("token", "", { expires: new Date(0) });
  return res.sendStatus(200);
};

export const profile = async (req, res) => {
  const userFound = await User.findById(req.user.id);
  if (!userFound)
    return res.status(400).json({ message: "Usuario no encontrado" });

  return res.json({
    id: userFound._id,
    username: userFound.username,
    email: userFound.email,
    createdAt: userFound.createdAt,
    role: userFound.role,
  });
};

export const verifyToken = async (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.send(false);

  jwt.verify(token, TOKEN_SECRET, async (error, user) => {
    if (error) return res.sendStatus(401);

    const userFound = await User.findById(user.id);
    if (!userFound) return res.sendStatus(401);

    return res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
      role: userFound.role,
    });
  });
};

export const createAdmin = async (req, res) => {
  const { username, email, password, key } = req.body;

  if (key !== process.env.ADMIN_CREATION_KEY && key !== ADMIN_CREATION_KEY) {
    return res.status(403).json({ message: "Clave de administrador inválida" });
  }

  const userFound = await User.findOne({ email });
  if (userFound)
    return res.status(400).json({ message: "Este email ya existe" });

  const passwordHash = await bcrypt.hash(password, 10);

  const newAdmin = new User({
    username,
    email,
    password: passwordHash,
    role: "admin",
  });

  const savedAdmin = await newAdmin.save();

  // Los admins no necesitan perfil detallado, pero creamos uno básico por consistencia
  const adminProfile = new Profile({
    user: savedAdmin._id,
    telefono: "",
    direccion: "",
    fechaNacimiento: null,
    especialidad: "Administrador del Sistema",
    numeroLicencia: "",
    biografia: "Administrador del sistema odontológico UNET",
    diasTrabajo: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"],
  });
  await adminProfile.save();

  res.json({
    id: savedAdmin._id,
    username: savedAdmin.username,
    email: savedAdmin.email,
    role: savedAdmin.role,
    createdAt: savedAdmin.createdAt,
  });
};
