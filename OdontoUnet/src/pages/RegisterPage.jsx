import { useForm } from "react-hook-form";
import { useAuth } from "../context/Auth.Context";
import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock, UserPlus, AlertCircle } from "lucide-react";

function RegisterPage() {
  const {register, handleSubmit, formState:{errors}} = useForm()
  const {signup, isAuthenticated, errors: registerErrors, user} = useAuth()
  const navigate = useNavigate()

  useEffect(()=>{
    if (isAuthenticated) {
      if(user.role === "admin"){
        navigate("/");
      } else {
        navigate("/patients");
      }
    }
  },[isAuthenticated])

  const onsubmit = handleSubmit(async (values)=>{
    signup(values);    
  })

  return (
    <div className="min-h-screen bg-pastel-mint flex items-center justify-center p-6">
      <div className="card-pastel max-w-md w-full p-8">
        
        {/* Errores de registro */}
        {registerErrors.map((error,i)=>(
          <div key={i} className="bg-pastel-pink border border-red-300 p-4 rounded-lg mb-4 flex items-center gap-3">
            <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
            <span className="text-red-700">{error}</span>
          </div>
        ))}

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-pastel-primary mb-2">Crear Cuenta</h1>
          <p className="text-pastel-secondary">Únete al sistema odontológico UNET</p>
        </div>

        <form onSubmit={onsubmit} className="space-y-6">
          <div>
            <label className="flex items-center text-sm font-medium mb-2 text-pastel-primary">
              <User className="mr-2" size={16} />
              Nombre de Usuario
            </label>
            <input 
              type="text" 
              {...register("username",{required:true})} 
              className="input-pastel w-full p-4"
              placeholder="Ej: dr.rodriguez"
            />
            {errors.username && (
              <p className="text-red-600 text-sm mt-1">El nombre de usuario es obligatorio</p>
            )}
          </div>

          <div>
            <label className="flex items-center text-sm font-medium mb-2 text-pastel-primary">
              <Mail className="mr-2" size={16} />
              Correo Electrónico
            </label>
            <input 
              type="email" 
              {...register("email",{required:true})} 
              className="input-pastel w-full p-4"
              placeholder="tu@email.com"
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">El email es obligatorio</p>
            )}
          </div>

          <div>
            <label className="flex items-center text-sm font-medium mb-2 text-pastel-primary">
              <Lock className="mr-2" size={16} />
              Contraseña
            </label>
            <input 
              type="password" 
              {...register("password",{required:true})} 
              className="input-pastel w-full p-4"
              placeholder="Mínimo 6 caracteres"
            />
            {errors.password && (
              <p className="text-red-600 text-sm mt-1">La contraseña es obligatoria</p>
            )}
          </div>

          <button
            type="submit"
            className="btn-pastel-primary w-full px-6 py-4 rounded-lg font-semibold transition-pastel flex items-center justify-center gap-2"
          >
            <UserPlus size={18} />
            Crear Cuenta
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-pastel-secondary">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
              Inicia sesión aquí
            </Link>
          </p>
        </div>

        {/* Información del registro */}
        <div className="mt-8 p-4 bg-pastel-green rounded-lg">
          <h3 className="font-semibold text-pastel-primary mb-2">📝 Información importante</h3>
          <ul className="text-sm text-pastel-secondary space-y-1">
            <li>• Tu cuenta será de tipo "Odontólogo" por defecto</li>
            <li>• Podrás gestionar pacientes y crear citas</li>
            <li>• Recuerda completar tu perfil después del registro</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage