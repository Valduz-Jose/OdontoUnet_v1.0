import { createContext, useContext, useState, useEffect } from "react";
import {
  registerRequest,
  loginRequest,
  verifyTokenRequest,
  logoutRequest,
} from "../api/auth";
import Cookies from "js-cookie";

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registrationSuccess, setRegistrationSuccess] = useState(false); // 🆕 Nuevo estado

  // 🔄 FUNCIÓN SIGNUP MODIFICADA
  const signup = async (user) => {
    try {
      const res = await registerRequest(user);
      console.log("Respuesta del registro:", res.data);

      // ❌ NO establecemos usuario ni autenticación
      // setUser(res.data);
      // setIsAuthenticated(true);

      // ✅ Solo limpiamos errores y marcamos registro exitoso
      setErrors([]);
      setRegistrationSuccess(true);

      // Retornamos true para indicar éxito
      return true;
    } catch (error) {
      console.log("Error en signup:", error);
      if (error.response && error.response.data) {
        // Si es un array de errores
        if (Array.isArray(error.response.data)) {
          setErrors(error.response.data);
        } else if (error.response.data.message) {
          // Si es un objeto con mensaje
          setErrors([error.response.data.message]);
        } else {
          setErrors(["Error en el registro"]);
        }
      } else {
        setErrors(["Error de conexión"]);
      }
      return false; // Retornamos false si hay error
    }
  };

  const signin = async (user) => {
    try {
      const res = await loginRequest(user);
      console.log("Respuesta del login:", res.data);
      setIsAuthenticated(true);
      setUser(res.data);
      setErrors([]);
    } catch (error) {
      console.log("Error en signin:", error);
      if (error.response && error.response.data) {
        if (error.response.data.message) {
          setErrors([error.response.data.message]);
        } else {
          setErrors(["Error en el login"]);
        }
      } else {
        setErrors(["Error de conexión"]);
      }
    }
  };

  const logout = async () => {
    try {
      // Llamar al backend para eliminar la cookie httpOnly
      await logoutRequest();
    } catch (error) {
      console.log("Error al cerrar sesión:", error);
    } finally {
      // Limpiar estado local
      Cookies.remove("token");
      setIsAuthenticated(false);
      setUser(null);
      setErrors([]);
    }
  };

  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => {
        setErrors([]);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  useEffect(() => {
    async function checkLogin() {
      try {
        // No verificamos si existe la cookie desde JS porque puede ser httpOnly
        // Llamamos directo al backend que verifica desde req.cookies
        const res = await verifyTokenRequest();

        if (!res.data) {
          setIsAuthenticated(false);
          setLoading(false);
          setUser(null);
          return;
        }

        setIsAuthenticated(true);
        setUser(res.data);
        setLoading(false);
      } catch (error) {
        console.log("No hay sesión activa o token inválido");
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
      }
    }
    checkLogin();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signup,
        signin,
        logout,
        loading,
        user,
        isAuthenticated,
        errors,
        registrationSuccess, // 🆕 Exportar el nuevo estado
        setRegistrationSuccess, // 🆕 Exportar setter para limpiar después
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
