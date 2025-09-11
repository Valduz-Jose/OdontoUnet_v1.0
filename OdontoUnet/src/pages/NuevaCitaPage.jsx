import { useState, useEffect, useRef } from 'react';
import { getPatientsRequest } from '../api/patient';
import { createCita } from '../api/citas';
import { getInsumos } from '../api/insumos';
import { useNavigate } from "react-router-dom";

function NuevaCitaPage() {
  const [allPatients, setAllPatients] = useState([]);
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [citaData, setCitaData] = useState({
    motivo: '',
    odontograma: {},
    observaciones: '',
    monto: '',
    tratamientos: '',
    referenciaPago: ''
  });
  const [insumosDisponibles, setInsumosDisponibles] = useState([]);
  const [insumoSeleccionado, setInsumoSeleccionado] = useState(null);
  const [cantidadInsumo, setCantidadInsumo] = useState(1);
  const [insumosUsados, setInsumosUsados] = useState([]);

  const [search, setSearch] = useState('');
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Cargar pacientes
  useEffect(() => {
    const fetchPatients = async () => {
      const res = await getPatientsRequest();
      setAllPatients(res.data);
      setPatients([]);
    };
    fetchPatients();
  }, []);

  // Cargar insumos
  useEffect(() => {
    const fetchInsumos = async () => {
      try {
        const data = await getInsumos();
        setInsumosDisponibles(data);
      } catch (error) {
        console.error("Error al obtener insumos:", error);
      }
    };
    fetchInsumos();
  }, []);

  // Filtrar pacientes según búsqueda
  useEffect(() => {
    if (!search) return setPatients([]);
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
    setCitaData({
      motivo: '',
      odontograma: {},
      observaciones: '',
      monto: '',
      tratamientos: '',
      referenciaPago: ''
    });
    setInsumosUsados([]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCitaData(prev => ({ ...prev, [name]: value }));
  };

const handleAgregarInsumo = () => {
  if (!insumoSeleccionado || cantidadInsumo <= 0) return;

  // Evitar duplicados: si el insumo ya está en la lista, sumar la cantidad
  setInsumosUsados(prev => {
    const existing = prev.find(i => i._id === insumoSeleccionado._id);
    if (existing) {
      return prev.map(i =>
        i._id === insumoSeleccionado._id
          ? { ...i, cantidadUsada: i.cantidadUsada + cantidadInsumo }
          : i
      );
    } else {
      return [...prev, { ...insumoSeleccionado, cantidadUsada: cantidadInsumo }];
    }
  });

  setInsumoSeleccionado(null);
  setCantidadInsumo(1);
};


  const handleQuitarInsumo = (index) => {
    setInsumosUsados(prev => prev.filter((_, i) => i !== index));
  };

    const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedPatient) return alert('Selecciona un paciente');

    // Transformar insumos al formato que espera el backend
    const insumosParaBackend = insumosUsados.map(i => ({
        insumo: i._id,
        cantidad: i.cantidadUsada
    }));

    const newCita = {
        pacienteId: selectedPatient._id,
        motivo: citaData.motivo,
        odontograma: citaData.odontograma,
        observaciones: citaData.observaciones,
        monto: Number(citaData.monto),
        numeroReferencia: citaData.referenciaPago,
        insumosUsados: insumosParaBackend,
        fecha: new Date()
    };

    try {
        const res = await createCita(newCita);
        console.log('Cita creada:', res);
        alert('Cita creada con éxito');
        navigate(`/paciente/${selectedPatient._id}/citas`);
    } catch (err) {
        console.error(err);
        alert('Error al crear cita');
    }
    };


  return (
    <div className="min-h-screen p-6 bg-[#202020] text-gray-100 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-10 text-blue-500">Nueva Cita</h1>

      {/* Buscador de pacientes */}
      {!selectedPatient && (
        <div className="relative w-full max-w-2xl">
          <input
            type="text"
            placeholder="Buscar paciente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-3 border border-gray-700 rounded bg-zinc-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {patients.length > 0 && (
            <ul
              ref={dropdownRef}
              className="absolute w-full max-h-64 overflow-y-auto bg-zinc-800 border border-gray-700 rounded mt-1 shadow-xl z-50"
            >
              {patients.map(p => (
                <li
                  key={p._id}
                  onClick={() => handlePatientSelect(p)}
                  className="px-4 py-3 cursor-pointer hover:bg-zinc-700 flex justify-between"
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
        <div className="bg-zinc-900 p-6 rounded shadow-xl w-full max-w-3xl mt-6 flex flex-col gap-6">
          <button
            onClick={handleDeselectPatient}
            className="self-start px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
          >
            ← Buscar otro paciente
          </button>

          <h2 className="text-2xl font-semibold text-gray-200">Paciente seleccionado</h2>
          <p><strong>Nombre:</strong> {selectedPatient.nombre} {selectedPatient.apellido}</p>
          <p><strong>Cédula:</strong> {selectedPatient.cedula}</p>
          <p><strong>Teléfono:</strong> {selectedPatient.telefonoContacto}</p>

          <h2 className="text-2xl font-semibold text-gray-200 mt-4">Datos de la cita</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              name="motivo"
              value={citaData.motivo}
              onChange={handleChange}
              placeholder="Motivo"
              required
              className="w-full p-3 border border-gray-700 rounded bg-zinc-800"
            />
            <input
              type="number"
              name="monto"
              value={citaData.monto}
              onChange={handleChange}
              placeholder="Monto"
              className="w-full p-3 border border-gray-700 rounded bg-zinc-800"
            />
            <input
              name="referenciaPago"
              value={citaData.referenciaPago}
              onChange={handleChange}
              placeholder="Número de referencia de pago"
              className="w-full p-3 border border-gray-700 rounded bg-zinc-800"
            />
            <textarea
              name="tratamientos"
              value={citaData.tratamientos}
              onChange={handleChange}
              placeholder="Tratamientos realizados"
              className="w-full p-3 border border-gray-700 rounded bg-zinc-800"
            />

            {/* Selección de insumos */}
            <div className="flex flex-col md:flex-row gap-2 md:items-end">
              <select
                className="flex-1 p-3 border border-gray-700 rounded bg-zinc-800"
                value={insumoSeleccionado?._id || ''}
                onChange={(e) => {
                  const insumo = insumosDisponibles.find(i => i._id === e.target.value);
                  setInsumoSeleccionado(insumo);
                }}
              >
                <option value="">Seleccionar insumo</option>
                {insumosDisponibles.map(i => (
                  <option key={i._id} value={i._id}>{i.nombre} ({i.cantidadDisponible} disponibles)</option>
                ))}
              </select>
              <input
                type="number"
                min="1"
                value={cantidadInsumo}
                onChange={(e) => setCantidadInsumo(Number(e.target.value))}
                placeholder="Cantidad"
                className="w-32 p-3 border border-gray-700 rounded bg-zinc-800"
              />
              <button
                type="button"
                onClick={handleAgregarInsumo}
                className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 text-white"
              >
                Agregar
              </button>
            </div>

            {/* Lista de insumos usados */}
            {insumosUsados.length > 0 && (
              <div className="mt-4 bg-zinc-800 p-4 rounded">
                <h3 className="font-semibold mb-2">Insumos usados:</h3>
                <ul className="space-y-2">
                  {insumosUsados.map((i, index) => (
                    <li key={index} className="flex justify-between items-center bg-zinc-700 p-2 rounded">
                      <span>{i.nombre} - Cantidad: {i.cantidadUsada}</span>
                      <button
                        type="button"
                        onClick={() => handleQuitarInsumo(index)}
                        className="px-2 py-1 bg-red-600 rounded hover:bg-red-700"
                      >
                        Quitar
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 mt-4"
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
