import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { adminRequired } from "../middlewares/role.middleware.js";
import { getProfile, updateProfile, getPublicProfile, getAllDoctors, getDoctorsWithStats } from "../controllers/profile.controller.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = Router();

// Configuración de multer para fotos de perfil
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/profiles';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `profile-${req.user.id}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
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

// Rutas
router.get("/profile", authRequired, getProfile);
router.put("/profile", authRequired, upload.single('foto'), updateProfile);
router.get("/profile/public/:id", getPublicProfile);
router.get("/doctors", getAllDoctors);
router.get("/doctors-stats", authRequired, adminRequired, getDoctorsWithStats);

export default router;