import User from "../models/user.model.js";
import Profile from "../models/profile.model.js";
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
    // Campos del perfil
    telefono,
    direccion,
    fechaNacimiento,
    especialidad,
    numeroLicencia,
    biografia,
  } = req.body;

  try {
    // Verificar clave especial para doctores
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

    const userSaved = await newUser.save();

    // Crear perfil automáticamente con los datos del registro
    const profileData = {
      user: userSaved._id,
      telefono: telefono || "",
      direccion: direccion || "",
      fechaNacimiento: fechaNacimiento || null,
      especialidad: especialidad || "",
      numeroLicencia: numeroLicencia || "",
      biografia: biografia || "",
    };

    const newProfile = new Profile(profileData);
    await newProfile.save();

    const token = await createAccessToken({ id: userSaved._id });
    res.cookie("token", token);
    res.json({
      id: userSaved.id,
      username: userSaved.username,
      email: userSaved.email,
      role: userSaved.role,
      createdAt: userSaved.createdAt,
      updatedAt: userSaved.updatedAt,
      message: "Usuario y perfil creados exitosamente",
    });
  } catch (error) {
    console.error("Error en registro:", error);
    if (error.code === 11000) {
      return res.status(400).json(["Este email ya está registrado"]);
    }
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userFound = await User.findOne({ email });
    if (!userFound)
      return res
        .status(400)
        .json({ message: "Email o contraseña incorrectos" });

    const isMatch = await bcrypt.compare(password, userFound.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ message: "Email o contraseña incorrectos" });

    const token = await createAccessToken({ id: userFound._id });
    res.cookie("token", token);
    res.json({
      id: userFound.id,
      username: userFound.username,
      email: userFound.email,
      role: userFound.role,
      createdAt: userFound.createdAt,
      updatedAt: userFound.updatedAt,
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const logout = (req, res) => {
  res.cookie("token", "", {
    expires: new Date(0),
  });
  return res.sendStatus(200);
};

export const profile = async (req, res) => {
  const userFound = await User.findById(req.user.id);
  if (!userFound)
    return res.status(400).json({ message: "Usuario no encontrado" });
  return res.json({
    id: userFound.id,
    username: userFound.username,
    email: userFound.email,
    role: userFound.role,
    createdAt: userFound.createdAt,
    updatedAt: userFound.updatedAt,
  });
};

export const verifyToken = async (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.status(401).json({ message: "No autorizado" });
  jwt.verify(token, TOKEN_SECRET, async (err, user) => {
    if (err) return res.status(401).json({ message: "Token inválido" });

    const userFound = await User.findById(user.id);
    if (!userFound)
      return res.status(401).json({
        message: "Usuario no encontrado",
      });

    return res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
      role: userFound.role,
    });
  });
};

export const createAdmin = async (req, res) => {
  const { email, password, username, key } = req.body;

  try {
    if (key !== process.env.ADMIN_CREATION_KEY && key !== ADMIN_CREATION_KEY) {
      return res
        .status(403)
        .json({ message: "Clave de administrador inválida" });
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
    });
    await adminProfile.save();

    res.json({
      id: savedAdmin._id,
      username: savedAdmin.username,
      email: savedAdmin.email,
      role: savedAdmin.role,
      createdAt: savedAdmin.createdAt,
    });
  } catch (error) {
    console.error("Error creando admin:", error);
    if (error.code === 11000) {
      return res.status(400).json({ message: "Este email ya está registrado" });
    }
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
