import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/Auth.Context';
import { Camera, User, Mail, Phone, MapPin, Calendar, Briefcase } from 'lucide-react';

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
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Cargar datos del perfil del backend
    const loadProfile = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/profile', {
          credentials: 'include'
        });
        if (response.ok) {
          const data = await response.json();
          setProfileData(prev => ({ ...prev, ...data }));
          if (data.foto) {
            setPreview(`http://localhost:3000/uploads/profiles/${data.foto}`);
          }
        }
      } catch (error) {
        console.error('Error al cargar perfil:', error);
      }
    };
    loadProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileData(prev => ({ ...prev, foto: file }));
      
      // Crear preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      Object.keys(profileData).forEach(key => {
        if (profileData[key] && key !== 'foto') {
          formData.append(key, profileData[key]);
        }
      });
      
      if (profileData.foto && typeof profileData.foto === 'object') {
        formData.append('foto', profileData.foto);
      }

      const response = await fetch('http://localhost:3000/api/profile', {
        method: 'PUT',
        credentials: 'include',
        body: formData
      });

      if (response.ok) {
        alert('Perfil actualizado correctamente');
      } else {
        const error = await response.json();
        alert('Error: ' + (error.message || 'No se pudo actualizar el perfil'));
      }
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      alert('Error al actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#202020] text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-blue-500">Mi Perfil</h1>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sección de foto */}
          <div className="lg:col-span-1">
            <div className="bg-zinc-900 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Camera className="mr-2" size={20} />
                Foto de Perfil
              </h2>
              
              <div className="text-center">
                <div className="relative inline-block">
                  <div className="w-48 h-48 mx-auto bg-zinc-800 rounded-full overflow-hidden border-4 border-blue-500">
                    {preview ? (
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User size={80} className="text-gray-500" />
                      </div>
                    )}
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-2 right-2 bg-blue-600 hover:bg-blue-700 p-3 rounded-full transition-colors"
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
                
                <p className="text-gray-400 text-sm mt-4">
                  Haz clic en el ícono de cámara para cambiar tu foto
                </p>
              </div>
            </div>
            
            {/* Información básica */}
            <div className="bg-zinc-900 p-6 rounded-lg mt-6">
              <h3 className="text-lg font-semibold mb-4">Información del Sistema</h3>
              <div className="space-y-3 text-sm">
                <p><strong>Usuario:</strong> {user?.username}</p>
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>Rol:</strong> {user?.role === 'admin' ? 'Administrador' : 'Odontólogo'}</p>
                <p><strong>Miembro desde:</strong> {new Date(user?.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Formulario de datos */}
          <div className="lg:col-span-2">
            <div className="bg-zinc-900 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <User className="mr-2" size={20} />
                Información Personal
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center text-sm font-medium mb-2">
                    <Phone className="mr-2" size={16} />
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    name="telefono"
                    value={profileData.telefono}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-zinc-800 border border-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: +58 414 123 4567"
                  />
                </div>

                <div>
                  <label className="flex items-center text-sm font-medium mb-2">
                    <Calendar className="mr-2" size={16} />
                    Fecha de Nacimiento
                  </label>
                  <input
                    type="date"
                    name="fechaNacimiento"
                    value={profileData.fechaNacimiento}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-zinc-800 border border-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center text-sm font-medium mb-2">
                    <MapPin className="mr-2" size={16} />
                    Dirección
                  </label>
                  <input
                    type="text"
                    name="direccion"
                    value={profileData.direccion}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-zinc-800 border border-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Tu dirección completa"
                  />
                </div>

                {user?.role === 'odontologo' && (
                  <>
                    <div>
                      <label className="flex items-center text-sm font-medium mb-2">
                        <Briefcase className="mr-2" size={16} />
                        Especialidad
                      </label>
                      <select
                        name="especialidad"
                        value={profileData.especialidad}
                        onChange={handleInputChange}
                        className="w-full p-3 bg-zinc-800 border border-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      <label className="flex items-center text-sm font-medium mb-2">
                        <Briefcase className="mr-2" size={16} />
                        Número de Licencia
                      </label>
                      <input
                        type="text"
                        name="numeroLicencia"
                        value={profileData.numeroLicencia}
                        onChange={handleInputChange}
                        className="w-full p-3 bg-zinc-800 border border-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Número de licencia profesional"
                      />
                    </div>
                  </>
                )}

                <div className="md:col-span-2">
                  <label className="flex items-center text-sm font-medium mb-2">
                    <User className="mr-2" size={16} />
                    Biografía / Descripción
                  </label>
                  <textarea
                    name="biografia"
                    value={profileData.biografia}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full p-3 bg-zinc-800 border border-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Cuéntanos sobre ti, tu experiencia y especialidades..."
                  />
                </div>
              </div>

              <div className="flex justify-end mt-8">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
                >
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