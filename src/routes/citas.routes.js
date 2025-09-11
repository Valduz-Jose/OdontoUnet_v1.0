import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { createCita, getCitas, getCita, deleteCita } from "../controllers/citas.controller.js";

const router = Router();

router.get("/citas", authRequired, getCitas);
router.get("/citas/:id", authRequired, getCita);
router.post("/citas", authRequired, createCita);
router.delete("/citas/:id", authRequired, deleteCita);

export default router;
