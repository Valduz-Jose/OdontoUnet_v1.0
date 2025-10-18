import axios from "./axios";

// Ya no necesitamos esta línea hardcodeada ya que axios.js maneja las URLs
// const API = "http://localhost:3000/api"; //  REMOVIDO

export const registerRequest = (user) => {
  return axios.post("/register", {
    username: user.username,
    email: user.email,
    password: user.password,
    doctorKey: user.doctorKey,
    // Campos del perfil
    telefono: user.telefono,
    direccion: user.direccion,
    fechaNacimiento: user.fechaNacimiento,
    especialidad: user.especialidad,
    numeroLicencia: user.numeroLicencia,
    biografia: user.biografia,
  });
};

export const loginRequest = (user) => axios.post("/login", user);
export const verifyTokenRequest = () => axios.get("/verify");
export const logoutRequest = () => axios.post("/logout");
