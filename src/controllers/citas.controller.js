import Cita from "../models/cita.model.js";
import Patient from "../models/patient.model.js";

// Crear nueva cita
export const createCita = async (req, res) => {
  try {
    const { pacienteId, motivo, odontograma, observaciones, monto } = req.body;

    // Buscar paciente
    const paciente = await Patient.findById(pacienteId);
    if (!paciente) {
      return res.status(404).json({ message: "Paciente no encontrado" });
    }

    // Crear snapshot con datos básicos
    const pacienteDatos = {
      nombre: paciente.nombre,
      apellido: paciente.apellido,
      cedula: paciente.cedula,
      telefonoContacto: paciente.telefonoContacto,
      telefonoEmergencia: paciente.telefonoEmergencia,
      edad: paciente.edad,
      sexo: paciente.sexo,
      direccion: paciente.direccion,
      carrera: paciente.carrera,
      grupoSanguineo: paciente.grupoSanguineo,
    };

    const newCita = new Cita({
      paciente: paciente._id,
      pacienteDatos,
      odontologo: req.user.id, // el odontólogo logueado
      motivo,
      odontograma,
      observaciones,
      monto,
    });

    const savedCita = await newCita.save();
    await savedCita.populate("paciente", "nombre apellido cedula");
    await savedCita.populate("odontologo", "username email role");

    res.json(savedCita);
  } catch (error) {
    console.error("Error al crear cita:", error);
    res.status(500).json({ message: "Error al crear cita" });
  }
};

// Obtener todas las citas del odontólogo logueado
export const getCitas = async (req, res) => {
  try {
    const citas = await Cita.find({ odontologo: req.user.id })
      .populate("paciente", "nombre apellido cedula")
      .populate("odontologo", "username email role");

    res.json(citas);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener citas" });
  }
};

// Obtener una cita específica
export const getCita = async (req, res) => {
  try {
    const cita = await Cita.findById(req.params.id)
      .populate("paciente", "nombre apellido cedula")
      .populate("odontologo", "username email role");

    if (!cita) return res.status(404).json({ message: "Cita no encontrada" });

    res.json(cita);
  } catch (error) {
    res.status(404).json({ message: "Cita no encontrada" });
  }
};

// Eliminar una cita
export const deleteCita = async (req, res) => {
  try {
    const cita = await Cita.findByIdAndDelete(req.params.id);
    if (!cita) return res.status(404).json({ message: "Cita no encontrada" });
    res.sendStatus(204);
  } catch (error) {
    res.status(404).json({ message: "Cita no encontrada" });
  }
};
