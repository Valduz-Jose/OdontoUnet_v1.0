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

    // Verificar disponibilidad de insumos ANTES de procesar
    if (insumosUsados && insumosUsados.length > 0) {
      for (const insumoUsado of insumosUsados) {
        const insumo = await Insumo.findById(insumoUsado.insumo);
        if (!insumo) {
          return res.status(404).json({ 
            message: `Insumo con ID ${insumoUsado.insumo} no encontrado` 
          });
        }
        if (insumo.cantidadDisponible < insumoUsado.cantidad) {
          return res.status(400).json({ 
            message: `No hay suficientes unidades del insumo "${insumo.nombre}". Disponible: ${insumo.cantidadDisponible}, Solicitado: ${insumoUsado.cantidad}` 
          });
        }
      }
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
    let odontogramaFinal = [];

    // 1. Obtener el odontograma actual del paciente (estado más reciente)
    let odontogramaActualPaciente = paciente.odontograma || [];
    
    // Si el paciente no tiene odontograma, inicializar con todos "Sano"
    if (odontogramaActualPaciente.length === 0) {
      for (let i = 1; i <= 32; i++) {
        odontogramaActualPaciente.push({ numero: i, estado: "Sano" });
      }
    }

    // 2. Si vienen cambios desde el frontend, aplicarlos
    if (odontogramaActualizado && odontogramaActualizado.length > 0) {
      // Crear mapa con el odontograma actual del paciente
      const odontogramaMap = new Map(
        odontogramaActualPaciente.map((d) => [d.numero, d.estado])
      );

      // Aplicar actualizaciones
      odontogramaActualizado.forEach((diente) => {
        if (diente.numero && diente.estado) {
          odontogramaMap.set(diente.numero, diente.estado);
        }
      });

      // Convertir de vuelta a array
      odontogramaFinal = Array.from(odontogramaMap, ([numero, estado]) => ({
        numero,
        estado,
      }));
    } else {
      // Si no hay cambios, usar el odontograma actual del paciente
      odontogramaFinal = odontogramaActualPaciente;
    }

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

    odontogramaFinal = odontogramaFinal.map((d) => ({
      numero: d.numero,
      estado: estadosValidos.includes(d.estado) ? d.estado : "Sano",
    }));

    // 3. Actualizar el odontograma del paciente en la BD (estado más actual)
    paciente.odontograma = odontogramaFinal;
    await paciente.save();

    // 4. DESCONTAR INSUMOS DEL INVENTARIO
    const insumosConDetalles = [];
    if (insumosUsados && insumosUsados.length > 0) {
      for (const insumoUsado of insumosUsados) {
        const insumo = await Insumo.findById(insumoUsado.insumo);
        
        // Descontar del inventario
        insumo.cantidadDisponible -= insumoUsado.cantidad;
        await insumo.save();
        
        // Guardar detalles para la cita
        insumosConDetalles.push({
          insumo: insumo._id,
          cantidad: insumoUsado.cantidad,
        });
        
        console.log(`Insumo "${insumo.nombre}" descontado. Cantidad usada: ${insumoUsado.cantidad}, Restante: ${insumo.cantidadDisponible}`);
      }
    }

    // 5. Crear nueva cita con el snapshot del odontograma
    const newCita = new Cita({
      paciente: paciente._id,
      pacienteDatos,
      odontologo: req.user.id,
      motivo,
      odontograma: odontogramaFinal, // snapshot del odontograma en esta cita
      observaciones,
      monto,
      numeroReferencia,
      insumosUsados: insumosConDetalles,
      tratamientos,
      fecha: fecha || new Date(),
    });

    const savedCita = await newCita.save();

    res.status(201).json(savedCita);
  } catch (error) {
    console.error("Error al crear cita:", error);
    res.status(500).json({ message: "Error al crear cita", error: error.message });
  }
};

// Obtener todas las citas del odontólogo logueado
export const getCitas = async (req, res) => {
  try {
    const citas = await Cita.find({ odontologo: req.user.id })
      .populate("paciente", "nombre apellido cedula")
      .populate("odontologo", "username email role")
      .sort({ fecha: -1 }); // más recientes primero

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

// Obtener citas de un paciente (ordenadas de más reciente a más antigua)
export const getCitasByPaciente = async (req, res) => {
  try {
    const citas = await Cita.find({ paciente: req.params.id })
      .populate("paciente", "nombre apellido cedula")
      .populate("odontologo", "username email role")
      .populate("insumosUsados.insumo", "nombre")
      .sort({ fecha: -1 }); // más recientes primero

    res.json(citas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener las citas del paciente" });
  }
};

// Obtener la última cita de un paciente (más reciente)
export const getUltimaCitaPaciente = async (req, res) => {
  try {
    const ultimaCita = await Cita.findOne({ paciente: req.params.pacienteId })
      .sort({ fecha: -1 }) // más reciente primero
      .populate("paciente", "nombre apellido cedula")
      .populate("odontologo", "username email role");

    res.json(ultimaCita); // puede ser null si no hay citas
  } catch (error) {
    console.error("Error al obtener última cita:", error);
    res.status(500).json({ message: "Error al obtener última cita" });
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