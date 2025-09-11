import Cita from "../models/cita.model.js";
import Patient from "../models/patient.model.js";
import Insumo from "../models/insumo.model.js";

// Crear nueva cita
export const createCita = async (req, res) => {
  try {
    const { pacienteId, motivo, odontograma, observaciones, monto, numeroReferencia, insumosUsados } = req.body;

    // Buscar paciente
    const paciente = await Patient.findById(pacienteId);
    if (!paciente) return res.status(404).json({ message: "Paciente no encontrado" });

    // Snapshot paciente
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

    // Descontar insumos
    if (insumosUsados && insumosUsados.length > 0) {
      for (const item of insumosUsados) {
        const insumo = await Insumo.findById(item.insumo);
        if (!insumo) return res.status(404).json({ message: `Insumo no encontrado: ${item.insumo}` });
        if (insumo.cantidadDisponible < item.cantidad) {
          return res.status(400).json({ message: `No hay suficiente stock de ${insumo.nombre}` });
        }
        insumo.cantidadDisponible -= item.cantidad;
        await insumo.save();
      }
    }

    const newCita = new Cita({
      paciente: paciente._id,
      pacienteDatos,
      odontologo: req.user.id,
      motivo,
      odontograma,
      observaciones,
      monto,
      numeroReferencia,
      insumosUsados
    });

    const savedCita = await newCita.save();
    await savedCita.populate("paciente", "nombre apellido cedula");
    await savedCita.populate("odontologo", "username email role");
    await savedCita.populate("insumosUsados.insumo", "nombre unidadMedida");

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

// Obtener citas de un paciente
export const getCitasByPaciente = async (req, res) => {
  try {
    const citas = await Cita.find({ paciente: req.params.id })
      .populate("paciente", "nombre apellido cedula")
      .populate("odontologo", "username email role");

    res.json(citas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener las citas del paciente" });
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
