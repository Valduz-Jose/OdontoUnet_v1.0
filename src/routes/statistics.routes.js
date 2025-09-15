import { Router } from "express";
import {
  getStatistics,
  getQuickStats,
  getCustomPeriodStats,
} from "../controllers/statistics.controller.js";
import { authRequired } from "../middlewares/validateToken.js";

const router = Router();

// Ruta principal para estadísticas con filtros de fecha
router.get("/statistics", authRequired, getStatistics);

// Ruta para estadísticas rápidas (dashboard)
router.get("/statistics/quick", authRequired, getQuickStats);

// Ruta para estadísticas por período personalizado
router.get("/statistics/period", authRequired, getCustomPeriodStats);

export default router;
