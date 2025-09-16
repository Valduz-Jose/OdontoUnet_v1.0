import { useForm } from "react-hook-form";
import { useAuth } from "../context/Auth.Context";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  UserPlus,
  AlertCircle,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  FileText,
  Key,
  ChevronDown,
  ChevronUp,
  Shield,
  Info,
} from "lucide-react";

function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { signup, isAuthenticated, errors: registerErrors, user } = useAuth();
  const navigate = useNavigate();
  const [showProfileFields, setShowProfileFields] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      if (user.role === "admin") {
        navigate("/");
      } else {
        navigate("/patients");
      }
    }
  }, [isAuthenticated]);

  const onsubmit = handleSubmit(async (values) => {
    signup(values);
  });

  return (
    <div className="min-h-screen bg-pastel-mint flex items-center justify-center p-6">
      <div className="card-pastel max-w-2xl w-full p-8">
        {/* Errores de registro */}
        {registerErrors.map((error, i) => (
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
            Registro de Doctor
          </h1>
          <p className="text-pastel-secondary">
            Únete al sistema odontológico UNET
          </p>
        </div>

        <form onSubmit={onsubmit} className="space-y-6">
          {/* Información de autenticación */}
          <div className="bg-pastel-blue p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-pastel-primary mb-4 flex items-center gap-2">
              <Shield size={20} />
              Información de Acceso
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center text-sm font-medium mb-2 text-pastel-primary">
                  <User className="mr-2" size={16} />
                  Nombre de Usuario
                </label>
                <input
                  type="text"
                  {...register("username", { required: true })}
                  className="input-pastel w-full p-3"
                  placeholder="Ej: dr.rodriguez"
                />
                {errors.username && (
                  <p className="text-red-600 text-sm mt-1">
                    El nombre de usuario es obligatorio
                  </p>
                )}
              </div>

              <div>
                <label className="flex items-center text-sm font-medium mb-2 text-pastel-primary">
                  <Mail className="mr-2" size={16} />
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  {...register("email", { required: true })}
                  className="input-pastel w-full p-3"
                  placeholder="tu@unet.edu.ve"
                />
                {errors.email && (
                  <p className="text-red-600 text-sm mt-1">
                    El email es obligatorio
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="flex items-center text-sm font-medium mb-2 text-pastel-primary">
                  <Lock className="mr-2" size={16} />
                  Contraseña
                </label>
                <input
                  type="password"
                  {...register("password", { required: true })}
                  className="input-pastel w-full p-3"
                  placeholder="Mínimo 6 caracteres"
                />
                {errors.password && (
                  <p className="text-red-600 text-sm mt-1">
                    La contraseña es obligatoria
                  </p>
                )}
              </div>

              <div>
                <label className="flex items-center text-sm font-medium mb-2 text-pastel-primary">
                  <Key className="mr-2" size={16} />
                  Clave Especial de Doctor
                </label>
                <input
                  type="password"
                  {...register("doctorKey", { required: true })}
                  className="input-pastel w-full p-3"
                  placeholder="Clave proporcionada por administración"
                />
                {errors.doctorKey && (
                  <p className="text-red-600 text-sm mt-1">
                    La clave especial es obligatoria
                  </p>
                )}
              </div>
            </div>

            {/* Información sobre la clave especial */}
            <div className="mt-4 p-3 bg-pastel-yellow rounded-lg flex items-start gap-3">
              <Info
                size={16}
                className="text-yellow-600 flex-shrink-0 mt-0.5"
              />
              <div className="text-sm text-yellow-800">
                <p>
                  <strong>¿No tienes la clave especial?</strong>
                </p>
                <p>
                  Solicítala a la administración del sistema odontológico UNET.
                  Esta clave es necesaria para verificar que eres personal
                  autorizado.
                </p>
              </div>
            </div>
          </div>

          {/* Campos del perfil profesional (opcionales pero recomendados) */}
          <div className="bg-pastel-green p-6 rounded-lg">
            <button
              type="button"
              onClick={() => setShowProfileFields(!showProfileFields)}
              className="flex items-center justify-between w-full text-lg font-semibold text-pastel-primary mb-4 hover:text-green-600 transition-colors"
            >
              <span className="flex items-center gap-2">
                <User size={20} />
                Información Profesional (Opcional)
              </span>
              {showProfileFields ? (
                <ChevronUp size={20} />
              ) : (
                <ChevronDown size={20} />
              )}
            </button>

            <p className="text-sm text-pastel-secondary mb-4">
              Completa esta información para que aparezca en la página principal
              y tu perfil esté completo desde el inicio.
            </p>

            {showProfileFields && (
              <div className="space-y-4 border-t border-green-200 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center text-sm font-medium mb-2 text-pastel-primary">
                      <Phone className="mr-2" size={16} />
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      {...register("telefono")}
                      className="input-pastel w-full p-3"
                      placeholder="+58 414 123 4567"
                    />
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-medium mb-2 text-pastel-primary">
                      <MapPin className="mr-2" size={16} />
                      Dirección
                    </label>
                    <input
                      type="text"
                      {...register("direccion")}
                      className="input-pastel w-full p-3"
                      placeholder="Tu dirección"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center text-sm font-medium mb-2 text-pastel-primary">
                      <Calendar className="mr-2" size={16} />
                      Fecha de Nacimiento
                    </label>
                    <input
                      type="date"
                      {...register("fechaNacimiento")}
                      className="input-pastel w-full p-3"
                    />
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-medium mb-2 text-pastel-primary">
                      <Briefcase className="mr-2" size={16} />
                      Especialidad
                    </label>
                    <select
                      {...register("especialidad")}
                      className="input-pastel w-full p-3"
                    >
                      <option value="">Seleccionar especialidad</option>
                      <option value="Odontología General">
                        Odontología General
                      </option>
                      <option value="Ortodoncia">Ortodoncia</option>
                      <option value="Endodoncia">Endodoncia</option>
                      <option value="Periodoncia">Periodoncia</option>
                      <option value="Odontopediatría">Odontopediatría</option>
                      <option value="Cirugía Oral">Cirugía Oral</option>
                      <option value="Prostodoncia">Prostodoncia</option>
                      <option value="Patología Oral">Patología Oral</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="flex items-center text-sm font-medium mb-2 text-pastel-primary">
                    <Briefcase className="mr-2" size={16} />
                    Número de Licencia
                  </label>
                  <input
                    type="text"
                    {...register("numeroLicencia")}
                    className="input-pastel w-full p-3"
                    placeholder="Número de licencia profesional"
                  />
                </div>

                <div>
                  <label className="flex items-center text-sm font-medium mb-2 text-pastel-primary">
                    <FileText className="mr-2" size={16} />
                    Biografía Profesional
                  </label>
                  <textarea
                    {...register("biografia")}
                    className="input-pastel w-full p-3"
                    rows="4"
                    placeholder="Describe tu experiencia, especialidades y enfoque profesional..."
                  />
                  <p className="text-xs text-pastel-muted mt-1">
                    Esta información será visible en la página principal para
                    los visitantes
                  </p>
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="btn-pastel-primary w-full px-6 py-4 rounded-lg font-semibold transition-pastel flex items-center justify-center gap-2"
          >
            <UserPlus size={18} />
            Crear Cuenta de Doctor
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-pastel-secondary">
            ¿Ya tienes una cuenta?{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Inicia sesión aquí
            </Link>
          </p>
        </div>

        {/* Información del registro */}
        <div className="mt-8 p-4 bg-pastel-purple rounded-lg">
          <h3 className="font-semibold text-pastel-primary mb-2">
            🏥 Información importante
          </h3>
          <ul className="text-sm text-pastel-secondary space-y-1">
            <li>
              • <strong>Clave especial:</strong> Solo personal autorizado puede
              registrarse
            </li>
            <li>
              • <strong>Perfil profesional:</strong> Puedes completarlo ahora o
              editarlo después
            </li>
            <li>
              • <strong>Acceso completo:</strong> Podrás gestionar pacientes,
              citas e inventario
            </li>
            <li>
              • <strong>Privacidad:</strong> Tu información está protegida según
              políticas UNET
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
