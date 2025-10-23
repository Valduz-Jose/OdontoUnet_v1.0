import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/Auth.Context";
import {
  Camera,
  User,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  Save,
  AlertCircle,
  CheckCircle,
  Shield,
  Clock,
  Edit,
  Mail,
} from "lucide-react";
import { handleTimeChange, validateTimeRange } from "../utils/timeHelpers";
import { DIAS_SEMANA_VALUES, SPECIALTIES } from "../utils/constants";
import { API_BASE_URL, getImageUrl } from "../api/config";

function ProfilePage() {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    telefono: "",
    direccion: "",
    fechaNacimiento: "",
    especialidad: "",
    numeroLicencia: "",
    biografia: "",
    foto: null,
    diasTrabajo: [],
    horarioInicio: "8:00",
    horarioFin: "17:00",
  });
  const [originalData, setOriginalData] = useState({});
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [editMode, setEditMode] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(`${API_BASE_URL}/api/profile`, {
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          // Asegurarse de que los valores de fecha y hora estén en el formato correcto para los inputs
          const formattedData = {
            ...data,
            // Aquí se corrige la fecha para evitar el desfase de un día
            fechaNacimiento: data.fechaNacimiento
              ? data.fechaNacimiento.split("T")[0]
              : "",
            horarioInicio: data.horarioInicio || "08:00",
            horarioFin: data.horarioFin || "17:00",
            // Los campos de usuario vienen en un objeto anidado en el backend
            username: data.user?.username || user.username,
            email: data.user?.email || user.email,
          };
          setProfileData(formattedData);
          setOriginalData(formattedData);
        } else {
          console.error(
            "Perfil no encontrado, usando datos básicos del usuario."
          );
          const baseData = {
            username: user.username,
            email: user.email,
          };
          setProfileData(baseData);
          setOriginalData(baseData);
        }
      } catch (error) {
        console.error("Error al cargar el perfil:", error);
      } finally {
        setInitialLoad(false);
      }
    };
    loadProfile();
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handleDayChange = (e) => {
    const { value, checked } = e.target;
    setProfileData((prevData) => {
      const newDays = checked
        ? [...prevData.diasTrabajo, value]
        : prevData.diasTrabajo.filter((day) => day !== value);
      return { ...prevData, diasTrabajo: newDays };
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileData({ ...profileData, fotoFile: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleEditClick = () => {
    setEditMode(true);
    setSuccessMessage("");
    setErrors({});
  };

  const handleCancelClick = () => {
    setProfileData(originalData);
    setEditMode(false);
    setErrors({});
    setPreview(null);
  };

  const validateForm = () => {
    const newErrors = {};
    if (
      profileData.fechaNacimiento &&
      new Date(profileData.fechaNacimiento) > new Date()
    ) {
      newErrors.fechaNacimiento =
        "La fecha de nacimiento no puede ser en el futuro.";
    }

    if (!validateTimeRange(profileData.horarioInicio, profileData.horarioFin)) {
      newErrors.horario = "La hora de fin debe ser posterior a la de inicio.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setErrors({});
    setSuccessMessage("");

    try {
      const formData = new FormData();
      for (const key in profileData) {
        const value = profileData[key];
        // Solo agregar al formData si el valor ha cambiado
        if (value !== originalData[key]) {
          if (key === "fotoFile") {
            formData.append("foto", value);
          } else if (key === "diasTrabajo") {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value);
          }
        }
      }

      const response = await fetch(`${API_BASE_URL}/api/profile`, {
        method: "PUT",
        body: formData,
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        // Asegurarse de que los valores de fecha y hora estén en el formato correcto para los inputs
        const formattedData = {
          ...data,
          fechaNacimiento: data.fechaNacimiento
            ? data.fechaNacimiento.split("T")[0]
            : "",
          horarioInicio: data.horarioInicio || "08:00",
          horarioFin: data.horarioFin || "17:00",
          // Los campos de usuario vienen en un objeto anidado en el backend
          username: data.user?.username || user.username,
          email: data.user?.email || user.email,
        };
        setProfileData(formattedData);
        setOriginalData(formattedData);
        setSuccessMessage("¡Perfil actualizado con éxito!");
        setEditMode(false);
        setPreview(null);
      } else {
        const errorData = await response.json();
        setErrors(
          errorData.errors || {
            general: "Error al actualizar el perfil",
          }
        );
        setSuccessMessage("");
      }
    } catch (error) {
      setErrors({
        general: "Error de red. Inténtalo de nuevo.",
      });
      setSuccessMessage("");
    } finally {
      setLoading(false);
    }
  };

  const renderEditableField = (label, name, value, icon, type = "text") => (
    <div>
      <label className="block text-pastel-primary text-sm font-semibold mb-1 flex items-center gap-2">
        {icon} {label}
      </label>
      {type === "textarea" ? (
        <textarea
          name={name}
          value={value}
          onChange={handleInputChange}
          className="w-full card-pastel p-3 bg-white text-pastel-primary"
          rows="4"
          disabled={!editMode}
        ></textarea>
      ) : user.role === "odontologo" && name === "especialidad" && editMode ? (
        <select
          name={name}
          value={value}
          onChange={handleInputChange}
          className="w-full card-pastel p-3 bg-white text-pastel-primary appearance-none"
          disabled={!editMode}
        >
          {SPECIALTIES.map((specialty) => (
            <option key={specialty} value={specialty}>
              {specialty}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={handleInputChange}
          className="w-full card-pastel p-3 bg-white text-pastel-primary"
          disabled={!editMode}
        />
      )}
      {errors[name] && (
        <span className="text-red-500 text-xs mt-1 flex items-center gap-1">
          <AlertCircle size={12} /> {errors[name]}
        </span>
      )}
    </div>
  );

  const renderEditableDiasTrabajo = () => (
    <div>
      <label className="block text-pastel-primary text-sm font-semibold mb-1 flex items-center gap-2">
        <Clock size={16} /> Días de Trabajo
      </label>
      <div className="flex flex-wrap gap-2">
        {DIAS_SEMANA_VALUES.map((day) => (
          <div key={day} className="flex items-center">
            <input
              type="checkbox"
              id={day}
              name="diasTrabajo"
              value={day}
              checked={profileData.diasTrabajo.includes(day)}
              onChange={handleDayChange}
              className="mr-2 accent-pastel-purple"
              disabled={!editMode}
            />
            <label htmlFor={day} className="text-pastel-secondary">
              {day}
            </label>
          </div>
        ))}
      </div>
    </div>
  );

  const renderEditableHorario = () => (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-pastel-primary text-sm font-semibold mb-1 flex items-center gap-2">
          <Clock size={16} /> Horario de Inicio
        </label>
        <input
          type="time"
          name="horarioInicio"
          value={profileData.horarioInicio}
          onChange={(e) =>
            setProfileData({
              ...profileData,
              horarioInicio: handleTimeChange(e.target.value),
            })
          }
          className="w-full card-pastel p-3 bg-white text-pastel-primary"
          disabled={!editMode}
        />
      </div>
      <div>
        <label className="block text-pastel-primary text-sm font-semibold mb-1 flex items-center gap-2">
          <Clock size={16} /> Horario de Fin
        </label>
        <input
          type="time"
          name="horarioFin"
          value={profileData.horarioFin}
          onChange={(e) =>
            setProfileData({
              ...profileData,
              horarioFin: handleTimeChange(e.target.value),
            })
          }
          className="w-full card-pastel p-3 bg-white text-pastel-primary"
          disabled={!editMode}
        />
      </div>
      {errors.horario && (
        <span className="col-span-2 text-red-500 text-xs mt-1 flex items-center gap-1">
          <AlertCircle size={12} /> {errors.horario}
        </span>
      )}
    </div>
  );

  const renderDisplayField = (label, value, icon) => (
    <div>
      <label className="block text-pastel-primary text-sm font-semibold mb-1 flex items-center gap-2">
        {icon} {label}
      </label>
      <p className="w-full card-pastel p-3 bg-white text-pastel-primary">
        {value || "No especificado"}
      </p>
    </div>
  );

  if (initialLoad) {
    return (
      <div className="min-h-screen bg-pastel-mint p-6 flex items-center justify-center">
        <div className="card-pastel p-8 bg-pastel-blue text-center">
          <User
            className="animate-pulse mx-auto mb-4 text-pastel-primary"
            size={48}
          />
          <p className="text-pastel-primary">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pastel-mint p-6">
      <div className="max-w-4xl mx-auto card-pastel p-8 bg-pastel-blue">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-pastel-primary flex items-center gap-3">
            <User className="text-blue-600" size={36} />
            Mi Perfil Profesional
          </h1>
          {!editMode && (
            <button
              onClick={handleEditClick}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-transform transform hover:scale-105"
            >
              <Edit size={20} /> Editar Perfil
            </button>
          )}
        </div>

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4 flex items-center gap-2">
            <CheckCircle size={20} />
            <span className="block sm:inline">{successMessage}</span>
          </div>
        )}
        {errors.general && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 flex items-center gap-2">
            <AlertCircle size={20} />
            <span className="block sm:inline">{errors.general}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Sección de la Foto */}
          <div className="mb-6 flex flex-col items-center">
            <div className="w-48 h-48 mx-auto bg-pastel-mint rounded-full overflow-hidden border-4 border-pastel-mint-dark shadow-lg">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
                disabled={!editMode}
              />
              {editMode && (
                <div
                  className="w-full h-full flex items-center justify-center bg-gray-200 cursor-pointer relative group"
                  onClick={() => fileInputRef.current.click()}
                >
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera size={40} className="text-white" />
                  </div>
                  <img
                    src={
                      preview ||
                      (profileData.foto
                        ? `${API_BASE_URL}/uploads/profiles/${profileData.foto}`
                        : null)
                    }
                    alt="Foto de perfil"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "";
                      e.target.style.display = "none";
                    }}
                  />
                  {!preview && !profileData.foto && (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pastel-blue to-pastel-purple">
                      <User size={80} className="text-pastel-muted" />
                    </div>
                  )}
                </div>
              )}
              {!editMode && (
                <>
                  {profileData.foto ? (
                    <img
                      src={`${API_BASE_URL}/uploads/profiles/${profileData.foto}`}
                      alt="Foto de perfil"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pastel-blue to-pastel-purple">
                      <User size={80} className="text-pastel-muted" />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Información del Sistema */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-pastel-primary flex items-center gap-2 border-b border-pastel-mint-dark pb-2 mb-4">
                <Shield size={20} /> Información del Sistema
              </h2>
              {editMode
                ? renderEditableField(
                    "Usuario",
                    "username",
                    profileData.username,
                    <User size={16} />
                  )
                : renderDisplayField(
                    "Usuario",
                    profileData.username,
                    <User size={16} />
                  )}
              {renderDisplayField(
                "Email",
                profileData.email,
                <Mail size={16} />
              )}
              {renderDisplayField("Rol", user?.role, <Shield size={16} />)}
            </div>

            {/* Información de Contacto */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-pastel-primary flex items-center gap-2 border-b border-pastel-mint-dark pb-2 mb-4">
                <Phone size={20} /> Detalles de Contacto
              </h2>
              {editMode
                ? renderEditableField(
                    "Teléfono",
                    "telefono",
                    profileData.telefono,
                    <Phone size={16} />
                  )
                : renderDisplayField(
                    "Teléfono",
                    profileData.telefono,
                    <Phone size={16} />
                  )}
              {editMode
                ? renderEditableField(
                    "Dirección",
                    "direccion",
                    profileData.direccion,
                    <MapPin size={16} />
                  )
                : renderDisplayField(
                    "Dirección",
                    profileData.direccion,
                    <MapPin size={16} />
                  )}
              {editMode
                ? renderEditableField(
                    "Fecha de Nacimiento",
                    "fechaNacimiento",
                    profileData.fechaNacimiento,
                    <Calendar size={16} />,
                    "date"
                  )
                : renderDisplayField(
                    "Fecha de Nacimiento",
                    profileData.fechaNacimiento,
                    <Calendar size={16} />
                  )}
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Información Profesional */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-pastel-primary flex items-center gap-2 border-b border-pastel-mint-dark pb-2 mb-4">
                <Briefcase size={20} /> Información Profesional
              </h2>
              {editMode
                ? renderEditableField(
                    "Especialidad",
                    "especialidad",
                    profileData.especialidad,
                    <Briefcase size={16} />
                  )
                : renderDisplayField(
                    "Especialidad",
                    profileData.especialidad,
                    <Briefcase size={16} />
                  )}
              {editMode
                ? renderEditableField(
                    "Número de Licencia",
                    "numeroLicencia",
                    profileData.numeroLicencia,
                    <Briefcase size={16} />
                  )
                : renderDisplayField(
                    "Número de Licencia",
                    profileData.numeroLicencia,
                    <Briefcase size={16} />
                  )}
              {editMode
                ? renderEditableHorario()
                : renderDisplayField(
                    "Horario",
                    `${profileData.horarioInicio || "No especificado"} - ${
                      profileData.horarioFin || "No especificado"
                    }`,
                    <Clock size={16} />
                  )}
              {editMode ? (
                renderEditableDiasTrabajo()
              ) : (
                <div className="mt-4">
                  <label className="block text-pastel-primary text-sm font-semibold mb-1 flex items-center gap-2">
                    <Clock size={16} /> Días de Trabajo
                  </label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {profileData.diasTrabajo &&
                      profileData.diasTrabajo.map((day, index) => (
                        <span
                          key={index}
                          className="bg-pastel-green px-3 py-1 rounded-full text-xs font-medium text-green-700"
                        >
                          {day}
                        </span>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* Biografía */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-pastel-primary flex items-center gap-2 border-b border-pastel-mint-dark pb-2 mb-4">
                <User size={20} /> Biografía Profesional
              </h2>
              {editMode ? (
                renderEditableField(
                  "Biografía",
                  "biografia",
                  profileData.biografia,
                  null,
                  "textarea"
                )
              ) : (
                <div className="text-pastel-secondary bg-white p-4 rounded border border-pastel-mint-dark min-h-[120px]">
                  {profileData.biografia || "No hay biografía disponible."}
                </div>
              )}
            </div>
          </div>
          {/* Botones al final del formulario */}
          {editMode && (
            <div className="mt-8 flex justify-end gap-2">
              <button
                type="button"
                onClick={handleCancelClick}
                className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-transform transform hover:scale-105"
                disabled={loading}
              >
                <AlertCircle size={20} /> Cancelar
              </button>
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-transform transform hover:scale-105"
                disabled={loading}
              >
                {loading ? (
                  "Guardando..."
                ) : (
                  <>
                    <Save size={20} /> Guardar Cambios
                  </>
                )}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default ProfilePage;
