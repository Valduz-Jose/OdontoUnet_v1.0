import { usePatients } from "../context/PatientContext"
import { useAuth } from "../context/Auth.Context";
import { Link } from "react-router-dom";
import { Eye, Edit, Trash2 } from "lucide-react";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)

function PatientCard({patient}) {
    const {deletePatient} = usePatients();
    const {user} = useAuth();

  return (
    <div className="card-pastel p-6 hover:shadow-lg transition-pastel">
        <header className="flex justify-between items-start mb-4">
            <div>
                <h1 className="text-xl font-bold text-pastel-primary mb-1">
                    {patient.nombre} {patient.apellido}
                </h1>
                <p className="text-sm text-pastel-muted">Cédula: {patient.cedula}</p>
            </div>
            
            <div className="flex gap-2 items-center">
                {/* Ver citas - todos pueden ver */}
                <Link 
                    to={`/paciente/${patient._id}/citas`}
                    className="btn-pastel-info p-2 rounded-md transition-pastel"
                    title="Ver historial de citas"
                >
                    <Eye size={16} />
                </Link>

                {/* Editar - solo odontólogos */}
                {user?.role === "odontologo" && (
                    <Link 
                        to={`/patients/${patient._id}`}
                        className="btn-pastel-primary p-2 rounded-md transition-pastel"
                        title="Editar información del paciente"
                    >
                        <Edit size={16} />
                    </Link>
                )}

                {/* Eliminar - solo odontólogos */}
                {user?.role === "odontologo" && (
                    <button 
                        className="btn-pastel-danger p-2 rounded-md transition-pastel"
                        onClick={() => {
                            if (window.confirm(`¿Estás seguro de que quieres eliminar al paciente ${patient.nombre} ${patient.apellido}?`)) {
                                deletePatient(patient._id);
                            }
                        }}
                        title="Eliminar paciente"
                    >
                        <Trash2 size={16} />
                    </button>
                )}
            </div>
        </header>

        <div className="space-y-2 text-sm text-pastel-secondary">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <p><strong>Fecha de nacimiento:</strong> {dayjs(patient.fechaNacimiento).format("DD/MM/YYYY")}</p>
                <p><strong>Edad:</strong> {patient.edad} años</p>
                <p><strong>Sexo:</strong> {patient.sexo === "M" ? "Masculino" : "Femenino"}</p>
                <p><strong>Grupo sanguíneo:</strong> {patient.grupoSanguineo}</p>
            </div>
            
            <div className="mt-3 pt-3 border-t border-pastel-mint-dark">
                <p><strong>Teléfono:</strong> {patient.telefonoContacto}</p>
                <p><strong>Emergencia:</strong> {patient.telefonoEmergencia}</p>
                <p><strong>Dirección:</strong> {patient.direccion}</p>
                <p><strong>Carrera/Ocupación:</strong> {patient.carrera}</p>
            </div>

            <div className="mt-3 pt-3 border-t border-pastel-mint-dark">
                <p><strong>Motivo de consulta:</strong> {patient.motivoConsulta}</p>
                
                {patient.alergias && (
                    <p><strong>Alergias:</strong> {patient.alergias}</p>
                )}
                {patient.enfermedadesCronicas && (
                    <p><strong>Enfermedades crónicas:</strong> {patient.enfermedadesCronicas}</p>
                )}
                {patient.medicamentos && (
                    <p><strong>Medicamentos:</strong> {patient.medicamentos}</p>
                )}
                {patient.condicionEspecial && (
                    <p><strong>Condición especial:</strong> {patient.condicionEspecial}</p>
                )}
                {patient.cirugias && (
                    <p><strong>Cirugías:</strong> {patient.cirugias}</p>
                )}
                {patient.antecedentesFamiliares && (
                    <p><strong>Antecedentes familiares:</strong> {patient.antecedentesFamiliares}</p>
                )}
            </div>

            <div className="mt-4 pt-3 border-t border-pastel-mint-dark">
                <p className="text-xs text-pastel-muted">
                    <strong>Registrado por:</strong> {patient.user?.username} 
                    <span className="ml-2">
                        ({dayjs(patient.createdAt).format("DD/MM/YYYY")})
                    </span>
                </p>
            </div>
        </div>
    </div>
  )
}

export default PatientCard;