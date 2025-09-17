import { useForm, Controller } from "react-hook-form";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Calendar as CalendarIcon,
  User,
  Phone,
  MapPin,
  Heart,
  Stethoscope,
  FileText,
  AlertCircle,
  Save,
  ArrowLeft,
} from "lucide-react";
import { usePatients } from "../context/PatientContext";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { toLocalDate } from "@/utils/date";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

function PatientFormPage() {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors: formErrors },
  } = useForm({
    mode: "onChange",
  });
  const { createPatient, getPatient, updatePatient, errors } = usePatients();
  const navigate = useNavigate();
  const params = useParams();
  const [loading, setLoading] = useState(false);

  // Tipos de sangre
  const tiposSangre = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  // Carreras disponibles
  const carreras = [
    "Ingeniería en Informática",
    "Ingeniería Industrial",
    "Ingeniería Electrónica",
    "Ingeniería Mecánica",
    "Ingeniería Producción Animal",
    "Ingeniería Agroindustrial",
    "Ingeniería Agronómica",
    "Ingeniería Ambiental",
    "Ingeniería Civil",
    "Arquitectura",
    "Licenciatura en Música",
    "Licenciatura en Psicología",
    "TSU Entrenamiento Deportivo",
    "Personal Docente",
    "Personal Obrero",
    "Personal Administrativo",
  ];

  useEffect(() => {
    async function loadPatient() {
      if (params.id) {
        setLoading(true);
        try {
          const patient = await getPatient(params.id);
          if (patient) {
            Object.keys(patient).forEach((key) => {
              if (patient[key]) {
                if (key === "fechaNacimiento") {
                  setValue(
                    "fechaNacimiento",
                    dayjs(patient[key]).format("YYYY-MM-DD")
                  );
                } else {
                  setValue(key, patient[key]);
                }
              }
            });
          }
        } catch (error) {
          console.error("Error cargando paciente:", error);
        } finally {
          setLoading(false);
        }
      }
    }
    loadPatient();
  }, [params.id, setValue, getPatient]);

  const onSubmit = handleSubmit(async (data) => {
    setLoading(true);
    try {
      const fechaNacimiento = dayjs(data.fechaNacimiento).format("YYYY-MM-DD");
      const { edad, ...patientData } = { ...data, fechaNacimiento };
      console.log("datos q se van a enviar", data);

      if (params.id) {
        await updatePatient(params.id, patientData);
      } else {
        await createPatient(patientData);
      }
      navigate("/patients");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  });

  if (loading && params.id) {
    return (
      <div className="min-h-screen bg-pastel-mint p-6 flex items-center justify-center">
        <div className="card-pastel p-8 bg-pastel-blue text-center">
          <User
            className="animate-pulse mx-auto mb-4 text-pastel-primary"
            size={48}
          />
          <p className="text-pastel-primary">Cargando datos del paciente...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pastel-mint p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/patients")}
            className="btn-pastel-secondary px-4 py-2 rounded-md font-medium transition-pastel flex items-center gap-2 mb-4"
          >
            <ArrowLeft size={16} />
            Volver a Pacientes
          </button>

          <h1 className="text-3xl font-bold text-pastel-primary mb-2 flex items-center gap-3">
            <User className="text-blue-600" size={36} />
            {params.id ? "Editar Paciente" : "Registrar Nuevo Paciente"}
          </h1>
          <p className="text-pastel-secondary">
            {params.id
              ? "Actualiza la información del paciente"
              : "Completa todos los campos para registrar un nuevo paciente"}
          </p>
        </div>

        {/* Errores del contexto */}
        {errors.length > 0 && (
          <div className="mb-6">
            {errors.map((error, i) => (
              <div
                key={i}
                className="bg-pastel-pink border border-red-300 p-4 rounded-lg mb-3 flex items-center gap-3"
              >
                <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
                <span className="text-red-700">{error}</span>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-8">
          {/* Información Personal */}
          <div className="card-pastel p-6 bg-pastel-blue">
            <h2 className="text-xl font-semibold mb-6 text-pastel-primary flex items-center gap-2">
              <User size={20} />
              Información Personal
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center text-sm font-medium mb-2 text-pastel-primary">
                  <User className="mr-2" size={16} />
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  placeholder="Nombre completo del paciente"
                  {...register("nombre", {
                    required: "El nombre es obligatorio",
                  })}
                  className="input-pastel w-full p-3 rounded"
                  autoFocus
                />
                {formErrors.nombre && (
                  <p className="text-red-600 text-sm mt-1">
                    {formErrors.nombre.message}
                  </p>
                )}
              </div>

              <div>
                <label className="flex items-center text-sm font-medium mb-2 text-pastel-primary">
                  <User className="mr-2" size={16} />
                  Apellido *
                </label>
                <input
                  type="text"
                  placeholder="Apellido del paciente"
                  {...register("apellido", {
                    required: "El apellido es obligatorio",
                  })}
                  className="input-pastel w-full p-3 rounded"
                />
                {formErrors.apellido && (
                  <p className="text-red-600 text-sm mt-1">
                    {formErrors.apellido.message}
                  </p>
                )}
              </div>

              <div>
                <label className="flex items-center text-sm font-medium mb-2 text-pastel-primary">
                  <FileText className="mr-2" size={16} />
                  Cédula de Identidad *
                </label>
                <input
                  type="text"
                  placeholder="V-12345678 o E-87654321"
                  {...register("cedula", {
                    required: "La cédula es obligatoria",
                  })}
                  className="input-pastel w-full p-3 rounded"
                />
                {formErrors.cedula && (
                  <p className="text-red-600 text-sm mt-1">
                    {formErrors.cedula.message}
                  </p>
                )}
              </div>

              <div>
                <label className="flex items-center text-sm font-medium mb-2 text-pastel-primary">
                  <CalendarIcon className="mr-2" size={16} />
                  Fecha de Nacimiento *
                </label>
                <Controller
                  name="fechaNacimiento"
                  control={control}
                  rules={{
                    required: "La fecha de nacimiento es obligatoria",
                    validate: (value) => {
                      if (!value)
                        return "Debe seleccionar una fecha de nacimiento";
                      if (dayjs(value).isAfter(dayjs())) {
                        return "La fecha de nacimiento no puede ser futura";
                      }
                      return true;
                    },
                  }}
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="input-pastel w-full p-3 justify-start text-left font-normal"
                        >
                          {field.value
                            ? dayjs(field.value).format("DD/MM/YYYY")
                            : "Selecciona fecha de nacimiento"}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="p-0">
                        <Calendar
                          mode="single"
                          selected={
                            field.value ? toLocalDate(field.value) : undefined
                          }
                          onSelect={(date) => {
                            if (date) {
                              field.onChange(dayjs(date).format("YYYY-MM-DD"));
                            }
                          }}
                          captionLayout="dropdown"
                          fromYear={1900}
                          toYear={dayjs().year()}
                          disabled={(date) => date > new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />
                {formErrors.fechaNacimiento && (
                  <p className="text-red-600 text-sm mt-1">
                    {formErrors.fechaNacimiento.message}
                  </p>
                )}
              </div>

              <div>
                <label className="flex items-center text-sm font-medium mb-2 text-pastel-primary">
                  <User className="mr-2" size={16} />
                  Sexo *
                </label>
                <select
                  {...register("sexo", {
                    required: "Debe seleccionar un sexo",
                  })}
                  className="input-pastel w-full p-3 rounded"
                >
                  <option value="">Seleccione sexo</option>
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                </select>
                {formErrors.sexo && (
                  <p className="text-red-600 text-sm mt-1">
                    {formErrors.sexo.message}
                  </p>
                )}
              </div>

              <div>
                <label className="flex items-center text-sm font-medium mb-2 text-pastel-primary">
                  <Heart className="mr-2" size={16} />
                  Grupo Sanguíneo *
                </label>
                <select
                  {...register("grupoSanguineo", {
                    required: "Grupo sanguíneo obligatorio",
                  })}
                  className="input-pastel w-full p-3 rounded"
                >
                  <option value="">Seleccione tipo de sangre</option>
                  {tiposSangre.map((tipo, index) => (
                    <option key={index} value={tipo}>
                      {tipo}
                    </option>
                  ))}
                </select>
                {formErrors.grupoSanguineo && (
                  <p className="text-red-600 text-sm mt-1">
                    {formErrors.grupoSanguineo.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Información de Contacto */}
          <div className="card-pastel p-6 bg-pastel-green">
            <h2 className="text-xl font-semibold mb-6 text-pastel-primary flex items-center gap-2">
              <Phone size={20} />
              Información de Contacto
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center text-sm font-medium mb-2 text-pastel-primary">
                  <Phone className="mr-2" size={16} />
                  Teléfono de Contacto *
                </label>
                <input
                  type="text"
                  placeholder="0414-123-4567"
                  {...register("telefonoContacto", {
                    required: "Teléfono de contacto obligatorio",
                  })}
                  className="input-pastel w-full p-3 rounded"
                />
                {formErrors.telefonoContacto && (
                  <p className="text-red-600 text-sm mt-1">
                    {formErrors.telefonoContacto.message}
                  </p>
                )}
              </div>

              <div>
                <label className="flex items-center text-sm font-medium mb-2 text-pastel-primary">
                  <Phone className="mr-2" size={16} />
                  Teléfono de Emergencia *
                </label>
                <input
                  type="text"
                  placeholder="0424-987-6543"
                  {...register("telefonoEmergencia", {
                    required: "Teléfono de emergencia obligatorio",
                  })}
                  className="input-pastel w-full p-3 rounded"
                />
                {formErrors.telefonoEmergencia && (
                  <p className="text-red-600 text-sm mt-1">
                    {formErrors.telefonoEmergencia.message}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center text-sm font-medium mb-2 text-pastel-primary">
                  <MapPin className="mr-2" size={16} />
                  Dirección Completa *
                </label>
                <input
                  type="text"
                  placeholder="Calle, Avenida, Sector, Ciudad"
                  {...register("direccion", {
                    required: "Dirección obligatoria",
                  })}
                  className="input-pastel w-full p-3 rounded"
                />
                {formErrors.direccion && (
                  <p className="text-red-600 text-sm mt-1">
                    {formErrors.direccion.message}
                  </p>
                )}
              </div>

              <div>
                <label className="flex items-center text-sm font-medium mb-2 text-pastel-primary">
                  <FileText className="mr-2" size={16} />
                  Carrera / Ocupación *
                </label>
                <select
                  {...register("carrera", { required: "Carrera obligatoria" })}
                  className="input-pastel w-full p-3 rounded"
                >
                  <option value="">Seleccione carrera u ocupación</option>
                  {carreras.map((carrera, index) => (
                    <option key={index} value={carrera}>
                      {carrera}
                    </option>
                  ))}
                </select>
                {formErrors.carrera && (
                  <p className="text-red-600 text-sm mt-1">
                    {formErrors.carrera.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Historia Médica */}
          <div className="card-pastel p-6 bg-pastel-purple">
            <h2 className="text-xl font-semibold mb-6 text-pastel-primary flex items-center gap-2">
              <Stethoscope size={20} />
              Historia Médica
            </h2>

            <div className="space-y-6">
              <div>
                <label className="flex items-center text-sm font-medium mb-2 text-pastel-primary">
                  <FileText className="mr-2" size={16} />
                  Motivo de la Consulta *
                </label>
                <textarea
                  placeholder="Describe el motivo principal de la consulta odontológica"
                  {...register("motivoConsulta", {
                    required: "Motivo de consulta obligatorio",
                  })}
                  className="input-pastel w-full p-3 rounded"
                  rows="3"
                />
                {formErrors.motivoConsulta && (
                  <p className="text-red-600 text-sm mt-1">
                    {formErrors.motivoConsulta.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center text-sm font-medium mb-2 text-pastel-primary">
                    <AlertCircle className="mr-2" size={16} />
                    Alergias
                  </label>
                  <textarea
                    placeholder="Medicamentos, alimentos u otras alergias"
                    {...register("alergias")}
                    className="input-pastel w-full p-3 rounded"
                    rows="3"
                  />
                </div>

                <div>
                  <label className="flex items-center text-sm font-medium mb-2 text-pastel-primary">
                    <Heart className="mr-2" size={16} />
                    Enfermedades Crónicas
                  </label>
                  <textarea
                    placeholder="Diabetes, hipertensión, etc."
                    {...register("enfermedadesCronicas")}
                    className="input-pastel w-full p-3 rounded"
                    rows="3"
                  />
                </div>

                <div>
                  <label className="flex items-center text-sm font-medium mb-2 text-pastel-primary">
                    <FileText className="mr-2" size={16} />
                    Medicamentos Actuales
                  </label>
                  <textarea
                    placeholder="Medicamentos que toma regularmente"
                    {...register("medicamentos")}
                    className="input-pastel w-full p-3 rounded"
                    rows="3"
                  />
                </div>

                <div>
                  <label className="flex items-center text-sm font-medium mb-2 text-pastel-primary">
                    <AlertCircle className="mr-2" size={16} />
                    Condiciones Especiales
                  </label>
                  <textarea
                    placeholder="Embarazo, discapacidades, etc."
                    {...register("condicionEspecial")}
                    className="input-pastel w-full p-3 rounded"
                    rows="3"
                  />
                </div>

                <div>
                  <label className="flex items-center text-sm font-medium mb-2 text-pastel-primary">
                    <Stethoscope className="mr-2" size={16} />
                    Cirugías Previas
                  </label>
                  <textarea
                    placeholder="Operaciones o cirugías realizadas"
                    {...register("cirugias")}
                    className="input-pastel w-full p-3 rounded"
                    rows="3"
                  />
                </div>

                <div>
                  <label className="flex items-center text-sm font-medium mb-2 text-pastel-primary">
                    <User className="mr-2" size={16} />
                    Antecedentes Familiares
                  </label>
                  <textarea
                    placeholder="Enfermedades hereditarias o familiares relevantes"
                    {...register("antecedentesFamiliares")}
                    className="input-pastel w-full p-3 rounded"
                    rows="3"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end gap-4 pt-6">
            <button
              type="button"
              onClick={() => navigate("/patients")}
              disabled={loading}
              className="btn-pastel-secondary px-8 py-3 rounded-md font-semibold transition-pastel disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-pastel-primary px-8 py-3 rounded-md font-semibold transition-pastel disabled:opacity-50 flex items-center gap-2"
            >
              <Save size={18} />
              {loading
                ? "Guardando..."
                : params.id
                ? "Actualizar Paciente"
                : "Registrar Paciente"}
            </button>
          </div>
        </form>

        {/* Información adicional */}
        <div className="mt-8 card-pastel p-6 bg-pastel-yellow">
          <h3 className="text-lg font-semibold text-pastel-primary mb-3 flex items-center gap-2">
            💡 Información Importante
          </h3>
          <ul className="space-y-2 text-sm text-pastel-secondary">
            <li>
              • <strong>Campos obligatorios:</strong> Están marcados con
              asterisco (*)
            </li>
            <li>
              • <strong>Historia médica:</strong> Información opcional pero
              recomendada para un mejor diagnóstico
            </li>
            <li>
              • <strong>Privacidad:</strong> Toda la información está protegida
              según normativas de privacidad médica
            </li>
            <li>
              • <strong>Actualización:</strong> Puedes actualizar esta
              información en cualquier momento
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default PatientFormPage;
