import Insumo from "../models/insumo.model.js";

// Obtener todos los insumos
export const getInsumos = async (req, res) => {
  try {
    const insumos = await Insumo.find().populate("user", "username email");
    res.json(insumos);
  } catch (error) {
    return res.status(500).json({ message: "Error al obtener los insumos" });
  }
};

// Crear insumo
export const createInsumo = async (req, res) => {
  try {
    const { nombre, descripcion, cantidadDisponible, unidadMedida, precioUnitario } = req.body;

    // Verificar si ya existe un insumo con ese nombre
    const insumoExistente = await Insumo.findOne({ nombre });
    if (insumoExistente) {
      return res.status(400).json({ message: "Ese insumo ya está registrado" });
    }

    const nuevoInsumo = new Insumo({
      nombre,
      descripcion,
      cantidadDisponible,
      unidadMedida,
      precioUnitario,
      user: req.user.id
    });

    const saved = await nuevoInsumo.save();
    res.json(saved);
  } catch (error) {
    return res.status(500).json({ message: "Error al crear insumo" });
  }
};

// Obtener un insumo por ID
export const getInsumo = async (req, res) => {
  try {
    const insumo = await Insumo.findById(req.params.id).populate("user", "username email");
    if (!insumo) return res.status(404).json({ message: "Insumo no encontrado" });
    res.json(insumo);
  } catch (error) {
    return res.status(404).json({ message: "Insumo no encontrado" });
  }
};

// Actualizar insumo

export const updateInsumo = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Verificar si existe el insumo
    const insumo = await Insumo.findById(id);
    if (!insumo) {
      return res.status(404).json({ message: "Insumo no encontrado" });
    }

    // Si el nombre que viene en updates es el mismo que ya tiene, lo eliminamos de updates
    if (updates.nombre && updates.nombre === insumo.nombre) {
      delete updates.nombre;
    }

    const updated = await Insumo.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true, // aplica validaciones del schema
    });

    res.json(updated);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Ya existe un insumo con ese nombre",
      });
    }
    console.error("Error en updateInsumo:", error);
    res.status(500).json({ message: "Error al actualizar insumo" });
  }
};


// Eliminar insumo
export const deleteInsumo = async (req, res) => {
  try {
    const insumo = await Insumo.findByIdAndDelete(req.params.id);
    if (!insumo) return res.status(404).json({ message: "Insumo no encontrado" });
    res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: "Error al eliminar insumo" });
  }
};
