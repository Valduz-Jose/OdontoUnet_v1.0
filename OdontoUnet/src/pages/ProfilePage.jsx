import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/Auth.Context';
import { Camera, User, Mail, Phone, MapPin, Calendar, Briefcase, Save, AlertCircle } from 'lucide-react';

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
        setSuccessMessage('✅ Perfil actualizado correctamente');
        
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
        <div className="text-pastel-primary">Cargando perfil...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pastel-mint p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-pastel-primary">Mi Perfil</h1>
        
        {/* Mensajes de estado */}
        {errors.general && (
          <div className="mb-6 card-pastel bg-pastel-pink border-red-300 p-4 rounded-lg flex items-center gap-3">
            <AlertCircle className="text-red-600" size={20} />
            <span className="text-red-700">{errors.general}</span>
          </div>
        )}
        
        {successMessage && (
          <div className="mb-6 card-pastel bg-pastel-green border-green-300 p-4 rounded-lg">
            <span className="text-green-700">{successMessage}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sección de foto */}
          <div className="lg:col-span-1">
            <div className="card-pastel p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center text-pastel-primary">
                <Camera className="mr-2" size={20} />
                Foto de Perfil
              </h2>
              
              <div className="text-center">
                <div className="relative inline-block">
                  <div className="w-48 h-48 mx-auto bg-pastel-blue rounded-full overflow-hidden border-4 border-pastel-mint-dark">
                    {preview ? (
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User size={80} className="text-pastel-muted" />
                      </div>
                    )}
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-2 right-2 btn-pastel-primary p-3 rounded-full transition-pastel"
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
            <div className="card-pastel p-6 mt-6 bg-pastel-blue">
              <h3 className="text-lg font-semibold mb-4 text-pastel-primary">Información del Sistema</h3>
              <div className="space-y-3 text-sm text-pastel-secondary">
                <p><strong>Usuario:</strong> {user?.username}</p>
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>Rol:</strong> {user?.role === 'admin' ? 'Administrador' : 'Odontólogo'}</p>
                <p><strong>Miembro desde:</strong> {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Formulario de datos */}
          <div className="lg:col-span-2">
            <div className="card-pastel p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center text-pastel-primary">
                <User className="mr-2" size={20} />
                Información Personal
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                <div className="md:col-span-2">
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

                {user?.role === 'odontologo' && (
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
                )}

                <div className="md:col-span-2">
                  <label className="flex items-center text-sm font-medium mb-2 text-pastel-primary">
                    <User className="mr-2" size={16} />
                    Biografía / Descripción
                  </label>
                  <textarea
                    name="biografia"
                    value={profileData.biografia}
                    onChange={handleInputChange}
                    rows="4"
                    className="input-pastel w-full p-3"
                    placeholder="Cuéntanos sobre ti, tu experiencia y especialidades..."
                  />
                </div>
              </div>

              <div className="flex justify-end mt-8">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-pastel-primary px-8 py-3 rounded-lg font-semibold transition-pastel flex items-center gap-2 disabled:opacity-50"
                >
                  <Save size={18} />
                  {loading ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProfilePage;