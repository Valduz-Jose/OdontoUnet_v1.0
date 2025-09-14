import Profile from "../models/profile.model.js";
import fs from "fs/promises";
import path from "path";

import User from "../models/user.model.js";
import Cita from "../models/cita.model.js";

// Obtener perfil del usuario logueado
export const getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate("user", "username email role createdAt");
    
    if (!profile) {
      return res.json({
        telefono: '',
        direccion: '',
        fechaNacimiento: '',
        especialidad: '',
        numeroLicencia: '',
        biografia: '',
        foto: null
      });
    }

    res.json(profile);
  } catch (error) {
    console.error("Error al obtener perfil:", error);
    res.status(500).json({ message: "Error al obtener el perfil" });
  }
};

// Actualizar perfil del usuario logueado
export const updateProfile = async (req, res) => {
  try {
    const { telefono, direccion, fechaNacimiento, especialidad, numeroLicencia, biografia } = req.body;
    
    let updateData = {
      telefono,
      direccion,
      fechaNacimiento: fechaNacimiento || null,
      especialidad,
      numeroLicencia,
      biografia
    };

    // Si se subió una nueva foto
    if (req.file) {
      // Buscar perfil existente para eliminar foto anterior
      const existingProfile = await Profile.findOne({ user: req.user.id });
      if (existingProfile && existingProfile.foto) {
        try {
          await fs.unlink(path.join(process.cwd(), 'uploads/profiles', existingProfile.foto));
        } catch (err) {
          console.log("No se pudo eliminar la foto anterior:", err.message);
        }
      }
      
      updateData.foto = req.file.filename;
    }

    const profile = await Profile.findOneAndUpdate(
      { user: req.user.id },
      updateData,
      { new: true, upsert: true, runValidators: true }
    ).populate("user", "username email role createdAt");

    res.json(profile);
  } catch (error) {
    console.error("Error al actualizar perfil:", error);
    res.status(500).json({ message: "Error al actualizar el perfil" });
  }
};

// Obtener perfil público (para mostrar en homepage)
export const getPublicProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const profile = await Profile.findOne({ user: id })
      .populate("user", "username email role")
      .select("telefono especialidad biografia foto user");
    
    if (!profile) {
      return res.status(404).json({ message: "Perfil no encontrado" });
    }

    res.json(profile);
  } catch (error) {
    console.error("Error al obtener perfil público:", error);
    res.status(500).json({ message: "Error al obtener el perfil público" });
  }
};

// Obtener todos los doctores para homepage
export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Profile.find()
      .populate({
        path: "user",
        match: { role: "odontologo" },
        select: "username email"
      })
      .select("especialidad biografia foto user");
    
    // Filtrar solo los que tienen user (odontólogos)
    const validDoctors = doctors.filter(doc => doc.user);
    
    res.json(validDoctors);
  } catch (error) {
    console.error("Error al obtener doctores:", error);
    res.status(500).json({ message: "Error al obtener los doctores" });
  }
};

// Agregar esta función al archivo src/controllers/profile.controller.js

export const getDoctorsWithStats = async (req, res) => {
  try {
    // Obtener todos los usuarios con rol de odontólogo
    const doctors = await User.find({ role: "odontologo" })
      .select("username email createdAt")
      .lean();

    const doctorsWithStats = await Promise.all(
      doctors.map(async (doctor) => {
        // Obtener perfil del doctor
        const profile = await Profile.findOne({ user: doctor._id })
          .select("telefono direccion especialidad biografia foto numeroLicencia fechaNacimiento")
          .lean();

        // Obtener estadísticas de pacientes únicos
        const totalPacientes = await Cita.distinct('paciente', { odontologo: doctor._id });
        
        // Obtener total de citas
        const totalCitas = await Cita.countDocuments({ odontologo: doctor._id });
        
        // Obtener última cita
        const ultimaCita = await Cita.findOne({ odontologo: doctor._id })
          .sort({ fecha: -1 })
          .select("fecha")
          .lean();

        return {
          ...doctor,
          profile,
          totalPacientes: totalPacientes.length,
          totalCitas,
          ultimaCita: ultimaCita?.fecha || null
        };
      })
    );

    // Ordenar por actividad (más citas primero)
    doctorsWithStats.sort((a, b) => (b.totalCitas || 0) - (a.totalCitas || 0));

    res.json(doctorsWithStats);
  } catch (error) {
    console.error("Error al obtener estadísticas de doctores:", error);
    res.status(500).json({ message: "Error al obtener estadísticas de doctores" });
  }
};

