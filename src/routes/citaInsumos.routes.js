import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import {
  createCitaInsumo,
  getCitaInsumos,
  getCitaInsumosByCita,
  updateCitaInsumo,
  deleteCitaInsumo,
} from "../controllers/citaInsumos.controller.js";

const router = Router();

router.post("/cita-insumos", authRequired, createCitaInsumo);
router.get("/cita-insumos", authRequired, getCitaInsumos);
router.get("/cita-insumos/:citaId", authRequired, getCitaInsumosByCita);
router.put("/cita-insumos/:id", authRequired, updateCitaInsumo);
router.delete("/cita-insumos/:id", authRequired, deleteCitaInsumo);

export default router;
