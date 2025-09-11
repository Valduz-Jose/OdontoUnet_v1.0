import { useState, useEffect } from 'react';
import { getPatientsRequest } from '../api/patient';
import { createCita } from '../api/citas';

function NuevaCitaPage() {
    const [allPatients, setAllPatients] = useState([]);
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [citaData, setCitaData] = useState({
        motivo: '',
        odontograma: {},
        observaciones: '',
        monto: ''
    });

    // Cargar pacientes al iniciar la página
    useEffect(() => {
        const fetchPatients = async () => {
            const res = await getPatientsRequest();
            const patientsArray = res.data;
            setAllPatients(patientsArray);
            setPatients([]);
        };
        fetchPatients();
    }, []);

    const handlePatientSelect = (patient) => {
        setSelectedPatient(patient);
        setPatients([]); // Oculta lista de búsqueda
    };

    const handleDeselectPatient = () => {
        setSelectedPatient(null);
        setPatients([]);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCitaData(prev => ({ ...prev, [name]: value }));
    };

    const handleSearchChange = (e) => {
        const search = e.target.value.toLowerCase();
        if (!search) {
            setPatients([]);
        } else {
            const filtered = allPatients.filter(p =>
                p.nombre.toLowerCase().includes(search) ||
                p.apellido.toLowerCase().includes(search)
            );
            setPatients(filtered.slice(0, 5)); // limitar lista a 5 resultados
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedPatient) return alert('Selecciona un paciente');

        const fechaActual = new Date().toISOString();

        const newCita = {
            paciente: selectedPatient._id,
            ...citaData,
            fecha: fechaActual
        };

        try {
            const res = await createCita(newCita);
            console.log('Cita creada:', res);
            alert('Cita creada con éxito');
            // Opcional: redirigir a lista de citas
            handleDeselectPatient();
            setCitaData({ motivo: '', odontograma: {}, observaciones: '', monto: '' });
        } catch (err) {
            console.error(err);
            alert('Error al crear cita');
        }
    };

    return (
        <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
            <h1>Nueva Cita</h1>

            {!selectedPatient && (
                <div>
                    <h2>Buscar paciente</h2>
                    <input
                        type="text"
                        placeholder="Buscar paciente..."
                        onChange={handleSearchChange}
                        style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
                    />
                    <ul style={{ listStyle: "none", padding: 0 }}>
                        {patients.map(p => (
                            <li
                                key={p._id}
                                onClick={() => handlePatientSelect(p)}
                                style={{
                                    padding: "8px",
                                    border: "1px solid #ccc",
                                    marginBottom: "5px",
                                    cursor: "pointer",
                                    borderRadius: "4px"
                                }}
                            >
                                {p.nombre} {p.apellido} - {p.cedula}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {selectedPatient && (
                <div>
                    <button onClick={handleDeselectPatient} style={{ marginBottom: "20px" }}>
                        ← Buscar otro paciente
                    </button>

                    <h2>Paciente seleccionado</h2>
                    <p><strong>Nombre:</strong> {selectedPatient.nombre} {selectedPatient.apellido}</p>
                    <p><strong>Cédula:</strong> {selectedPatient.cedula}</p>
                    <p><strong>Teléfono:</strong> {selectedPatient.telefonoContacto}</p>
                    <p><strong>Edad:</strong> {selectedPatient.edad}</p>
                    <p><strong>Sexo:</strong> {selectedPatient.sexo}</p>
                    <p><strong>Dirección:</strong> {selectedPatient.direccion}</p>
                    <p><strong>Carrera:</strong> {selectedPatient.carrera}</p>
                    <p><strong>Grupo Sanguíneo:</strong> {selectedPatient.grupoSanguineo}</p>
                    <p><strong>Alergias:</strong> {selectedPatient.alergias}</p>
                    <p><strong>Enfermedades Crónicas:</strong> {selectedPatient.enfermedadesCronicas}</p>
                    <p><strong>Medicamentos:</strong> {selectedPatient.medicamentos}</p>
                    <p><strong>Condición Especial:</strong> {selectedPatient.condicionEspecial}</p>
                    <p><strong>Cirugías:</strong> {selectedPatient.cirugias}</p>
                    <p><strong>Antecedentes Familiares:</strong> {selectedPatient.antecedentesFamiliares}</p>
                    <p><strong>Fecha de registro de la cita:</strong> {new Date().toLocaleString()}</p>

                    <h2>Datos de la cita</h2>
                    <form onSubmit={handleSubmit}>
                        <label>
                            Motivo:
                            <input name="motivo" value={citaData.motivo} onChange={handleChange} required />
                        </label>
                        <label>
                            Observaciones:
                            <textarea name="observaciones" value={citaData.observaciones} onChange={handleChange} />
                        </label>
                        <label>
                            Monto:
                            <input type="number" name="monto" value={citaData.monto} onChange={handleChange} />
                        </label>
                        {/* Odontograma puede ser un componente aparte */}
                        <button type="submit">Crear Cita</button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default NuevaCitaPage;
