import { useEffect } from "react"
import { usePatients } from "../context/PatientContext"
import  PatientCard  from "../components/PatientCard";
import { Users, UserPlus, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/Auth.Context";

function PatientPage() {
    const {getPatients, patients} = usePatients()
    const {user} = useAuth();

    useEffect(() => {
      getPatients()
    }, [])

    const sortedPatients = [...patients].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    if (patients.length === 0) {
      return (
        <div className="min-h-screen bg-pastel-mint p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-pastel-primary mb-2">
                Gestión de Pacientes
              </h1>
              <p className="text-pastel-secondary">
                Administra la información de todos los pacientes registrados
              </p>
            </div>

            {/* Empty state */}
            <div className="text-center py-16">
              <div className="card-pastel p-12 bg-pastel-yellow max-w-2xl mx-auto">
                <Users size={64} className="mx-auto text-pastel-muted mb-6" />
                <h3 className="text-2xl font-semibold text-pastel-primary mb-4">
                  No hay pacientes registrados
                </h3>
                <p className="text-pastel-secondary mb-8">
                  Comienza registrando el primer paciente en el sistema para llevar un control detallado de sus consultas.
                </p>
                
                {user?.role === "odontologo" && (
                  <Link
                    to="/patients/new"
                    className="btn-pastel-primary px-8 py-4 rounded-lg font-semibold text-lg transition-pastel inline-flex items-center gap-3"
                  >
                    <UserPlus size={24} />
                    Registrar Primer Paciente
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }

  return (
    <div className="min-h-screen bg-pastel-mint p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-pastel-primary mb-2">
                Gestión de Pacientes
              </h1>
              <p className="text-pastel-secondary">
                {sortedPatients.length} paciente{sortedPatients.length !== 1 ? 's' : ''} registrado{sortedPatients.length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Acciones rápidas */}
            <div className="flex gap-3">
              {user?.role === "odontologo" && (
                <Link
                  to="/patients/new"
                  className="btn-pastel-primary px-6 py-3 rounded-lg font-medium transition-pastel flex items-center gap-2"
                >
                  <UserPlus size={18} />
                  Nuevo Paciente
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card-pastel p-6 text-center bg-pastel-blue">
            <Users size={32} className="mx-auto text-blue-600 mb-2" />
            <p className="text-2xl font-bold text-blue-700">{sortedPatients.length}</p>
            <p className="text-blue-600 text-sm">Total Pacientes</p>
          </div>
          
          <div className="card-pastel p-6 text-center bg-pastel-green">
            <div className="text-green-600 mb-2">👥</div>
            <p className="text-2xl font-bold text-green-700">
              {sortedPatients.filter(p => p.sexo === 'M').length}
            </p>
            <p className="text-green-600 text-sm">Masculinos</p>
          </div>
          
          <div className="card-pastel p-6 text-center bg-pastel-purple">
            <div className="text-purple-600 mb-2">👩</div>
            <p className="text-2xl font-bold text-purple-700">
              {sortedPatients.filter(p => p.sexo === 'F').length}
            </p>
            <p className="text-purple-600 text-sm">Femeninos</p>
          </div>
          
          <div className="card-pastel p-6 text-center bg-pastel-yellow">
            <div className="text-yellow-600 mb-2">📅</div>
            <p className="text-2xl font-bold text-yellow-700">
              {sortedPatients.filter(p => {
                const createdDate = new Date(p.createdAt);
                const today = new Date();
                const thirtyDaysAgo = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000));
                return createdDate >= thirtyDaysAgo;
              }).length}
            </p>
            <p className="text-yellow-600 text-sm">Últimos 30 días</p>
          </div>
        </div>

        {/* Lista de pacientes */}
        <div className="space-y-6">
          <div className="card-pastel p-4 bg-pastel-blue">
            <h2 className="text-xl font-semibold text-pastel-primary mb-2 flex items-center gap-2">
              <Users size={20} />
              Lista de Pacientes
            </h2>
            <p className="text-pastel-secondary text-sm">
              Los pacientes se muestran ordenados por fecha de registro (más recientes primero)
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedPatients.map((patient) => (
              <PatientCard patient={patient} key={patient._id}/>
            ))}
          </div>
        </div>

        {/* Información adicional */}
        <div className="mt-12 card-pastel p-6 bg-pastel-green">
          <h3 className="text-lg font-semibold text-pastel-primary mb-3 flex items-center gap-2">
            💡 Información del Sistema
          </h3>
          <ul className="space-y-2 text-sm text-pastel-secondary">
            <li>• <strong>Vista completa:</strong> Todos los usuarios pueden ver la información de los pacientes</li>
            <li>• <strong>Edición:</strong> Solo los odontólogos pueden editar o eliminar pacientes</li>
            <li>• <strong>Historial:</strong> Haz clic en el ícono del ojo para ver el historial de citas de cada paciente</li>
            <li>• <strong>Orden:</strong> Los pacientes se muestran ordenados por fecha de registro (más recientes primero)</li>
            <li>• Los datos se mantienen seguros y solo son accesibles por personal autorizado</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default PatientPage;