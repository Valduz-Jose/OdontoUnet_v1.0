# 🦷 OdontoUNET - Sistema de Gestión Odontológico

<div align="center">

![UNET](https://img.shields.io/badge/🎓_UNET-Odontolog%C3%ADa-1E4A8B?style=for-the-badge)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

**Sistema integral de gestión administrativa para la Unidad Odontológica de la Universidad Nacional Experimental del Táchira (UNET)**

[🌐 Demo en Vivo](https://odontounet-frontend.vercel.app) · [📖 Documentación](#-documentación-de-api) · [🐛 Reportar Bug](https://github.com/Valduz-Jose/OdontoUnet_v1.0/issues) · [✨ Solicitar Feature](https://github.com/Valduz-Jose/OdontoUnet_v1.0/issues)

</div>

---

## 📋 Tabla de Contenidos

- [🎯 Descripción](#-descripción)
- [✨ Características Principales](#-características-principales)
- [🏗️ Arquitectura del Sistema](#️-arquitectura-del-sistema)
- [🚀 Tech Stack](#-tech-stack)
- [📦 Instalación](#-instalación)
- [⚙️ Configuración](#️-configuración)
- [🎮 Uso](#-uso)
- [📂 Estructura del Proyecto](#-estructura-del-proyecto)
- [🔒 Seguridad](#-seguridad)
- [🧪 Testing](#-testing)
- [📖 Documentación de API](#-documentación-de-api)
- [🤝 Contribuir](#-contribuir)
- [📄 Licencia](#-licencia)
- [👨‍💻 Autor](#-autor)

---

## 🎯 Descripción

**OdontoUNET** es una solución tecnológica moderna diseñada para transformar digitalmente la gestión administrativa y clínica de la Unidad Odontológica de la UNET. El sistema reemplaza los procesos manuales tradicionales (cuadernos físicos, registros dispersos) con una plataforma web centralizada que garantiza:

- ✅ **Trazabilidad completa** de historias clínicas y tratamientos
- ✅ **Control automático** del inventario de insumos
- ✅ **Reportes en tiempo real** para toma de decisiones
- ✅ **Seguridad de datos** mediante encriptación y control de acceso por roles

### 🌟 Problema que Resuelve

La Unidad Odontológica enfrentaba:
- 📋 Pérdida de información clínica en registros físicos
- ⏱️ Ineficiencia operativa (sin trazabilidad de tratamientos)
- 📦 Control deficiente del inventario de insumos
- 📊 Imposibilidad de generar estadísticas confiables

### 🎯 Solución Implementada

Un sistema web full-stack que digitaliza:
- 👤 **Gestión de Pacientes**: Historia clínica electrónica completa
- 🦷 **Odontodiagrama Digital**: Registro interactivo del estado de 32 dientes con snapshots históricos
- 📅 **Gestión de Citas**: Registro inmediato con descuento automático de inventario
- 💊 **Control de Inventario**: Alertas de stock bajo y trazabilidad de consumo
- 📊 **Estadísticas**: Dashboard ejecutivo con métricas en tiempo real

---

## ✨ Características Principales

### 🦷 Odontodiagrama Interactivo
- **32 dientes** con 10 estados clínicos posibles
- **Snapshots históricos** por cita (inmutabilidad de registros)
- **Actualización en tiempo real** del estado del paciente
- **Trazabilidad completa** de tratamientos realizados

### 📊 Dashboard Ejecutivo
- Citas realizadas por período
- Pacientes atendidos (estadísticas por género)
- Ingresos totales y promedio por cita
- Insumos más utilizados
- Días más concurridos
- Rendimiento por odontólogo

### 🔐 Seguridad Robusta
- Autenticación con **JWT** (JSON Web Tokens)
- Cookies **HTTP-only** (protección anti-XSS)
- **RBAC** (Control de Acceso Basado en Roles: Admin vs Odontólogo)
- Encriptación de contraseñas con **bcrypt** (10 rounds)
- **CORS** configurado para orígenes específicos

### 💊 Gestión Inteligente de Inventario
- Descuento **automático** de insumos al cerrar cita
- Alertas de **stock crítico** (< 10 unidades)
- Trazabilidad financiera (precio × cantidad)
- Registro de entradas/salidas

### 👨‍⚕️ Panel de Doctores
- Estadísticas de rendimiento individual
- Tasa de actividad y pacientes atendidos
- Gestión de horarios y días laborables
- Biografía profesional visible en landing page

---

## 🏗️ Arquitectura del Sistema

### Patrón MVC (Modelo-Vista-Controlador)

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENTE                              │
│                    (Navegador Web)                           │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP/HTTPS
                       │ JSON
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (VISTA)                          │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  React 19 + Vite                                   │    │
│  │  • React Router DOM (navegación)                   │    │
│  │  • Context API (estado global)                     │    │
│  │  • Axios (cliente HTTP)                            │    │
│  │  • Tailwind CSS (estilos)                          │    │
│  │  • React Hook Form (formularios)                   │    │
│  └────────────────────────────────────────────────────┘    │
└──────────────────────┬──────────────────────────────────────┘
                       │ API REST
                       │ /api/*
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              BACKEND (CONTROLADOR)                           │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Node.js + Express.js                              │    │
│  │                                                     │    │
│  │  Middlewares:                                      │    │
│  │  • authRequired (JWT)                              │    │
│  │  • adminRequired (RBAC)                            │    │
│  │  • validateSchema (Zod)                            │    │
│  │  • multer (upload de archivos)                     │    │
│  │                                                     │    │
│  │  Rutas (Controllers):                              │    │
│  │  • /api/auth          (login, register, verify)    │    │
│  │  • /api/patients      (CRUD pacientes)             │    │
│  │  • /api/citas         (gestión de citas)           │    │
│  │  • /api/insumos       (inventario)                 │    │
│  │  • /api/profile       (perfiles de doctores)       │    │
│  │  • /api/statistics    (reportes)                   │    │
│  │  • /api/carousel      (landing page)               │    │
│  └────────────────────────────────────────────────────┘    │
└──────────────────────┬──────────────────────────────────────┘
                       │ Mongoose ODM
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                   BASE DE DATOS (MODELO)                     │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  MongoDB (NoSQL)                                   │    │
│  │                                                     │    │
│  │  Colecciones:                                      │    │
│  │  • users          (autenticación)                  │    │
│  │  • profiles       (datos profesionales)            │    │
│  │  • patients       (historias clínicas)             │    │
│  │  • citas          (consultas + odontodiagrama)     │    │
│  │  • insumos        (inventario)                     │    │
│  │  • citainsumos    (consumo por cita)               │    │
│  │  • carouselimages (landing page)                   │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### Flujo de Datos

1. **Cliente** → Solicitud HTTP (GET/POST/PUT/DELETE)
2. **Frontend** → Valida y envía datos vía Axios
3. **Backend** → Middlewares (auth, validación) → Controlador
4. **Controlador** → Consulta/Modifica datos vía Mongoose
5. **Base de Datos** → Retorna resultado
6. **Backend** → Respuesta JSON
7. **Frontend** → Actualiza UI (React State)

---

## 🚀 Tech Stack

### Backend
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white) | 20.x | Runtime JavaScript |
| ![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white) | 5.1.0 | Framework web |
| ![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat&logo=mongodb&logoColor=white) | 8.18.0 | Base de datos NoSQL |
| ![JWT](https://img.shields.io/badge/JWT-000000?style=flat&logo=jsonwebtokens&logoColor=white) | 9.0.2 | Autenticación |
| ![Bcrypt](https://img.shields.io/badge/Bcrypt-338844?style=flat) | 3.0.2 | Hash de contraseñas |
| ![Zod](https://img.shields.io/badge/Zod-3E67B1?style=flat) | 4.1.1 | Validación de esquemas |
| ![Multer](https://img.shields.io/badge/Multer-F46519?style=flat) | 2.0.2 | Upload de archivos |
| ![DayJS](https://img.shields.io/badge/DayJS-FF5F52?style=flat) | 1.11.18 | Manejo de fechas |

### Frontend
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| ![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black) | 19.1.0 | Librería UI |
| ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white) | 6.3.5 | Build tool |
| ![TailwindCSS](https://img.shields.io/badge/Tailwind-38B2AC?style=flat&logo=tailwind-css&logoColor=white) | 4.1.12 | Framework CSS |
| ![Axios](https://img.shields.io/badge/Axios-5A29E4?style=flat&logo=axios&logoColor=white) | 1.11.0 | Cliente HTTP |
| ![React Router](https://img.shields.io/badge/React_Router-CA4245?style=flat&logo=react-router&logoColor=white) | 7.8.2 | Navegación |
| ![React Hook Form](https://img.shields.io/badge/React_Hook_Form-EC5990?style=flat&logo=reacthookform&logoColor=white) | 7.62.0 | Gestión de formularios |
| ![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=flat&logo=framer&logoColor=white) | 12.23.12 | Animaciones |
| ![Lucide React](https://img.shields.io/badge/Lucide-F56565?style=flat) | 0.542.0 | Iconos |

### Herramientas de Desarrollo
- **Nodemon**: Hot reload del servidor
- **ESLint**: Linting de código
- **Morgan**: Logging de requests HTTP
- **Cookie Parser**: Manejo de cookies
- **CORS**: Control de acceso cruzado

---

## 📦 Instalación

### Prerequisitos

Antes de comenzar, asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) >= 18.x
- [npm](https://www.npmjs.com/) >= 9.x o [yarn](https://yarnpkg.com/)
- [MongoDB](https://www.mongodb.com/) >= 6.x (local o Atlas)
- [Git](https://git-scm.com/)

### Clonar el Repositorio

```bash
git clone https://github.com/Valduz-Jose/odontounet.git
cd odontounet
```

### Instalación del Backend

```bash
# Navegar a la carpeta raíz (backend)
cd odontounet

# Instalar dependencias
npm install

# O con yarn
yarn install
```

### Instalación del Frontend

```bash
# Navegar a la carpeta del cliente
cd client  # o frontend, según tu estructura

# Instalar dependencias
npm install

# O con yarn
yarn install
```

---

## ⚙️ Configuración

### Variables de Entorno

#### Backend (`.env` en la raíz)

Crea un archivo `.env` en la raíz del proyecto y configura:

```env
# Configuración de la base de datos
MONGODB_URI=mongodb://localhost:27017/odontounet
# Para producción con MongoDB Atlas:
# MONGODB_URI=mongodb+srv://usuario:contraseña@cluster.mongodb.net/odontounet

# Clave secreta para JWT (¡CÁMBIALA EN PRODUCCIÓN!)
TOKEN_SECRET=tu_clave_secreta_jwt

# Clave para crear administradores (¡CÁMBIALA EN PRODUCCIÓN!)
ADMIN_CREATION_KEY=admin_unet

# Clave especial para registro de doctores (¡CÁMBIALA EN PRODUCCIÓN!)
DOCTOR_REGISTRATION_KEY=doctor_unet

# Puerto del servidor
PORT=3000

# Entorno (development | production)
NODE_ENV=development
```

#### Frontend (`.env` en `/client` o `/frontend`)

```env
# URL del backend
VITE_API_URL=http://localhost:3000/api

# Para producción:
# VITE_API_URL=https://tu-backend.herokuapp.com/api
```

### Configuración de MongoDB

#### Opción 1: MongoDB Local

1. Instala MongoDB Community Edition
2. Inicia el servicio:
   ```bash
   # Windows
   net start MongoDB
   
   # macOS/Linux
   sudo systemctl start mongod
   ```
3. La URI por defecto es: `mongodb://localhost:27017/odontounet`

#### Opción 2: MongoDB Atlas (Cloud)

1. Crea una cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crea un cluster gratuito
3. Configura el acceso a la red (whitelist tu IP o 0.0.0.0/0)
4. Obtén la cadena de conexión y actualiza `MONGODB_URI` en `.env`

---

## 🎮 Uso

### Modo Desarrollo

#### Iniciar Backend

```bash
# Desde la raíz del proyecto
npm run dev

# El servidor estará disponible en http://localhost:3000
```

#### Iniciar Frontend

```bash
# Desde la carpeta del cliente
cd client
npm run dev

# La aplicación estará disponible en http://localhost:5173
```

### Modo Producción

#### Build del Frontend

```bash
cd client
npm run build

# Los archivos estáticos se generarán en /client/dist
```

#### Iniciar Backend en Producción

```bash
# Desde la raíz
NODE_ENV=production node src/index.js
```

### Scripts Disponibles

#### Backend
```bash
npm run dev       # Inicia servidor con nodemon (hot reload)
npm start         # Inicia servidor en producción
```

#### Frontend
```bash
npm run dev       # Inicia servidor de desarrollo (Vite)
npm run build     # Genera build de producción
npm run preview   # Previsualiza el build
npm run lint      # Ejecuta ESLint
```

---

## 📂 Estructura del Proyecto

```
odontounet/
├── src/                          # Código fuente del backend
│   ├── controllers/              # Lógica de negocio
│   │   ├── auth.controller.js
│   │   ├── patients.controller.js
│   │   ├── citas.controller.js
│   │   ├── insumos.controller.js
│   │   ├── profile.controller.js
│   │   ├── carousel.controller.js
│   │   ├── citaInsumos.controller.js
│   │   └── statistics.controller.js
│   ├── models/                   # Esquemas de Mongoose
│   │   ├── user.model.js
│   │   ├── profile.model.js
│   │   ├── patient.model.js
│   │   ├── cita.model.js
│   │   ├── insumo.model.js
│   │   ├── citaInsumo.model.js
│   │   ├── carousel.model.js
│   │   └── dienteSchema.js       # Subdocumento del odontodiagrama
│   ├── routes/                   # Definición de rutas
│   │   ├── auth.routes.js
│   │   ├── patients.routes.js
│   │   ├── citas.routes.js
│   │   ├── insumos.routes.js
│   │   ├── profile.routes.js
│   │   ├── carousel.routes.js
│   │   ├── citaInsumos.routes.js
│   │   └── statistics.routes.js
│   ├── middlewares/              # Middlewares personalizados
│   │   ├── validateToken.js      # Verifica JWT
│   │   ├── role.middleware.js    # RBAC (admin/odontologo)
│   │   └── validator.middleware.js # Validación con Zod
│   ├── schemas/                  # Esquemas de validación (Zod)
│   │   ├── auth.schema.js
│   │   └── patient.schema.js
│   ├── libs/                     # Utilidades
│   │   └── jwt.js                # Generación de tokens
│   ├── utils/                    # Funciones helper
│   │   └── calculateAge.js
│   ├── app.js                    # Configuración de Express
│   ├── index.js                  # Punto de entrada
│   ├── db.js                     # Conexión a MongoDB
│   └── config.js                 # Variables de entorno
├── uploads/                      # Archivos subidos
│   ├── profiles/                 # Fotos de perfil
│   └── carousel/                 # Imágenes del carrusel
├── client/                       # Frontend React
│   ├── src/
│   │   ├── components/           # Componentes reutilizables
│   │   ├── pages/                # Páginas de la aplicación
│   │   ├── context/              # Context API (estado global)
│   │   ├── api/                  # Configuración de Axios
│   │   ├── App.jsx               # Componente raíz
│   │   ├── main.jsx              # Punto de entrada
│   │   └── index.css             # Estilos globales (Tailwind)
│   ├── public/                   # Archivos estáticos
│   ├── index.html
│   ├── vite.config.js            # Configuración de Vite
│   └── package.json
├── .env                          # Variables de entorno (backend)
├── .gitignore
├── package.json
└── README.md
```

---

## 🔒 Seguridad

### Mecanismos Implementados

#### 1. Autenticación con JWT
```javascript
// Generación de token con expiración de 1 día
const token = jwt.sign(
  { id: user._id }, 
  TOKEN_SECRET, 
  { expiresIn: "1d" }
);
```

#### 2. Cookies HTTP-only
```javascript
res.cookie("token", token, {
  httpOnly: true,  // No accesible desde JavaScript
  secure: process.env.NODE_ENV === "production",
  sameSite: "none"  // Para CORS
});
```

#### 3. Control de Acceso por Roles (RBAC)
```javascript
// Middleware adminRequired
export const adminRequired = async (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Acceso denegado" });
  }
  next();
};
```

#### 4. Validación de Datos con Zod
```javascript
// Ejemplo de schema
const registerSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6)
});
```

#### 5. Encriptación de Contraseñas
```javascript
const passwordHash = await bcrypt.hash(password, 10);
```

### Recomendaciones de Seguridad

- ✅ Cambia `TOKEN_SECRET`, `ADMIN_CREATION_KEY` y `DOCTOR_REGISTRATION_KEY` en producción
- ✅ Usa HTTPS en producción
- ✅ Configura MongoDB con autenticación
- ✅ Implementa rate limiting para prevenir ataques de fuerza bruta
- ✅ Mantén las dependencias actualizadas (`npm audit`)

---

## 🧪 Testing

### Pruebas Realizadas

#### ✅ Pruebas Unitarias
- Validación de modelos de Mongoose
- Verificación de schemas de Zod
- Control de unicidad de datos (cédula, email)

#### ✅ Pruebas de Integración
- CRUD de pacientes, citas e insumos
- Descuento automático de inventario
- Generación de snapshots del odontodiagrama

#### ✅ Pruebas de Seguridad
- Autenticación con JWT
- Control de acceso por roles (RBAC)
- Protección de rutas privadas

#### ✅ Pruebas Funcionales (Caja Negra)
- Flujo completo de registro de paciente
- Creación de cita con descuento de insumos
- Generación de reportes estadísticos

### Ejecutar Pruebas (Futuro)

```bash
# Instalar dependencias de testing
npm install --save-dev jest supertest

# Ejecutar pruebas
npm test
```

---

## 📖 Documentación de API

### Base URL
```
Desarrollo: http://localhost:3000/api
Producción: https://tu-backend.herokuapp.com/api
```

### Endpoints Principales

#### 🔐 Autenticación

##### POST `/api/register`
Registra un nuevo odontólogo.

**Body:**
```json
{
  "username": "Dr. Juan Pérez",
  "email": "juan@unet.edu.ve",
  "password": "123456",
  "doctorKey": "clave_especial"
}
```

**Response:** `201 Created`
```json
{
  "id": "60f7b3b3b3b3b3b3b3b3b3b3",
  "username": "Dr. Juan Pérez",
  "email": "juan@unet.edu.ve",
  "role": "odontologo"
}
```

---

##### POST `/api/login`
Inicia sesión.

**Body:**
```json
{
  "email": "juan@unet.edu.ve",
  "password": "123456"
}
```

**Response:** `200 OK`
```json
{
  "id": "60f7b3b3b3b3b3b3b3b3b3b3",
  "username": "Dr. Juan Pérez",
  "email": "juan@unet.edu.ve",
  "role": "odontologo"
}
```
*+ Cookie HTTP-only con token JWT*

---

##### GET `/api/verify`
Verifica si el token es válido.

**Headers:**
```
Cookie: token=<jwt_token>
```

**Response:** `200 OK`
```json
{
  "id": "60f7b3b3b3b3b3b3b3b3b3b3",
  "username": "Dr. Juan Pérez",
  "email": "juan@unet.edu.ve",
  "role": "odontologo"
}
```

---

#### 👤 Pacientes

##### GET `/api/patients`
Obtiene todos los pacientes.

**Headers:**
```
Cookie: token=<jwt_token>
```

**Response:** `200 OK`
```json
[
  {
    "_id": "...",
    "nombre": "María",
    "apellido": "González",
    "cedula": "V-12345678",
    "edad": 25,
    "sexo": "Femenino",
    "telefonoContacto": "0414-1234567",
    "odontograma": [
      { "numero": 1, "estado": "Sano" },
      { "numero": 2, "estado": "Cariado" }
    ]
  }
]
```

---

##### POST `/api/patients`
Crea un nuevo paciente.

**Body:**
```json
{
  "nombre": "María",
  "apellido": "González",
  "cedula": "V-12345678",
  "fechaNacimiento": "1998-05-15",
  "sexo": "Femenino",
  "telefonoContacto": "0414-1234567",
  "direccion": "Calle Principal #123",
  "alergias": "Penicilina",
  "enfermedadesCronicas": "Ninguna"
}
```

---

#### 📅 Citas

##### POST `/api/citas`
Registra una nueva cita.

**Body:**
```json
{
  "pacienteId": "...",
  "motivo": "Dolor de muela",
  "observaciones": "Caries en molar inferior derecho",
  "tratamientos": ["Restauración"],
  "monto": 50000,
  "numeroReferencia": "REF123456",
  "odontograma": [
    { "numero": 30, "estado": "Obturado" }
  ],
  "insumosUsados": [
    { "insumo": "insumo_id", "cantidad": 5 }
  ]
}
```

---

#### 💊 Insumos

##### GET `/api/insumos`
Obtiene todos los insumos.

##### POST `/api/insumos`
Crea un nuevo insumo.

##### PUT `/api/insumos/:id`
Actualiza un insumo.

---

#### 📊 Estadísticas

##### GET `/api/statistics?startDate=2025-01-01&endDate=2025-12-31`
Obtiene estadísticas del período especificado.

**Response:** `200 OK`
```json
{
  "pacientesAtendidos": 15,
  "citasRealizadas": 64,
  "ingresosTotales": 246348,
  "promedioIngresoDiario": 7947,
  "insumosUsados": [
    { "nombre": "Algodón", "totalUsado": 115 },
    { "nombre": "Gasa", "totalUsado": 32 }
  ],
  "diasMasConcurridos": [
    { "_id": 5, "totalCitas": 29 }
  ],
  "odontologosActivos": 5
}
```

---

### Códigos de Estado HTTP

| Código | Descripción |
|--------|-------------|
| 200 | OK - Solicitud exitosa |
| 201 | Created - Recurso creado exitosamente |
| 204 | No Content - Eliminación exitosa |
| 400 | Bad Request - Datos inválidos |
| 401 | Unauthorized - Token inválido o ausente |
| 403 | Forbidden - Sin permisos suficientes |
| 404 | Not Found - Recurso no encontrado |
| 500 | Internal Server Error - Error del servidor |

---

## 🎨 Capturas de Pantalla

### Landing Page
<img width="1905" height="922" alt="Captura de pantalla 2025-10-18 163738" src="https://github.com/user-attachments/assets/207e68da-32a4-444a-983c-955195e7de70" />
<img width="1905" height="619" alt="Captura de pantalla (108)" src="https://github.com/user-attachments/assets/e39d7f50-b700-4eff-bf25-e58482c6ed62" />
<img width="1895" height="824" alt="Captura de pantalla (109)" src="https://github.com/user-attachments/assets/65e819bf-e3c3-43fa-9575-56d73d1c5614" />
<img width="1890" height="827" alt="Captura de pantalla (110)" src="https://github.com/user-attachments/assets/bbe311b6-8739-4caa-be85-38317eb2b974" />
*Página principal con carrusel de imágenes de la universidad y servicios ofrecidos*

### Login y Registro
<img width="1894" height="913" alt="Captura de pantalla (103)" src="https://github.com/user-attachments/assets/dd629050-c9bd-4a30-86d4-a9308e017128" />
<img width="1882" height="913" alt="Captura de pantalla (104)" src="https://github.com/user-attachments/assets/1184b594-ac27-4923-8dc9-4bc30b2529f3" />
<img width="1883" height="917" alt="Captura de pantalla (105)" src="https://github.com/user-attachments/assets/3f172082-bdd3-45a5-8d83-5376f22bdd54" />
<img width="1890" height="833" alt="Captura de pantalla (106)" src="https://github.com/user-attachments/assets/c551f8f3-b60a-4e5d-84ec-15ed491f1215" />
*Sistema de autenticación seguro con validación de roles*

### Dashboard Estadísticas
<img width="1897" height="915" alt="Captura de pantalla (117)" src="https://github.com/user-attachments/assets/bbcbe8a4-fddd-496f-88c7-2408bc5fd41e" />
<img width="1892" height="818" alt="Captura de pantalla (118)" src="https://github.com/user-attachments/assets/9fa4ffba-5362-4fda-a1de-b1ad4dfe1d8b" />
*Panel ejecutivo con métricas en tiempo real*

### Gestión de Pacientes
<img width="1895" height="913" alt="Captura de pantalla (123)" src="https://github.com/user-attachments/assets/099a3452-6dba-4004-b0d1-ca68c353102c" />
*Lista de pacientes con historia clínica completa*

### Odontodiagrama Interactivo
<img width="1904" height="638" alt="Captura de pantalla 2025-10-19 130944" src="https://github.com/user-attachments/assets/01ad0d6d-28fe-4714-b9d2-c11b4ce9b58a" />
*Registro interactivo del estado de 32 dientes con leyenda de colores*

### Registro de Cita
<img width="1894" height="917" alt="Captura de pantalla (132)" src="https://github.com/user-attachments/assets/08b06fd9-f773-4d34-b217-9d9f765a8da8" />
<img width="1898" height="789" alt="Captura de pantalla (133)" src="https://github.com/user-attachments/assets/d921bc76-7282-4131-b5ba-e2a6be662372" />
<img width="1904" height="258" alt="Captura de pantalla 2025-10-19 131529" src="https://github.com/user-attachments/assets/ed8dac9f-ca13-427b-8f23-93c43f87a97a" />
*Interfaz para registrar consultas con descuento automático de insumos*

### Control de Inventario
<img width="1890" height="913" alt="Captura de pantalla (113)" src="https://github.com/user-attachments/assets/d3cebcc3-9550-4334-84b9-920bdc3b1e22" />
<img width="1898" height="768" alt="Captura de pantalla (114)" src="https://github.com/user-attachments/assets/d7972cf0-3eda-4537-9db1-e4529086b48b" />
<img width="1920" height="923" alt="Captura de pantalla (115)" src="https://github.com/user-attachments/assets/30ee0568-70a5-4dbb-a4bf-884e7205eff0" />
<img width="1891" height="819" alt="Captura de pantalla (116)" src="https://github.com/user-attachments/assets/ddc0b38b-625b-478d-8ee5-3f377a7f03ce" />
*Gestión de insumos con alertas de stock bajo*

---

## 🚀 Deployment

### Deploy en Vercel (Frontend)

1. **Crea una cuenta en [Vercel](https://vercel.com)**

2. **Conecta tu repositorio de GitHub**

3. **Configura el proyecto:**
   ```
   Root Directory: client/
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

4. **Variables de entorno:**
   ```
   VITE_API_URL=https://tu-backend.herokuapp.com/api
   ```

5. **Deploy automático:** Cada push a `main` desplegará automáticamente

### Deploy en Railway/Render (Backend)

#### Opción 1: Railway

1. **Crea una cuenta en [Railway](https://railway.app)**

2. **Conecta tu repositorio**

3. **Configura variables de entorno:**
   ```
   MONGODB_URI=mongodb+srv://...
   TOKEN_SECRET=tu_clave_secreta
   ADMIN_CREATION_KEY=tu_clave_admin
   DOCTOR_REGISTRATION_KEY=tu_clave_doctor
   PORT=3000
   NODE_ENV=production
   ```

4. **Railway detectará automáticamente tu `package.json` y desplegará**

#### Opción 2: Render

1. **Crea una cuenta en [Render](https://render.com)**

2. **New Web Service** → Conecta tu repo

3. **Configuración:**
   ```
   Build Command: npm install
   Start Command: node src/index.js
   ```

4. **Agrega variables de entorno igual que Railway**

### Deploy en Heroku (Backend)

```bash
# Instalar Heroku CLI
npm install -g heroku

# Login
heroku login

# Crear app
heroku create odontounet-backend

# Configurar variables de entorno
heroku config:set MONGODB_URI=mongodb+srv://...
heroku config:set TOKEN_SECRET=tu_clave_secreta
heroku config:set ADMIN_CREATION_KEY=tu_clave_admin
heroku config:set DOCTOR_REGISTRATION_KEY=tu_clave_doctor
heroku config:set NODE_ENV=production

# Deploy
git push heroku main

# Ver logs
heroku logs --tail
```

---

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Si quieres mejorar este proyecto:

### Proceso de Contribución

1. **Fork el proyecto**
   ```bash
   # Haz clic en el botón "Fork" en GitHub
   ```

2. **Clona tu fork**
   ```bash
   git clone https://github.com/tu-usuario/odontounet.git
   cd odontounet
   ```

3. **Crea una rama para tu feature**
   ```bash
   git checkout -b feature/nueva-funcionalidad
   ```

4. **Haz tus cambios y commitea**
   ```bash
   git add .
   git commit -m "feat: agrega nueva funcionalidad X"
   ```

5. **Push a tu fork**
   ```bash
   git push origin feature/nueva-funcionalidad
   ```

6. **Abre un Pull Request**
   - Ve a tu fork en GitHub
   - Haz clic en "Compare & pull request"
   - Describe tus cambios detalladamente

### Convenciones de Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: nueva funcionalidad
fix: corrección de bug
docs: cambios en documentación
style: formato, punto y coma faltante, etc
refactor: refactorización de código
test: agregar tests
chore: cambios en build, dependencias, etc
```

### Reportar Bugs

Si encuentras un bug, por favor [crea un issue](https://github.com/Valduz-Jose/odontounet/issues) con:

- 🐛 Descripción clara del problema
- 📋 Pasos para reproducirlo
- 🖥️ Entorno (OS, navegador, versión de Node)
- 📸 Screenshots (si aplica)

### Solicitar Features

Para solicitar nuevas funcionalidades, [abre un issue](https://github.com/Valduz-Jose/odontounet/issues) con:

- ✨ Descripción de la feature
- 🎯 Problema que resuelve
- 💡 Propuesta de solución

---

## 🗺️ Roadmap

### ✅ Fase 1: MVP (Completado)
- [x] Autenticación con JWT
- [x] CRUD de pacientes
- [x] Historia clínica electrónica
- [x] Odontodiagrama digital con snapshots
- [x] Gestión de citas
- [x] Control de inventario transaccional
- [x] Dashboard con estadísticas
- [x] Panel de gestión de doctores
- [x] Landing page con carrusel

### 🚧 Fase 2: Mejoras (En Progreso)
- [ ] Módulo de agendamiento de citas (calendario)
- [ ] Notificaciones por email/SMS
- [ ] Exportar reportes a PDF
- [ ] Backup automático de base de datos
- [ ] Tests automatizados (Jest + Supertest)
- [ ] Documentación con Swagger/OpenAPI

### 🔮 Fase 3: Expansión (Futuro)
- [ ] App móvil (React Native)
- [ ] Integración con IA para diagnóstico asistido
- [ ] Interoperabilidad con sistemas nacionales de salud
- [ ] Firma digital certificada
- [ ] Portal del paciente (ver su historia)
- [ ] Sistema de pagos en línea
- [ ] Integración con radiografías digitales
- [ ] Chat en tiempo real (Socket.io)

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

```
MIT License

Copyright (c) 2025 José Alejandro Valduz Contreras

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 👨‍💻 Autor

<div align="center">

### **José Alejandro Valduz Contreras**

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Valduz-Jose)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/Valduz-Jose)
[![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:jose.valduz@unet.edu.ve)

**Ingeniero en Informática - UNET**

*Proyecto Especial de Grado - Octubre 2025*

</div>

---

## 🙏 Agradecimientos

- **Ing. Ivett Kool** - Tutora académica y guía del proyecto
- **Personal de la Unidad Odontológica UNET** - Por su colaboración y retroalimentación
- **Universidad Nacional Experimental del Táchira (UNET)** - Por la formación académica
- **Comunidad Open Source** - Por las increíbles herramientas que hicieron posible este proyecto

---

## 📞 Soporte

¿Tienes preguntas o necesitas ayuda?

- 📧 Email: [jose.valduz@unet.edu.ve](mailto:jose.valduz@unet.edu.ve)
- 🐛 Issues: [GitHub Issues](https://github.com/Valduz-Jose/odontounet/issues)
- 💬 Discusiones: [GitHub Discussions](https://github.com/Valduz-Jose/odontounet/discussions)

---

## 📊 Estadísticas del Proyecto

<div align="center">

<!-- Estadísticas sociales -->
![Stars](https://img.shields.io/github/stars/Valduz-Jose/OdontoUnet_v1.0?style=social)
![Forks](https://img.shields.io/github/forks/Valduz-Jose/OdontoUnet_v1.0?style=social)
![Watchers](https://img.shields.io/github/watchers/Valduz-Jose/OdontoUnet_v1.0?style=social)

<!-- Actividad -->
![Issues](https://img.shields.io/github/issues/Valduz-Jose/OdontoUnet_v1.0)
![Pull Requests](https://img.shields.io/github/issues-pr/Valduz-Jose/OdontoUnet_v1.0)
![Last Commit](https://img.shields.io/github/last-commit/Valduz-Jose/OdontoUnet_v1.0)

<!-- Tamaño -->
![Code Size](https://img.shields.io/github/languages/code-size/Valduz-Jose/OdontoUnet_v1.0)
![Repo Size](https://img.shields.io/github/repo-size/Valduz-Jose/OdontoUnet_v1.0)

</div>

---

## 🌟 Inspiración

Este proyecto fue desarrollado como **Proyecto Especial de Grado** para obtener el título de Ingeniero en Informática en la Universidad Nacional Experimental del Táchira (UNET).

La motivación principal fue resolver una problemática real en la institución y contribuir a la modernización de los servicios de salud universitarios mediante la implementación de tecnologías de información modernas.

---

<div align="center">

### ⭐ Si este proyecto te fue útil, considera darle una estrella en GitHub ⭐

**Hecho con ❤️ y ☕ en Venezuela**

![UNET](https://img.shields.io/badge/UNET-Universidad_Nacional_Experimental_del_Táchira-1E4A8B?style=for-the-badge)

<img width="100" height="100" alt="logo unet" src="https://github.com/user-attachments/assets/1ca9438c-f1b8-4190-864d-fe20529f1909" />

---

**© 2025 OdontoUNET - Todos los derechos reservados**

</div>
