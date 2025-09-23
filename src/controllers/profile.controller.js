import Profile from "../models/profile.model.js";
import fs from "fs/promises";
import path from "path";
import User from "../models/user.model.js";
import Cita from "../models/cita.model.js";

// Obtener perfil del usuario logueado
export const getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "user",
      "username email role createdAt"
    );

    if (!profile) {
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

    res.json(profile);
  } catch (error) {
    return res.status(500).json({ message: "Error al obtener el perfil" });
  }
};

// Actualizar perfil del usuario logueado
export const updateProfile = async (req, res) => {
  try {
    const {
      telefono,
      direccion,
      fechaNacimiento,
      especialidad,
      numeroLicencia,
      biografia,
      horarioInicio,
      horarioFin,
      username,
      email,
    } = req.body;

    let diasTrabajo = [];
    if (req.body.diasTrabajo) {
      diasTrabajo = JSON.parse(req.body.diasTrabajo);
    }

    // Buscar el perfil y el usuario
    const profileFound = await Profile.findOne({ user: req.user.id });
    const userFound = await User.findById(req.user.id);

    if (!profileFound || !userFound) {
      return res.status(404).json({ message: "Perfil no encontrado" });
    }

    // Preparar el objeto de actualización del perfil
    const profileUpdateData = {
      telefono,
      direccion,
      fechaNacimiento,
      especialidad,
      numeroLicencia,
      biografia,
      horarioInicio,
      horarioFin,
      diasTrabajo,
    };

    // Manejo de la subida de la foto
    if (req.file) {
      const newFoto = req.file.filename;

      // Si existe una foto anterior, la eliminamos
      if (profileFound.foto) {
        const oldFotoPath = path.join(
          process.cwd(),
          "uploads",
          "profiles",
          profileFound.foto
        );
        try {
          await fs.unlink(oldFotoPath);
        } catch (error) {
          console.error("Error al eliminar la foto antigua:", error);
        }
      }
      profileUpdateData.foto = newFoto;
    }

    // Actualizar el perfil
    const updatedProfile = await Profile.findByIdAndUpdate(
      profileFound._id,
      profileUpdateData,
      {
        new: true,
      }
    ).populate("user", "username email role createdAt");

    // Actualizar el usuario (nombre de usuario y email)
    if (username !== userFound.username || email !== userFound.email) {
      const userUpdateData = {};
      if (username !== userFound.username) userUpdateData.username = username;
      if (email !== userFound.email) userUpdateData.email = email;
      await User.findByIdAndUpdate(userFound._id, userUpdateData);
    }

    return res.json(updatedProfile);
  } catch (error) {
    return res.status(500).json({ message: "Error al actualizar el perfil" });
  }
};

// Obtener perfil público (por nombre de usuario) - para otros doctores
export const getPublicProfile = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({
      username,
    }).select("id");
    if (!user)
      return res.status(404).json({
        message: "Usuario no encontrado",
      });

    const profile = await Profile.findOne({
      user: user.id,
    }).populate("user", "username email role createdAt");

    if (!profile)
      return res.status(404).json({
        message: "Perfil no encontrado",
      });
    res.json(profile);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener el perfil público",
    });
  }
};

// Obtener todos los doctores con sus perfiles
export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await User.find({
      role: "odontologo",
    }).select("id username email createdAt");

    const doctorsWithProfiles = await Promise.all(
      doctors.map(async (doctor) => {
        const profile = await Profile.findOne({
          user: doctor._id,
        }).select(
          "telefono direccion especialidad biografia foto numeroLicencia fechaNacimiento diasTrabajo horarioInicio horarioFin"
        );
        return {
          ...doctor.toObject(),
          profile,
        };
      })
    );

    res.json(doctorsWithProfiles);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener todos los doctores",
    });
  }
};

// Obtener doctores con estadísticas
export const getDoctorsWithStats = async (req, res) => {
  try {
    const doctors = await User.find({
      role: "odontologo",
    })
      .select("username email createdAt")
      .lean();

    const doctorsWithStats = await Promise.all(
      doctors.map(async (doctor) => {
        const profile = await Profile.findOne({
          user: doctor._id,
        })
          .select(
            "telefono direccion especialidad biografia foto numeroLicencia fechaNacimiento diasTrabajo horarioInicio horarioFin"
          )
          .lean();

        const totalPacientes = await Cita.distinct("paciente", {
          odontologo: doctor._id,
        });

        const totalCitas = await Cita.countDocuments({
          odontologo: doctor._id,
        });

        const ultimaCita = await Cita.findOne({
          odontologo: doctor._id,
        })
          .sort({
            fecha: -1,
          })
          .select("fecha")
          .lean();

        return {
          ...doctor,
          profile,
          totalPacientes: totalPacientes.length,
          totalCitas,
          ultimaCita: ultimaCita ? ultimaCita.fecha : null,
        };
      })
    );

    doctorsWithStats.sort((a, b) => (b.totalCitas || 0) - (a.totalCitas || 0));

    res.json(doctorsWithStats);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener doctores con estadísticas",
    });
  }
};
