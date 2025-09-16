import { createContext, useContext, useState, useEffect } from "react";
import { registerRequest, loginRequest, verifyTokenRequest } from "../api/auth";
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

  const signup = async (user) => {
    try {
      const res = await registerRequest(user);
      console.log("Respuesta del registro:", res.data);
      setUser(res.data);
      setIsAuthenticated(true);
      setErrors([]);
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

  const logout = () => {
    Cookies.remove("token");
    setIsAuthenticated(false);
    setUser(null);
    setErrors([]);
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
      const cookies = Cookies.get();
      if (!cookies.token) {
        setIsAuthenticated(false);
        setLoading(false);
        return setUser(null);
      }

      try {
        const res = await verifyTokenRequest(cookies.token);
        if (!res.data) {
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }
        setIsAuthenticated(true);
        setUser(res.data);
        setLoading(false);
      } catch (error) {
        console.log("Error verificando token:", error);
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
        Cookies.remove("token");
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
