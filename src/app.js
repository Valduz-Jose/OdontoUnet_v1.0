import express from 'express'
import morgan from 'morgan'
import authRoutes from './routes/auth.routes.js'
import cookieParser from 'cookie-parser'
import patientsRoutes from './routes/patients.routes.js'
import citasRoutes from "./routes/citas.routes.js"
import insumoRoutes from "./routes/insumos.routes.js";
import citaInsumoRoutes from "./routes/citaInsumos.routes.js"
import profileRoutes from "./routes/profile.routes.js"
import carouselRoutes from "./routes/carousel.routes.js"
import statisticsRoutes from "./routes/statistics.routes.js"
import cors from 'cors'
import path from 'path'

const app = express();

app.use(cors({
    origin:'http://localhost:5173',
    credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

// Servir archivos estáticos
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Rutas de la API
app.use("/api",authRoutes);
app.use("/api",patientsRoutes);
app.use("/api", citasRoutes);
app.use("/api", insumoRoutes);
app.use("/api", citaInsumoRoutes);
app.use("/api", profileRoutes);
app.use("/api", carouselRoutes);
app.use("/api", statisticsRoutes);

export default app;