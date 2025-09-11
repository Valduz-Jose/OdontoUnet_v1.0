import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { 
  getInsumos, 
  getInsumo, 
  createInsumo, 
  updateInsumo, 
  deleteInsumo 
} from "../controllers/insumos.controller.js";

const router = Router();

router.get("/insumos", authRequired, getInsumos);
router.get("/insumos/:id", authRequired, getInsumo);
router.post("/insumos", authRequired, createInsumo);
router.put("/insumos/:id", authRequired, updateInsumo);
router.delete("/insumos/:id", authRequired, deleteInsumo);

export default router;
