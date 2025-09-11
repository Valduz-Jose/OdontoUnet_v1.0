import {Router} from 'express'
import { authRequired } from '../middlewares/validateToken.js'
import { validateSchema } from "../middlewares/validator.middleware.js";
import {getPatients,getPatient,createPatient,updatePatient,deletePatient} from '../controllers/patients.controller.js'
import { createPatientSchema } from "../schemas/patient.schema.js";
import { adminRequired } from '../middlewares/role.middleware.js';

const router = Router()

router.get('/patients',authRequired,getPatients);
router.get('/patients/:id',authRequired,getPatient);
router.post('/patients',authRequired,validateSchema(createPatientSchema),createPatient);
router.put('/patients/:id',authRequired,updatePatient);
router.delete('/patients/:id',authRequired,deletePatient);


export default router;