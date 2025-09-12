import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { createCita, getCitas, getCita, deleteCita, getCitasByPaciente,getUltimaCitaPaciente } from "../controllers/citas.controller.js";

const router = Router();

router.get("/citas", authRequired, getCitas);
router.get("/citas/:id", authRequired, getCita);
router.get("/citas/paciente/:id", authRequired, getCitasByPaciente);
router.post("/citas", authRequired, createCita);
router.delete("/citas/:id", authRequired, deleteCita);
router.get("/citas/:pacienteId/ultima", authRequired, getUltimaCitaPaciente);
export default router;
