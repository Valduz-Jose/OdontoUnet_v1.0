import Cita from "../models/cita.model.js";
import CitaInsumo from "../models/citaInsumo.model.js";
import Insumo from "../models/insumo.model.js";

// Crear un nuevo registro de insumo usado en cita
export const createCitaInsumo = async (req, res) => {
  try {
    const { cita, insumo, cantidad, odontologo } = req.body;

    if (!cita) {
      return res.status(400).json({ message: "La cita es obligatoria" });
    }

    // Buscar el insumo
    const insumoDoc = await Insumo.findById(insumo);
    if (!insumoDoc) {
      return res.status(404).json({ message: "Insumo no encontrado" });
    }

    // Verificar inventario
    if (insumoDoc.cantidadDisponible < cantidad) {
      return res.status(400).json({ message: "No hay suficientes insumos disponibles" });
    }

    // Calcular precios
    const precioUnitario = insumoDoc.precioUnitario;
    const subtotal = precioUnitario * cantidad;

    // Crear registro de CitaInsumo
    const citaInsumo = new CitaInsumo({
      cita,
      insumo,
      cantidad,
      precioUnitario,
      subtotal,
      odontologo,
    });

    await citaInsumo.save();

    // Descontar del inventario
    insumoDoc.cantidadDisponible -= cantidad;
    await insumoDoc.save();

    // ---- Populate antes de responder ----
    const populatedCitaInsumo = await CitaInsumo.findById(citaInsumo._id)
      .populate("cita")
      .populate("insumo")
      .populate("odontologo");

    res.status(201).json(populatedCitaInsumo);
  } catch (error) {
    console.error("Error al crear CitaInsumo:", error);
    res.status(500).json({ message: "Error al crear CitaInsumo" });
  }
};

// Obtener todos los citaInsumos
export const getCitaInsumos = async (req, res) => {
  try {
    const citaInsumos = await CitaInsumo.find()
      .populate("cita")
      .populate("insumo")
      .populate("odontologo");
    
    res.json(citaInsumos);
  } catch (error) {
    console.error("Error al obtener CitaInsumos:", error);
    res.status(500).json({ message: "Error al obtener CitaInsumos" });
  }
};

// Obtener todos los insumos de una cita específica y agruparlos
export const getCitaInsumosByCita = async (req, res) => {
  try {
    const { citaId } = req.params;

    const citaInsumos = await CitaInsumo.find({ cita: citaId })
      .populate({
        path: "cita",
        populate: { path: "paciente odontologo" }
      })
      .populate("insumo")
      .populate("odontologo");

    if (!citaInsumos || citaInsumos.length === 0) {
      return res.status(404).json({ message: "No hay insumos registrados para esta cita" });
    }

    // Tomamos la primera cita (todas son la misma)
    const citaInfo = citaInsumos[0].cita;

    // Agrupamos insumos por nombre
    const insumosAgrupados = citaInsumos.reduce((acc, item) => {
  const existing = acc.find(i => i.nombre === item.insumo.nombre);
  if (existing) {
    existing.cantidad += item.cantidad;
    existing.subtotal = parseFloat((existing.subtotal + item.subtotal).toFixed(2));
  } else {
    acc.push({
      nombre: item.insumo.nombre,
      cantidad: item.cantidad,
      precioUnitario: item.precioUnitario,
      subtotal: parseFloat(item.subtotal.toFixed(2))
    });
  }
  return acc;
}, []);

    res.json({
      cita: citaInfo,
      insumos: insumosAgrupados
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener insumos de la cita" });
  }
};



// Actualizar un citaInsumo
export const updateCitaInsumo = async (req, res) => {
  try {
    const updates = { ...req.body };

    if (updates.cantidad && updates.precioUnitario) {
      updates.subtotal = updates.cantidad * updates.precioUnitario;
    }

    const item = await CitaInsumo.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    }).populate("cita insumo odontologo");

    if (!item) return res.status(404).json({ message: "CitaInsumo no encontrado" });

    res.json(item);
  } catch (error) {
    return res.status(500).json({ message: "Error al actualizar citaInsumo" });
  }
};

// Eliminar un citaInsumo
export const deleteCitaInsumo = async (req, res) => {
  try {
    const item = await CitaInsumo.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "CitaInsumo no encontrado" });
    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: "Error al eliminar citaInsumo" });
  }
};
