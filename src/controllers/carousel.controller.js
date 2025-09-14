import CarouselImage from "../models/carousel.model.js";
import fs from "fs/promises";
import path from "path";

// Obtener todas las imágenes del carrusel
export const getCarouselImages = async (req, res) => {
  try {
    const images = await CarouselImage.find({ isActive: true })
      .populate("uploadedBy", "username")
      .sort({ order: 1, uploadDate: -1 });
    
    res.json(images);
  } catch (error) {
    console.error("Error al obtener imágenes del carrusel:", error);
    res.status(500).json({ message: "Error al obtener las imágenes del carrusel" });
  }
};

// Obtener imágenes públicas para el carrusel (sin autenticación)
export const getPublicCarouselImages = async (req, res) => {
  try {
    const images = await CarouselImage.find({ isActive: true })
      .select("filename originalName uploadDate")
      .sort({ order: 1, uploadDate: -1 });
    
    res.json(images);
  } catch (error) {
    console.error("Error al obtener imágenes públicas del carrusel:", error);
    res.status(500).json({ message: "Error al obtener las imágenes del carrusel" });
  }
};

// Subir nuevas imágenes al carrusel
export const uploadCarouselImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No se enviaron archivos" });
    }

    const uploadedImages = [];

    for (const file of req.files) {
      const newImage = new CarouselImage({
        filename: file.filename,
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        uploadedBy: req.user.id
      });

      const savedImage = await newImage.save();
      await savedImage.populate("uploadedBy", "username");
      uploadedImages.push(savedImage);
    }

    res.status(201).json(uploadedImages);
  } catch (error) {
    console.error("Error al subir imágenes del carrusel:", error);
    res.status(500).json({ message: "Error al subir las imágenes" });
  }
};

// Eliminar imagen del carrusel
export const deleteCarouselImage = async (req, res) => {
  try {
    const { id } = req.params;
    
    const image = await CarouselImage.findById(id);
    if (!image) {
      return res.status(404).json({ message: "Imagen no encontrada" });
    }

    // Eliminar archivo físico
    try {
      await fs.unlink(path.join(process.cwd(), 'uploads/carousel', image.filename));
    } catch (err) {
      console.log("No se pudo eliminar el archivo físico:", err.message);
    }

    // Eliminar de la base de datos
    await CarouselImage.findByIdAndDelete(id);

    res.json({ message: "Imagen eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar imagen del carrusel:", error);
    res.status(500).json({ message: "Error al eliminar la imagen" });
  }
};

// Actualizar orden de las imágenes
export const updateImageOrder = async (req, res) => {
  try {
    const { imageOrders } = req.body; // Array de { id, order }
    
    const updatePromises = imageOrders.map(({ id, order }) => 
      CarouselImage.findByIdAndUpdate(id, { order })
    );
    
    await Promise.all(updatePromises);
    
    res.json({ message: "Orden actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar orden:", error);
    res.status(500).json({ message: "Error al actualizar el orden" });
  }
};