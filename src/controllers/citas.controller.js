import Cita from "../models/cita.model.js";
import Patient from "../models/patient.model.js";
import Insumo from "../models/insumo.model.js";

export const createCita = async (req, res) => {
  try {
    const {
      pacienteId,
      motivo,
      odontograma: odontogramaActualizado,
      observaciones,
      monto,
      numeroReferencia,
      insumosUsados,
      tratamientos,
      fecha,
    } = req.body;

    // Buscar paciente
    const paciente = await Patient.findById(pacienteId);
    if (!paciente) {
      return res.status(404).json({ message: "Paciente no encontrado" });
    }

    // Copiar datos básicos del paciente (snapshot)
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

// ---------- Manejo del odontograma ----------
let odontogramaSnapshot = paciente.odontograma || [];

// Si vienen actualizaciones desde el frontend
if (odontogramaActualizado && odontogramaActualizado.length > 0) {
  // Creamos un mapa con el odontograma actual
  const odontogramaMap = new Map(
    odontogramaSnapshot.map((d) => [d.numero, d.estado])
  );

  // Aplicamos actualizaciones (ej: [{numero: 12, estado: "Cariado"}])
  odontogramaActualizado.forEach((diente) => {
    if (diente.numero && diente.estado) {
      odontogramaMap.set(diente.numero, diente.estado);
    }
  });

  // Reconstruimos el array de dientes
  odontogramaSnapshot = Array.from(odontogramaMap, ([numero, estado]) => ({
    numero,
    estado,
  }));

  // Validar estados
  const estadosValidos = [
    "Sano",
    "Cariado",
    "Obturado",
    "Endodoncia",
    "Ausente",
    "Extraído",
    "Sellado",
    "Corona",
    "Fracturado",
    "Implante",
  ];

  odontogramaSnapshot = odontogramaSnapshot.map((d) => ({
    numero: d.numero,
    estado: estadosValidos.includes(d.estado) ? d.estado : "Sano",
  }));

  // Guardamos en el paciente
  paciente.odontograma = odontogramaSnapshot;
  await paciente.save();
}

    // Crear nueva cita
const newCita = new Cita({
  paciente: paciente._id,
  pacienteDatos,
  odontologo: req.user.id,
  motivo,
  odontograma: odontogramaSnapshot,
  observaciones,
  monto,
  numeroReferencia,
  insumosUsados,
  tratamientos,
  fecha: fecha || new Date(),
});


    const savedCita = await newCita.save();

    res.status(201).json(savedCita);
  } catch (error) {
    console.error("Error al crear cita:", error);
    res.status(500).json({ message: "Error al crear cita", error });
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
      .populate("odontologo", "username email role")
      .populate("insumosUsados.insumo", "nombre"); // <-- esto es lo que falta

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

export const updateCita = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      motivo,
      observaciones,
      tratamientos,
      monto,
      numeroReferencia,
      insumosUsados,
      odontograma, // nuevo odontograma enviado desde el frontend
    } = req.body;

    // 1. Buscar cita
    const cita = await Cita.findById(id);
    if (!cita) {
      return res.status(404).json({ message: "Cita no encontrada" });
    }

    // 2. Buscar paciente asociado
    const paciente = await Patient.findById(cita.paciente);
    if (!paciente) {
      return res.status(404).json({ message: "Paciente no encontrado" });
    }

    // 3. Actualizar datos de la cita
    if (motivo) cita.motivo = motivo;
    if (observaciones) cita.observaciones = observaciones;
    if (tratamientos) cita.tratamientos = tratamientos;
    if (monto) cita.monto = monto;
    if (numeroReferencia) cita.numeroReferencia = numeroReferencia;
    if (insumosUsados) cita.insumosUsados = insumosUsados;

    // 4. Manejo del odontograma
    if (odontograma && odontograma.length > 0) {
      cita.odontograma = odontograma; // snapshot en la cita
      paciente.odontograma = odontograma; // actualizamos paciente
      await paciente.save();
    }

    // 5. Guardar cambios en la cita
    const citaActualizada = await cita.save();

    res.json(citaActualizada);

  } catch (error) {
    console.error("Error al actualizar cita:", error);
    res.status(500).json({ message: "Error al actualizar cita" });
  }
};

export const getUltimaCitaPaciente = async (req, res) => {
  try {
    const cita = await Cita.findOne({ paciente: req.params.pacienteId }) // <- paciente, no pacienteId
      .sort({ fecha: -1 });

    if (!cita) return res.json(null); // si no hay cita, devolver null

    res.json(cita);
  } catch (err) {
    console.error("Error al obtener última cita:", err);
    res.status(500).json({ error: "Error al obtener última cita" });
  }
};

