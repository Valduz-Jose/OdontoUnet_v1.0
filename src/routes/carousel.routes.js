import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { adminRequired } from "../middlewares/role.middleware.js";
import { 
  getCarouselImages, 
  getPublicCarouselImages,
  uploadCarouselImages, 
  deleteCarouselImage,
  updateImageOrder 
} from "../controllers/carousel.controller.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = Router();

// Configuración de multer para imágenes del carrusel
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/carousel';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `carousel-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos de imagen (JPG, PNG, WebP)'));
    }
  }
});

// Rutas públicas (sin autenticación)
router.get("/carousel/public", getPublicCarouselImages);

// Rutas protegidas (solo admin)
router.get("/carousel", authRequired, adminRequired, getCarouselImages);
router.post("/carousel", authRequired, adminRequired, upload.array('images', 10), uploadCarouselImages);
router.delete("/carousel/:id", authRequired, adminRequired, deleteCarouselImage);
router.put("/carousel/order", authRequired, adminRequired, updateImageOrder);

export default router;