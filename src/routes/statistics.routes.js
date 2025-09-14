import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { adminRequired } from "../middlewares/role.middleware.js";
import { getStatistics, getInsumoStatistics } from "../controllers/statistics.controller.js";

const router = Router();

// Rutas protegidas (solo admin)
router.get("/statistics", authRequired, adminRequired, getStatistics);
router.get("/statistics/insumos", authRequired, adminRequired, getInsumoStatistics);

export default router;