import Profile from "../models/profile.model.js";
import fs from "fs/promises";
import path from "path";

import User from "../models/user.model.js";
import Cita from "../models/cita.model.js";

// Obtener perfil del usuario logueado
export const getProfile = async (req, res) => {
  try {
    console.log("🔍 DEBUG - Obteniendo perfil para usuario ID:", req.user.id);

    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "user",
      "username email role createdAt"
    );

    console.log("📋 DEBUG - Perfil encontrado en BD:", profile ? "SÍ" : "NO");

    if (!profile) {
      console.log(
        "❌ DEBUG - No se encontró perfil, devolviendo valores por defecto"
      );
      return res.json({
        telefono: "",
        direccion: "",
        fechaNacimiento: "",
        especialidad: "",
        numeroLicencia: "",
        biografia: "",
        foto: null,
        diasTrabajo: [],
        horarioInicio: "8:00 AM",
        horarioFin: "5:00 PM",
      });
    }

    // Debug detallado de los datos de la BD
    console.log("📊 DEBUG - Datos RAW del perfil desde BD:");
    console.log("- telefono:", profile.telefono, typeof profile.telefono);
    console.log("- direccion:", profile.direccion, typeof profile.direccion);
    console.log(
      "- especialidad:",
      profile.especialidad,
      typeof profile.especialidad
    );
    console.log("- biografia:", profile.biografia, typeof profile.biografia);
    console.log(
      "- diasTrabajo:",
      profile.diasTrabajo,
      Array.isArray(profile.diasTrabajo)
    );
    console.log(
      "- horarioInicio:",
      profile.horarioInicio,
      typeof profile.horarioInicio
    );
    console.log("- horarioFin:", profile.horarioFin, typeof profile.horarioFin);

    // Asegurar que devolvemos todos los campos, incluso si están vacíos
    const profileData = {
      telefono: profile.telefono || "",
      direccion: profile.direccion || "",
      fechaNacimiento: profile.fechaNacimiento || "",
      especialidad: profile.especialidad || "",
      numeroLicencia: profile.numeroLicencia || "",
      biografia: profile.biografia || "",
      foto: profile.foto || null,
      diasTrabajo: profile.diasTrabajo || [],
      horarioInicio: profile.horarioInicio || "8:00 AM",
      horarioFin: profile.horarioFin || "5:00 PM",
      user: profile.user,
    };

    console.log("📤 DEBUG - Datos que se envían al frontend:");
    console.log("- telefono:", profileData.telefono);
    console.log("- direccion:", profileData.direccion);
    console.log("- especialidad:", profileData.especialidad);
    console.log("- biografia:", profileData.biografia);

    res.json(profileData);
  } catch (error) {
    console.error("❌ ERROR al obtener perfil:", error);
    res.status(500).json({ message: "Error al obtener el perfil" });
  }
};

// Actualizar perfil del usuario logueado
export const updateProfile = async (req, res) => {
  try {
    console.log("🔄 DEBUG - Datos recibidos para actualizar:", req.body);
    console.log("📷 DEBUG - Archivo recibido:", req.file);

    const {
      telefono,
      direccion,
      fechaNacimiento,
      especialidad,
      numeroLicencia,
      biografia,
      diasTrabajo,
      horarioInicio,
      horarioFin,
    } = req.body;

    let updateData = {
      telefono: telefono || "",
      direccion: direccion || "",
      fechaNacimiento: fechaNacimiento || null,
      especialidad: especialidad || "",
      numeroLicencia: numeroLicencia || "",
      biografia: biografia || "",
      horarioInicio: horarioInicio || "8:00 AM",
      horarioFin: horarioFin || "5:00 PM",
    };

    // Procesar días de trabajo
    if (diasTrabajo) {
      try {
        // Si viene como string JSON, parsearlo
        updateData.diasTrabajo =
          typeof diasTrabajo === "string"
            ? JSON.parse(diasTrabajo)
            : diasTrabajo;
      } catch (e) {
        console.log(
          "⚠️ DEBUG - Error parseando diasTrabajo, usando como array:",
          e
        );
        // Si no es JSON válido, asumir que es un array
        updateData.diasTrabajo = Array.isArray(diasTrabajo) ? diasTrabajo : [];
      }
    } else {
      updateData.diasTrabajo = [];
    }

    // Si se subió una nueva foto
    if (req.file) {
      // Buscar perfil existente para eliminar foto anterior
      const existingProfile = await Profile.findOne({ user: req.user.id });
      if (existingProfile && existingProfile.foto) {
        try {
          await fs.unlink(
            path.join(process.cwd(), "uploads/profiles", existingProfile.foto)
          );
        } catch (err) {
          console.log("No se pudo eliminar la foto anterior:", err.message);
        }
      }

      updateData.foto = req.file.filename;
    }

    console.log("💾 DEBUG - Datos que se van a actualizar:", updateData);

    const profile = await Profile.findOneAndUpdate(
      { user: req.user.id },
      updateData,
      { new: true, upsert: true, runValidators: true }
    ).populate("user", "username email role createdAt");

    console.log("✅ DEBUG - Perfil actualizado en BD:", profile ? "SÍ" : "NO");

    // Devolver los datos formateados
    const responseData = {
      telefono: profile.telefono || "",
      direccion: profile.direccion || "",
      fechaNacimiento: profile.fechaNacimiento || "",
      especialidad: profile.especialidad || "",
      numeroLicencia: profile.numeroLicencia || "",
      biografia: profile.biografia || "",
      foto: profile.foto || null,
      diasTrabajo: profile.diasTrabajo || [],
      horarioInicio: profile.horarioInicio || "8:00 AM",
      horarioFin: profile.horarioFin || "5:00 PM",
      user: profile.user,
    };

    console.log("📤 DEBUG - Respuesta que se envía:", responseData);

    res.json(responseData);
  } catch (error) {
    console.error("❌ ERROR al actualizar perfil:", error);
    res.status(500).json({ message: "Error al actualizar el perfil" });
  }
};

// Obtener perfil público (para mostrar en homepage)
export const getPublicProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const profile = await Profile.findOne({ user: id })
      .populate("user", "username email role")
      .select(
        "telefono especialidad biografia foto user diasTrabajo horarioInicio horarioFin"
      );

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
        select: "username email",
      })
      .select(
        "especialidad biografia foto user diasTrabajo horarioInicio horarioFin"
      );

    // Filtrar solo los que tienen user (odontólogos)
    const validDoctors = doctors.filter((doc) => doc.user);

    res.json(validDoctors);
  } catch (error) {
    console.error("Error al obtener doctores:", error);
    res.status(500).json({ message: "Error al obtener los doctores" });
  }
};

// Obtener doctores con estadísticas para el panel de admin
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
          .select(
            "telefono direccion especialidad biografia foto numeroLicencia fechaNacimiento diasTrabajo horarioInicio horarioFin"
          )
          .lean();

        // Obtener estadísticas de pacientes únicos
        const totalPacientes = await Cita.distinct("paciente", {
          odontologo: doctor._id,
        });

        // Obtener total de citas
        const totalCitas = await Cita.countDocuments({
          odontologo: doctor._id,
        });

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
          ultimaCita: ultimaCita?.fecha || null,
        };
      })
    );

    // Ordenar por actividad (más citas primero)
    doctorsWithStats.sort((a, b) => (b.totalCitas || 0) - (a.totalCitas || 0));

    res.json(doctorsWithStats);
  } catch (error) {
    console.error("Error al obtener estadísticas de doctores:", error);
    res
      .status(500)
      .json({ message: "Error al obtener estadísticas de doctores" });
  }
};
