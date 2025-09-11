import { usePatients } from "../context/PatientContext"
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)

function PatientCard({patient}) {

    const {deletePatient} = usePatients();

  return (
    <div className="bg-zinc-800 max-w-md w-full p-6 rounded-md shadow-md">
        <header className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold text-white">
                {patient.nombre} {patient.apellido}
            </h1>
            <div className="flex gap-x-2 items-center">
                <button 
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
                onClick={()=>{
                    deletePatient(patient._id);
                }}>Eliminar</button>

                <Link to={`/patients/${patient._id}`}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
                >Editar</Link>
            </div>
        </header>
        <div className="text-slate-300 space-y-1 text-sm">
        <p><strong>Cédula:</strong> {patient.cedula}</p>
        <p><strong>Fecha de nacimiento:</strong> {dayjs(patient.fechaNacimiento).format("DD/MM/YYYY")}</p>
        <p><strong>Edad:</strong> {patient.edad} años</p>
        <p><strong>Sexo:</strong> {patient.sexo === "M" ? "Masculino" : "Femenino"}</p>
        <p><strong>Teléfono de contacto:</strong> {patient.telefonoContacto}</p>
        <p><strong>Teléfono de emergencia:</strong> {patient.telefonoEmergencia}</p>
        <p><strong>Dirección:</strong> {patient.direccion}</p>
        <p><strong>Carrera:</strong> {patient.carrera}</p>
        <p><strong>Grupo sanguíneo:</strong> {patient.grupoSanguineo}</p>
        <p><strong>Motivo de consulta:</strong> {patient.motivoConsulta}</p>
        {patient.historiaMedicaGeneral && (
          <p><strong>Historia médica:</strong> {patient.historiaMedicaGeneral}</p>
        )}
        {patient.alergias && <p><strong>Alergias:</strong> {patient.alergias}</p>}
        {patient.enfermedadesCronicas && (
          <p><strong>Enfermedades crónicas:</strong> {patient.enfermedadesCronicas}</p>
        )}
        {patient.medicamentos && <p><strong>Medicamentos:</strong> {patient.medicamentos}</p>}
        {patient.condicionEspecial && <p><strong>Condición especial:</strong> {patient.condicionEspecial}</p>}
        {patient.cirugias && <p><strong>Cirugías:</strong> {patient.cirugias}</p>}
        {patient.antecedentesFamiliares && (
          <p><strong>Antecedentes familiares:</strong> {patient.antecedentesFamiliares}</p>
        )}
        <p className="text-slate-300">
        Registrado por Odontologo : {patient.user?.username}
        </p>

      </div>
    </div>
  )
}

export default PatientCard;