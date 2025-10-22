import express from "express";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import patientsRoutes from "./routes/patients.routes.js";
import citasRoutes from "./routes/citas.routes.js";
import insumoRoutes from "./routes/insumos.routes.js";
import citaInsumoRoutes from "./routes/citaInsumos.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import carouselRoutes from "./routes/carousel.routes.js";
import statisticsRoutes from "./routes/statistics.routes.js";
import cors from "cors";
import path from "path";

const app = express();

// Configuración de CORS para múltiples orígenes
const allowedOrigins = [
  "http://localhost:5173", // Para desarrollo local
  "http://localhost:3000", // Por si usas otro puerto en desarrollo
  "https://odonto-unet-v1-0.vercel.app", // mi frontend en producción
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Permitir requests sin origin (como aplicaciones móviles o Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("No permitido por CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  })
);

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

// Servir archivos estáticos
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Ruta de health check (útil para verificar que el backend funciona)
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Backend funcionando correctamente",
    timestamp: new Date().toISOString(),
  });
});

// Rutas de la API
app.use("/api", authRoutes);
app.use("/api", patientsRoutes);
app.use("/api", citasRoutes);
app.use("/api", insumoRoutes);
app.use("/api", citaInsumoRoutes);
app.use("/api", profileRoutes);
app.use("/api", carouselRoutes);
app.use("/api", statisticsRoutes);

export default app;
