import { useState, useEffect, useRef } from 'react';
import { getPatientsRequest } from '../api/patient';
import { createCita } from '../api/citas';
import { useNavigate } from "react-router-dom";

function NuevaCitaPage() {
    const navigate = useNavigate();
    const [allPatients, setAllPatients] = useState([]);
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [citaData, setCitaData] = useState({
        motivo: '',
        odontograma: {},
        observaciones: '',
        monto: ''
    });

    const [search, setSearch] = useState('');
    const dropdownRef = useRef(null);

    // Cargar pacientes
    useEffect(() => {
        const fetchPatients = async () => {
            const res = await getPatientsRequest();
            setAllPatients(res.data);
            setPatients([]);
        };
        fetchPatients();
    }, []);

    // Filtrar pacientes según búsqueda
    useEffect(() => {
        if (!search) {
            setPatients([]);
            return;
        }
        const filtered = allPatients.filter(p =>
            p.nombre.toLowerCase().includes(search.toLowerCase()) ||
            p.apellido.toLowerCase().includes(search.toLowerCase())
        );
        setPatients(filtered.slice(0, 5));
    }, [search, allPatients]);

    const handlePatientSelect = (patient) => {
        setSelectedPatient(patient);
        setPatients([]);
        setSearch('');
    };

    const handleDeselectPatient = () => {
        setSelectedPatient(null);
        setPatients([]);
        setCitaData({ motivo: '', odontograma: {}, observaciones: '', monto: '' });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCitaData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedPatient) return alert('Selecciona un paciente');

        const fechaActual = new Date().toISOString();
        const newCita = {
            pacienteId: selectedPatient._id,
            ...citaData,
            fecha: fechaActual
        };

        try {
            const res = await createCita(newCita);
            console.log('Cita creada:', res);
            alert('Cita creada con éxito');
            // handleDeselectPatient();
            navigate(`/paciente/${selectedPatient._id}/citas`);
        } catch (err) {
            console.error(err);
            alert('Error al crear cita');
        }
    };

    return (
        <div className="min-h-screen p-6 bg-[#202020] text-gray-100 flex flex-col items-center">
            <h1 className="text-4xl font-bold text-center mb-10 text-blue-500">Nueva Cita</h1>

            {/* Buscador de pacientes */}
            {!selectedPatient && (
                <div className="relative w-full max-w-2xl">
                    <input
                        type="text"
                        placeholder="Buscar paciente..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full p-3 border border-gray-700 rounded bg-zinc-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />

                    {patients.length > 0 && (
                        <ul
                            ref={dropdownRef}
                            className="absolute w-full max-h-64 overflow-y-auto bg-zinc-800 border border-gray-700 rounded mt-1 shadow-xl z-50 transition-all duration-300 ease-out animate-fade-in"
                        >
                            {patients.map(p => (
                                <li
                                    key={p._id}
                                    onClick={() => handlePatientSelect(p)}
                                    className="px-4 py-3 cursor-pointer hover:bg-zinc-700 transition-colors flex justify-between items-center"
                                >
                                    <span>{p.nombre} {p.apellido}</span>
                                    <span className="text-gray-400 text-sm">{p.cedula}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}

            {/* Paciente seleccionado */}
            {selectedPatient && (
                <div className="bg-zinc-900 p-6 rounded shadow-xl w-full max-w-3xl mt-6 flex flex-col gap-6 animate-fade-in">
                    <button
                        onClick={handleDeselectPatient}
                        className="self-start px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition"
                    >
                        ← Buscar otro paciente
                    </button>

                    <h2 className="text-2xl font-semibold text-gray-200">Paciente seleccionado</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-100">
                        <p><strong>Nombre:</strong> {selectedPatient.nombre} {selectedPatient.apellido}</p>
                        <p><strong>Cédula:</strong> {selectedPatient.cedula}</p>
                        <p><strong>Edad:</strong> {selectedPatient.edad}</p>
                        <p><strong>Sexo:</strong> {selectedPatient.sexo}</p>
                        <p><strong>Teléfono:</strong> {selectedPatient.telefonoContacto}</p>
                        <p><strong>Dirección:</strong> {selectedPatient.direccion}</p>
                        <p><strong>Carrera:</strong> {selectedPatient.carrera}</p>
                        <p><strong>Grupo Sanguíneo:</strong> {selectedPatient.grupoSanguineo}</p>
                        <p><strong>Alergias:</strong> {selectedPatient.alergias}</p>
                        <p><strong>Enfermedades Crónicas:</strong> {selectedPatient.enfermedadesCronicas}</p>
                        <p><strong>Medicamentos:</strong> {selectedPatient.medicamentos}</p>
                        <p><strong>Condición Especial:</strong> {selectedPatient.condicionEspecial}</p>
                        <p><strong>Cirugías:</strong> {selectedPatient.cirugias}</p>
                        <p><strong>Antecedentes Familiares:</strong> {selectedPatient.antecedentesFamiliares}</p>
                        <p className="col-span-2"><strong>Fecha de registro:</strong> {new Date().toLocaleString()}</p>
                    </div>

                    <h2 className="text-2xl font-semibold text-gray-200 mt-4">Datos de la cita</h2>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row md:space-x-4">
                            <input
                                name="motivo"
                                value={citaData.motivo}
                                onChange={handleChange}
                                placeholder="Motivo"
                                required
                                className="flex-1 p-3 border border-gray-700 rounded bg-zinc-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            />
                            <input
                                type="number"
                                name="monto"
                                value={citaData.monto}
                                onChange={handleChange}
                                placeholder="Monto"
                                className="w-36 p-3 border border-gray-700 rounded bg-zinc-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2 md:mt-0"
                            />
                        </div>

                        <textarea
                            name="observaciones"
                            value={citaData.observaciones}
                            onChange={handleChange}
                            placeholder="Observaciones"
                            className="w-full p-3 border border-gray-700 rounded bg-zinc-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />

                        <button
                            type="submit"
                            className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                        >
                            Crear Cita
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default NuevaCitaPage;
