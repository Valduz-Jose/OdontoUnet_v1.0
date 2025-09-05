import {Router} from 'express'
import { authRequired } from '../middlewares/validateToken.js'
import {getTask,getTasks,createTask,updateTask,deleteTask} from '../controllers/tasks.controller.js'
import { validateSchema } from "../middlewares/validator.middleware.js";
import { createTaskSchema } from "../schemas/task.schema.js";
import { requireRole } from '../middlewares/role.middleware.js';
const router = Router()

router.get('/tasks',authRequired,getTasks);
router.get('/tasks/:id',authRequired,getTask);
router.post('/tasks',authRequired,validateSchema(createTaskSchema),createTask);
router.delete('/tasks/:id',authRequired,deleteTask);
router.put('/tasks/:id',authRequired,updateTask);
// router.post('/tasks',authRequired,requireRole(["odontologo"]),createTask);

// Rutas del admin
// router.get('/estadisticas',authRequired,requireRole(["admin"])getEstadisticas);

export default router;