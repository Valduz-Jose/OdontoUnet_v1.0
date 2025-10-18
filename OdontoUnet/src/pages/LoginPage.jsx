import { useForm } from "react-hook-form";
import { useAuth } from "../context/Auth.Context";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Mail, Lock, LogIn, AlertCircle, CheckCircle } from "lucide-react";

function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const {
    signin,
    errors: signinErrors,
    isAuthenticated,
    user,
    setRegistrationSuccess,
  } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [successMessage, setSuccessMessage] = useState("");

  // 🆕 Capturar mensaje de éxito del registro
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Limpiar el estado de registrationSuccess en el contexto
      if (setRegistrationSuccess) {
        setRegistrationSuccess(false);
      }
      // Limpiar el mensaje después de 10 segundos
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [location, setRegistrationSuccess]);

  const onsubmit = handleSubmit((data) => {
    signin(data);
  });

  useEffect(() => {
    if (isAuthenticated) {
      if (user.role === "admin") {
        navigate("/");
      } else {
        navigate("/patients");
      }
    }
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen bg-pastel-mint flex items-center justify-center p-6">
      <div className="card-pastel max-w-md w-full p-8">
        {/* 🆕 Mensaje de éxito del registro */}
        {successMessage && (
          <div className="bg-green-50 border border-green-300 p-4 rounded-lg mb-4 flex items-center gap-3">
            <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
            <span className="text-green-700">{successMessage}</span>
          </div>
        )}

        {/* Errores de autenticación */}
        {signinErrors.map((error, i) => (
          <div
            key={i}
            className="bg-pastel-pink border border-red-300 p-4 rounded-lg mb-4 flex items-center gap-3"
          >
            <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
            <span className="text-red-700">{error}</span>
          </div>
        ))}

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-pastel-primary mb-2">
            Iniciar Sesión
          </h1>
          <p className="text-pastel-secondary">
            Accede a tu cuenta del sistema odontológico
          </p>
        </div>

        <form onSubmit={onsubmit} className="space-y-6">
          <div>
            <label className="flex items-center text-sm font-medium mb-2 text-pastel-primary">
              <Mail className="mr-2" size={16} />
              Correo Electrónico
            </label>
            <input
              type="email"
              {...register("email", { required: true })}
              className="input-pastel w-full p-4"
              placeholder="tu@email.com"
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">
                El email es obligatorio
              </p>
            )}
          </div>

          <div>
            <label className="flex items-center text-sm font-medium mb-2 text-pastel-primary">
              <Lock className="mr-2" size={16} />
              Contraseña
            </label>
            <input
              type="password"
              {...register("password", { required: true })}
              className="input-pastel w-full p-4"
              placeholder="Tu contraseña"
            />
            {errors.password && (
              <p className="text-red-600 text-sm mt-1">
                La contraseña es obligatoria
              </p>
            )}
          </div>

          <button
            type="submit"
            className="btn-pastel-primary w-full px-6 py-4 rounded-lg font-semibold transition-pastel flex items-center justify-center gap-2"
          >
            <LogIn size={18} />
            Iniciar Sesión
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-pastel-secondary">
            ¿No tienes una cuenta?{" "}
            <Link
              to="/register"
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Regístrate aquí
            </Link>
          </p>
        </div>

        {/* Información adicional */}
        <div className="mt-8 p-4 bg-pastel-blue rounded-lg">
          <h3 className="font-semibold text-pastel-primary mb-2">
            Sistema Odontológico UNET
          </h3>
          <p className="text-sm text-pastel-secondary">
            Plataforma integral para la gestión de pacientes, citas e
            historiales clínicos.
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
