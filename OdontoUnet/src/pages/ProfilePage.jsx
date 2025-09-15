import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/Auth.Context';
import { Camera, User, Mail, Phone, MapPin, Calendar, Briefcase, Save, AlertCircle, CheckCircle, Shield, Clock } from 'lucide-react';

function ProfilePage() {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    telefono: '',
    direccion: '',
    fechaNacimiento: '',
    especialidad: '',
    numeroLicencia: '',
    biografia: '',
    foto: null
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setInitialLoad(true);
      const response = await fetch('http://localhost:3000/api/profile', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Datos cargados del perfil:', data);
        
        // Actualizar estado con datos del servidor
        setProfileData(prev => ({
          username: user?.username || '',
          email: user?.email || '',
          telefono: data.telefono || '',
          direccion: data.direccion || '',
          fechaNacimiento: data.fechaNacimiento ? data.fechaNacimiento.split('T')[0] : '',
          especialidad: data.especialidad || '',
          numeroLicencia: data.numeroLicencia || '',
          biografia: data.biografia || '',
          foto: null // Solo para nuevas subidas
        }));

        // Configurar preview de imagen existente
        if (data.foto) {
          setPreview(`http://localhost:3000/uploads/profiles/${data.foto}`);
        }
      } else {
        console.log('No se encontró perfil existente, usando valores por defecto');
      }
    } catch (error) {
      console.error('Error al cargar perfil:', error);
      setErrors({ general: 'Error al cargar el perfil' });
    } finally {
      setInitialLoad(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
    // Limpiar error específico del campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tamaño (5MB máximo)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, foto: 'La imagen no debe superar los 5MB' }));
        return;
      }

      // Validar tipo
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, foto: 'Solo se permiten archivos JPG, PNG o WebP' }));
        return;
      }

      setProfileData(prev => ({ ...prev, foto: file }));
      setErrors(prev => ({ ...prev, foto: '' }));
      
      // Crear preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (profileData.telefono && !/^[\d\s\+\-\(\)]+$/.test(profileData.telefono)) {
      newErrors.telefono = 'Formato de teléfono inválido';
    }

    if (profileData.email && !/\S+@\S+\.\S+/.test(profileData.email)) {
      newErrors.email = 'Formato de email inválido';
    }

    if (profileData.fechaNacimiento) {
      const birthDate = new Date(profileData.fechaNacimiento);
      const today = new Date();
      if (birthDate > today) {
        newErrors.fechaNacimiento = 'La fecha de nacimiento no puede ser futura';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});
    setSuccessMessage('');

    try {
      const formData = new FormData();
      
      // Agregar todos los campos de texto
      Object.keys(profileData).forEach(key => {
        if (key !== 'foto' && profileData[key]) {
          formData.append(key, profileData[key]);
        }
      });
      
      // Agregar foto si se seleccionó una nueva
      if (profileData.foto && typeof profileData.foto === 'object') {
        formData.append('foto', profileData.foto);
      }

      console.log('Enviando datos del perfil...');
      
      const response = await fetch('http://localhost:3000/api/profile', {
        method: 'PUT',
        credentials: 'include',
        body: formData
      });

      const result = await response.json();

      if (response.ok) {
        console.log('Perfil actualizado correctamente:', result);
        setSuccessMessage('Perfil actualizado correctamente');
        
        // Recargar datos del perfil para confirmar la actualización
        setTimeout(() => {
          loadProfile();
        }, 1000);
      } else {
        setErrors({ general: result.message || 'Error al actualizar el perfil' });
      }
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      setErrors({ general: 'Error de conexión al actualizar el perfil' });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoad) {
    return (
      <div className="min-h-screen bg-pastel-mint p-6 flex items-center justify-center">
        <div className="card-pastel p-8 bg-pastel-blue text-center">
          <User className="animate-pulse mx-auto mb-4 text-pastel-primary" size={48} />
          <p className="text-pastel-primary">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pastel-mint p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-pastel-primary mb-2 flex items-center gap-3">
            <User className="text-blue-600" size={36} />
            Mi Perfil Profesional
          </h1>
          <p className="text-pastel-secondary">
            Administra tu información personal y profesional
          </p>
        </div>
        
        {/* Mensajes de estado */}
        {errors.general && (
          <div className="mb-6 card-pastel bg-pastel-pink border-red-300 p-4 rounded-lg flex items-center gap-3">
            <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
            <span className="text-red-700">{errors.general}</span>
          </div>
        )}
        
        {successMessage && (
          <div className="mb-6 card-pastel bg-pastel-green border-green-300 p-4 rounded-lg flex items-center gap-3">
            <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
            <span className="text-green-700">{successMessage}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sección de foto y info del sistema */}
          <div className="lg:col-span-1 space-y-6">
            {/* Foto de perfil */}
            <div className="card-pastel p-6 bg-pastel-purple">
              <h2 className="text-xl font-semibold mb-4 flex items-center text-pastel-primary">
                <Camera className="mr-2" size={20} />
                Foto de Perfil
              </h2>
              
              <div className="text-center">
                <div className="relative inline-block">
                  <div className="w-48 h-48 mx-auto bg-pastel-blue rounded-full overflow-hidden border-4 border-pastel-mint-dark shadow-lg">
                    {preview ? (
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pastel-blue to-pastel-purple">
                        <User size={80} className="text-pastel-muted" />
                      </div>
                    )}
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-2 right-2 btn-pastel-primary p-3 rounded-full transition-pastel shadow-lg"
                    title="Cambiar foto de perfil"
                  >
                    <Camera size={20} />
                  </button>
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                
                {errors.foto && (
                  <p className="text-red-600 text-sm mt-2">{errors.foto}</p>
                )}
                
                <p className="text-pastel-muted text-sm mt-4">
                  Haz clic en el ícono de cámara para cambiar tu foto
                  <br />
                  <span className="text-xs">Máximo 5MB - JPG, PNG, WebP</span>
                </p>
              </div>
            </div>
            
            {/* Información básica del sistema */}
            <div className="card-pastel p-6 bg-pastel-yellow">
              <h3 className="text-lg font-semibold mb-4 text-pastel-primary flex items-center gap-2">
                <Shield size={20} />
                Información del Sistema
              </h3>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg border border-pastel-mint-dark">
                  <div className="space-y-3 text-sm text-pastel-secondary">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Usuario:</span>
                      <span className="bg-pastel-blue px-3 py-1 rounded-full text-blue-700">{user?.username}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Email:</span>
                      <span className="text-xs bg-pastel-green px-2 py-1 rounded">{user?.email}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Rol:</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user?.role === 'admin' 
                          ? 'bg-pastel-purple text-purple-700' 
                          : 'bg-pastel-mint text-green-700'
                      }`}>
                        {user?.role === 'admin' ? 'Administrador' : 'Odontólogo'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Miembro desde:</span>
                      <span className="flex items-center gap-1 text-xs">
                        <Clock size={12} />
                        {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('es-ES') : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Formulario de datos */}
          <div className="lg:col-span-2">
            <div className="card-pastel p-6 bg-pastel-blue">
              <h2 className="text-xl font-semibold mb-6 flex items-center text-pastel-primary">
                <User className="mr-2" size={20} />
                Información Personal y Profesional
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Información de contacto */}
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-pastel-primary border-b border-pastel-mint-dark pb-2">
                    📞 Contacto
                  </h3>
                  
                  <div>
                    <label className="flex items-center text-sm font-medium mb-2 text-pastel-primary">
                      <Phone className="mr-2" size={16} />
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      name="telefono"
                      value={profileData.telefono}
                      onChange={handleInputChange}
                      className="input-pastel w-full p-3"
                      placeholder="Ej: +58 414 123 4567"
                    />
                    {errors.telefono && (
                      <p className="text-red-600 text-sm mt-1">{errors.telefono}</p>
                    )}
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-medium mb-2 text-pastel-primary">
                      <MapPin className="mr-2" size={16} />
                      Dirección
                    </label>
                    <input
                      type="text"
                      name="direccion"
                      value={profileData.direccion}
                      onChange={handleInputChange}
                      className="input-pastel w-full p-3"
                      placeholder="Tu dirección completa"
                    />
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-medium mb-2 text-pastel-primary">
                      <Calendar className="mr-2" size={16} />
                      Fecha de Nacimiento
                    </label>
                    <input
                      type="date"
                      name="fechaNacimiento"
                      value={profileData.fechaNacimiento}
                      onChange={handleInputChange}
                      className="input-pastel w-full p-3"
                    />
                    {errors.fechaNacimiento && (
                      <p className="text-red-600 text-sm mt-1">{errors.fechaNacimiento}</p>
                    )}
                  </div>
                </div>

                {/* Información profesional */}
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-pastel-primary border-b border-pastel-mint-dark pb-2">
                    🩺 Información Profesional
                  </h3>

                  {user?.role === 'odontologo' ? (
                    <>
                      <div>
                        <label className="flex items-center text-sm font-medium mb-2 text-pastel-primary">
                          <Briefcase className="mr-2" size={16} />
                          Especialidad
                        </label>
                        <select
                          name="especialidad"
                          value={profileData.especialidad}
                          onChange={handleInputChange}
                          className="input-pastel w-full p-3"
                        >
                          <option value="">Seleccionar especialidad</option>
                          <option value="Odontología General">Odontología General</option>
                          <option value="Ortodoncia">Ortodoncia</option>
                          <option value="Endodoncia">Endodoncia</option>
                          <option value="Periodoncia">Periodoncia</option>
                          <option value="Odontopediatría">Odontopediatría</option>
                          <option value="Cirugía Oral">Cirugía Oral</option>
                          <option value="Prostodoncia">Prostodoncia</option>
                          <option value="Patología Oral">Patología Oral</option>
                        </select>
                      </div>

                      <div>
                        <label className="flex items-center text-sm font-medium mb-2 text-pastel-primary">
                          <Briefcase className="mr-2" size={16} />
                          Número de Licencia
                        </label>
                        <input
                          type="text"
                          name="numeroLicencia"
                          value={profileData.numeroLicencia}
                          onChange={handleInputChange}
                          className="input-pastel w-full p-3"
                          placeholder="Número de licencia profesional"
                        />
                      </div>
                    </>
                  ) : (
                    <div className="card-pastel p-4 bg-pastel-green text-center">
                      <Shield className="mx-auto mb-2 text-green-600" size={24} />
                      <p className="text-green-700 text-sm">
                        Como administrador, puedes gestionar el sistema completo
                      </p>
                    </div>
                  )}
                </div>

                {/* Biografía */}
                <div className="md:col-span-2">
                  <h3 className="text-lg font-medium text-pastel-primary border-b border-pastel-mint-dark pb-2 mb-4">
                    ✍️ Biografía Profesional
                  </h3>
                  <div>
                    <label className="flex items-center text-sm font-medium mb-2 text-pastel-primary">
                      <User className="mr-2" size={16} />
                      Descripción / Biografía
                    </label>
                    <textarea
                      name="biografia"
                      value={profileData.biografia}
                      onChange={handleInputChange}
                      rows="5"
                      className="input-pastel w-full p-3"
                      placeholder="Cuéntanos sobre ti, tu experiencia, especialidades y enfoque profesional..."
                    />
                    <p className="text-xs text-pastel-muted mt-1">
                      Esta información será visible en la página principal para los visitantes
                    </p>
                  </div>
                </div>
              </div>

              {/* Botón de guardar */}
              <div className="flex justify-end mt-8 pt-6 border-t border-pastel-mint-dark">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-pastel-primary px-8 py-4 rounded-lg font-semibold transition-pastel flex items-center gap-3 disabled:opacity-50 text-lg"
                >
                  <Save size={20} />
                  {loading ? 'Guardando cambios...' : 'Guardar Cambios'}
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Información adicional */}
        <div className="mt-8 card-pastel p-6 bg-pastel-green">
          <h3 className="text-lg font-semibold text-pastel-primary mb-4 flex items-center gap-2">
            💡 Consejos para tu Perfil
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-pastel-secondary">
            <ul className="space-y-2">
              <li>• <strong>Foto profesional:</strong> Una buena foto aumenta la confianza de los pacientes</li>
              <li>• <strong>Información completa:</strong> Completa todos los campos para un perfil más profesional</li>
              <li>• <strong>Biografía detallada:</strong> Describe tu experiencia y especialidades</li>
            </ul>
            <ul className="space-y-2">
              <li>• <strong>Datos actualizados:</strong> Mantén tu información de contacto actualizada</li>
              <li>• <strong>Especialización:</strong> Especifica tu área de expertise principal</li>
              <li>• <strong>Privacidad:</strong> Tu información está protegida y es confidencial</li>
            </ul>
          </div>
        </div>

        {/* Estadísticas del perfil */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card-pastel p-4 bg-pastel-purple text-center">
            <div className="text-2xl mb-2">📝</div>
            <p className="text-sm text-pastel-secondary">Completitud del perfil</p>
            <p className="text-lg font-bold text-purple-700">
              {Math.round((Object.values(profileData).filter(val => val && val !== '').length / Object.keys(profileData).length) * 100)}%
            </p>
          </div>
          
          <div className="card-pastel p-4 bg-pastel-blue text-center">
            <div className="text-2xl mb-2">🔒</div>
            <p className="text-sm text-pastel-secondary">Seguridad</p>
            <p className="text-lg font-bold text-blue-700">Protegido</p>
          </div>
          
          <div className="card-pastel p-4 bg-pastel-yellow text-center">
            <div className="text-2xl mb-2">👥</div>
            <p className="text-sm text-pastel-secondary">Visibilidad</p>
            <p className="text-lg font-bold text-yellow-700">Pública</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;