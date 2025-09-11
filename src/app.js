import express from 'express'
import morgan from 'morgan'
import authRoutes from './routes/auth.routes.js'
import cookieParser from 'cookie-parser'
import patientsRoutes from './routes/patients.routes.js'
import citasRoutes from "./routes/citas.routes.js"
import insumoRoutes from "./routes/insumos.routes.js";
import citaInsumoRoutes from "./routes/citaInsumos.routes.js"
import cors from 'cors'

const app = express();
app.use(cors({
    origin:'http://localhost:5173',
    credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

app.use("/api",authRoutes);
app.use("/api",patientsRoutes);
app.use("/api", citasRoutes);
app.use("/api", insumoRoutes);
app.use("/api", citaInsumoRoutes);


export default app;