import { useState, useEffect } from "react";
import {
  User,
  Calendar,
  Users,
  Award,
  Phone,
  MapPin,
  Mail,
  Stethoscope,
  Clock,
} from "lucide-react";
import { getImageUrl } from "../api/config";
import { getDoctorsStatsRequest } from "../api/doctor";

function DoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await getDoctorsStatsRequest();
      setDoctors(response.data);
    } catch (error) {
      console.error("Error al obtener doctores:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calcular estadísticas reales
  const stats = {
    totalDoctors: doctors.length,
    totalPatients: doctors.reduce(
      (total, doc) => total + (doc.totalPacientes || 0),
      0
    ),
    totalAppointments: doctors.reduce(
      (total, doc) => total + (doc.totalCitas || 0),
      0
    ),
    activeDoctors: doctors.filter((doc) => (doc.totalCitas || 0) > 0).length,
    // Calcular promedio de citas por doctor activo
    avgAppointmentsPerDoctor:
      doctors.filter((doc) => (doc.totalCitas || 0) > 0).length > 0
        ? Math.round(
            doctors.reduce((total, doc) => total + (doc.totalCitas || 0), 0) /
              doctors.filter((doc) => (doc.totalCitas || 0) > 0).length
          )
        : 0,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-pastel-mint p-6">
        <div className="text-center py-8 text-pastel-primary">
          Cargando información de doctores...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pastel-mint p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-pastel-primary mb-2">
            Gestión de Doctores
          </h1>
          <p className="text-pastel-secondary">
            Panel de control para supervisar el desempeño y actividad de los
            odontólogos registrados
          </p>
        </div>

        {/* Estadísticas generales corregidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card-pastel p-6 text-center bg-pastel-green">
            <Stethoscope size={32} className="mx-auto text-green-600 mb-2" />
            <p className="text-2xl font-bold text-green-700">
              {stats.totalDoctors}
            </p>
            <p className="text-green-600 text-sm">Doctores Registrados</p>
          </div>

          <div className="card-pastel p-6 text-center bg-pastel-blue">
            <Users size={32} className="mx-auto text-blue-600 mb-2" />
            <p className="text-2xl font-bold text-blue-700">
              {stats.activeDoctors}
            </p>
            <p className="text-blue-600 text-sm">Doctores Activos</p>
          </div>

          <div className="card-pastel p-6 text-center bg-pastel-purple">
            <Calendar size={32} className="mx-auto text-purple-600 mb-2" />
            <p className="text-2xl font-bold text-purple-700">
              {stats.totalAppointments}
            </p>
            <p className="text-purple-600 text-sm">Total de Citas</p>
          </div>

          <div className="card-pastel p-6 text-center bg-pastel-yellow">
            <Clock size={32} className="mx-auto text-yellow-600 mb-2" />
            <p className="text-2xl font-bold text-yellow-700">
              {stats.avgAppointmentsPerDoctor}
            </p>
            <p className="text-yellow-600 text-sm">Promedio Citas/Doctor</p>
          </div>
        </div>

        {/* Estadísticas adicionales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card-pastel p-4 text-center bg-pastel-mint-light">
            <div className="text-lg font-bold text-pastel-primary">
              {stats.totalPatients}
            </div>
            <div className="text-sm text-pastel-secondary">
              Total Pacientes Atendidos
            </div>
          </div>

          <div className="card-pastel p-4 text-center bg-pastel-mint-light">
            <div className="text-lg font-bold text-pastel-primary">
              {((stats.activeDoctors / stats.totalDoctors) * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-pastel-secondary">
              Tasa de Actividad
            </div>
          </div>

          <div className="card-pastel p-4 text-center bg-pastel-mint-light">
            <div className="text-lg font-bold text-pastel-primary">
              {stats.totalPatients > 0
                ? (stats.totalPatients / stats.activeDoctors).toFixed(1)
                : 0}
            </div>
            <div className="text-sm text-pastel-secondary">
              Pacientes por Doctor Activo
            </div>
          </div>
        </div>

        {/* Lista de doctores */}
        {doctors.length === 0 ? (
          <div className="text-center py-12">
            <User size={64} className="mx-auto text-pastel-muted mb-4" />
            <h3 className="text-xl font-semibold text-pastel-primary mb-2">
              No hay doctores registrados
            </h3>
            <p className="text-pastel-secondary">
              Los doctores aparecerán aquí cuando se registren en el sistema.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {doctors.map((doctor) => (
              <div
                key={doctor._id}
                className="card-pastel p-6 hover:shadow-lg transition-pastel"
              >
                <div className="flex items-start space-x-4">
                  {/* Foto del doctor */}
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 rounded-full overflow-hidden bg-pastel-blue-dark border-2 border-pastel-mint-dark">
                      {doctor.profile?.foto ? (
                        <img
                          src={getImageUrl("profiles", doctor.profile.foto)}
                          alt={`Dr. ${doctor.username}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User size={32} className="text-pastel-muted" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Información del doctor */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-pastel-primary">
                          Dr. {doctor.username}
                        </h3>
                        {doctor.profile?.especialidad && (
                          <p className="text-sm font-medium text-blue-600 bg-pastel-blue px-2 py-1 rounded-full inline-block">
                            {doctor.profile.especialidad}
                          </p>
                        )}
                      </div>

                      {/* Estado de actividad mejorado */}
                      <div className="text-right">
                        <div
                          className={`px-3 py-1 rounded-full text-xs font-semibold mb-1 ${
                            (doctor.totalCitas || 0) > 0
                              ? "bg-pastel-green text-green-700"
                              : "bg-pastel-yellow text-yellow-700"
                          }`}
                        >
                          {(doctor.totalCitas || 0) > 0
                            ? "Activo"
                            : "Sin Actividad"}
                        </div>
                        {/* Indicador de nivel de actividad */}
                        {(doctor.totalCitas || 0) > 0 && (
                          <div className="text-xs text-pastel-muted">
                            {doctor.totalCitas >= 10
                              ? "🔥 Alta"
                              : doctor.totalCitas >= 5
                              ? "📈 Media"
                              : "📊 Baja"}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Información de contacto */}
                    <div className="space-y-2 text-sm text-pastel-secondary mb-4">
                      <div className="flex items-center space-x-2">
                        <Mail size={14} />
                        <span>{doctor.email}</span>
                      </div>

                      {doctor.profile?.telefono && (
                        <div className="flex items-center space-x-2">
                          <Phone size={14} />
                          <span>{doctor.profile.telefono}</span>
                        </div>
                      )}

                      {doctor.profile?.direccion && (
                        <div className="flex items-center space-x-2">
                          <MapPin size={14} />
                          <span className="truncate">
                            {doctor.profile.direccion}
                          </span>
                        </div>
                      )}

                      {doctor.profile?.numeroLicencia && (
                        <div className="text-xs text-pastel-muted">
                          <strong>Licencia:</strong>{" "}
                          {doctor.profile.numeroLicencia}
                        </div>
                      )}
                    </div>

                    {/* Biografía */}
                    {doctor.profile?.biografia && (
                      <div className="mb-4">
                        <p className="text-sm text-pastel-secondary italic">
                          "{doctor.profile.biografia.substring(0, 120)}
                          {doctor.profile.biografia.length > 120 ? "..." : ""}"
                        </p>
                      </div>
                    )}

                    {/* Estadísticas individuales mejoradas */}
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-pastel-mint-dark">
                      <div className="text-center">
                        <div className="text-lg font-bold text-pastel-primary">
                          {doctor.totalPacientes || 0}
                        </div>
                        <div className="text-xs text-pastel-muted">
                          Pacientes
                        </div>
                      </div>

                      <div className="text-center">
                        <div className="text-lg font-bold text-pastel-primary">
                          {doctor.totalCitas || 0}
                        </div>
                        <div className="text-xs text-pastel-muted">Citas</div>
                      </div>

                      <div className="text-center">
                        <div className="text-lg font-bold text-pastel-primary">
                          {doctor.ultimaCita
                            ? new Date(doctor.ultimaCita).toLocaleDateString(
                                "es-ES",
                                {
                                  day: "2-digit",
                                  month: "2-digit",
                                }
                              )
                            : "N/A"}
                        </div>
                        <div className="text-xs text-pastel-muted">
                          Última Cita
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Información adicional expandible */}
                {doctor.profile && (
                  <div className="mt-4 pt-4 border-t border-pastel-mint-dark text-xs text-pastel-muted">
                    <div className="grid grid-cols-2 gap-4">
                      <p>
                        <strong>Miembro desde:</strong>{" "}
                        {new Date(doctor.createdAt).toLocaleDateString("es-ES")}
                      </p>
                      {doctor.profile.fechaNacimiento && (
                        <p>
                          <strong>Fecha de nacimiento:</strong>{" "}
                          {new Date(
                            doctor.profile.fechaNacimiento
                          ).toLocaleDateString("es-ES")}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Información adicional actualizada */}
        <div className="mt-8 card-pastel p-6 bg-pastel-blue">
          <h3 className="text-lg font-semibold text-pastel-primary mb-3">
            💡 Información del Panel
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ul className="space-y-2 text-sm text-pastel-secondary">
              <li>
                • <strong>Doctores Registrados:</strong> Total de odontólogos en
                el sistema
              </li>
              <li>
                • <strong>Doctores Activos:</strong> Odontólogos con al menos
                una cita registrada
              </li>
              <li>
                • <strong>Total de Citas:</strong> Suma de todas las consultas
                realizadas
              </li>
              <li>
                • <strong>Promedio Citas/Doctor:</strong> Citas promedio por
                doctor activo
              </li>
            </ul>
            <ul className="space-y-2 text-sm text-pastel-secondary">
              <li>
                • <strong>Tasa de Actividad:</strong> Porcentaje de doctores
                activos
              </li>
              <li>
                • <strong>Actividad Alta:</strong> 10+ citas realizadas 🔥
              </li>
              <li>
                • <strong>Actividad Media:</strong> 5-9 citas realizadas 📈
              </li>
              <li>
                • <strong>Actividad Baja:</strong> 1-4 citas realizadas 📊
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorsPage;
