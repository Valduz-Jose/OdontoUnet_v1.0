import { useState, useEffect, useRef } from 'react';
import { getPatientsRequest, updatePatientRequest } from '../api/patient';
import { createCita, getCitasByPaciente } from '../api/citas';
import { getInsumos } from '../api/insumos';
import { useNavigate } from "react-router-dom";
import { drawTeeth, estadosDiente } from "../utils/odontogramaUtils";

function NuevaCitaPage() {
  const [allPatients, setAllPatients] = useState([]);
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [tratamientosUsados, setTratamientosUsados] = useState([]);
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
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  const teethCount = 32;
  const toothSize = 30; 
  const toothSpacing = 10;

  const opcionesTratamientos = [
    "Limpieza",
    "Restauración",
    "Exodoncia / Extracción"
  ];

  // Cargar pacientes
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await getPatientsRequest();
        setAllPatients(res.data);
      } catch (error) {
        console.error("Error al cargar pacientes:", error);
      }
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

  // Dibujar odontograma cada vez que cambie
  useEffect(() => {
    if (canvasRef.current && Object.keys(citaData.odontograma).length > 0) {
      drawOdontograma();
    }
  }, [citaData.odontograma]);

  // Seleccionar paciente y cargar odontograma actual
  const handlePatientSelect = async (patient) => {
    try {
      setSelectedPatient(patient);
      setPatients([]);
      setSearch('');

      // Obtener el odontograma más reciente del paciente
      let odontogramaActual = {};

      // 1. El odontograma actual del paciente ES el estado más reciente
      console.log("Odontograma del paciente:", patient.odontograma);
      
      if (patient.odontograma && patient.odontograma.length > 0) {
        // Usar el odontograma del paciente (que debería estar actualizado)
        patient.odontograma.forEach(d => {
          odontogramaActual[d.numero] = d.estado;
        });
        console.log("Odontograma cargado desde paciente:", odontogramaActual);
      } else {
        // Si no hay odontograma, inicializar todos como "Sano"
        for (let i = 1; i <= teethCount; i++) {
          odontogramaActual[i] = "Sano";
        }
        console.log("Odontograma inicializado como 'Sano'");
      }

      setCitaData(prev => ({
        ...prev,
        odontograma: odontogramaActual
      }));

      // Dibujar inmediatamente
      setTimeout(() => drawOdontograma(), 100);

    } catch (error) {
      console.error("Error al seleccionar paciente:", error);
      alert("Error al cargar datos del paciente");
    }
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
    setTratamientosUsados([]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCitaData(prev => ({ ...prev, [name]: value }));
  };

  // Tratamientos
  const handleAgregarTratamiento = (tratamiento) => {
    if (!tratamiento || tratamientosUsados.includes(tratamiento) || tratamientosUsados.length >= 3) return;
    setTratamientosUsados([...tratamientosUsados, tratamiento]);
  };

  const handleQuitarTratamiento = (tratamiento) => {
    setTratamientosUsados(tratamientosUsados.filter(t => t !== tratamiento));
  };

  // Insumos
  const handleAgregarInsumo = () => {
    if (!insumoSeleccionado || cantidadInsumo <= 0) return;
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

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPatient) return alert('Selecciona un paciente');

    try {
      const insumosParaBackend = insumosUsados.map(i => ({
        insumo: i._id,
        cantidad: i.cantidadUsada
      }));

      // Convertir odontograma de objeto a array
      const odontogramaArray = Object.entries(citaData.odontograma).map(
        ([numero, estado]) => ({
          numero: Number(numero),
          estado
        })
      );

      const newCita = {
        pacienteId: selectedPatient._id,
        motivo: citaData.motivo,
        odontograma: odontogramaArray,
        observaciones: citaData.observaciones,
        monto: Number(citaData.monto) || 0,
        numeroReferencia: citaData.referenciaPago,
        insumosUsados: insumosParaBackend,
        tratamientos: tratamientosUsados,
        fecha: new Date()
      };

      // Crear la cita (incluye actualización del paciente)
      await createCita(newCita);

      alert("Cita creada con éxito");
      navigate(`/paciente/${selectedPatient._id}/citas`);
    } catch (error) {
      console.error("Error al crear cita:", error);
      alert("Error al crear cita: " + (error.response?.data?.message || error.message));
    }
  };

  // Dibujar odontograma
  const drawOdontograma = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    canvas.width = 16 * (toothSize + toothSpacing) + 40;
    canvas.height = 120;
    
    drawTeeth(ctx, citaData.odontograma, toothSize, toothSpacing);
  };

  // Click en canvas para cambiar estado de diente
  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    for (let i = 1; i <= teethCount; i++) {
      const x = ((i - 1) % 16) * (toothSize + toothSpacing) + 20;
      const y = i <= 16 ? 20 : 80;
      
      if (clickX >= x && clickX <= x + toothSize && clickY >= y && clickY <= y + toothSize) {
        setCitaData(prev => {
          const currentState = prev.odontograma[i] || "Sano";
          const currentIndex = estadosDiente.indexOf(currentState);
          const nextState = estadosDiente[(currentIndex + 1) % estadosDiente.length];
          
          return {
            ...prev,
            odontograma: {
              ...prev.odontograma,
              [i]: nextState
            }
          };
        });
        break;
      }
    }
  };

  // Filtrar pacientes para búsqueda
  const filteredPatients = search.trim()
    ? allPatients.filter(p =>
        p.nombre?.toLowerCase().includes(search.toLowerCase()) ||
        p.apellido?.toLowerCase().includes(search.toLowerCase()) ||
        p.cedula?.includes(search)
      ).slice(0, 5)
    : [];

  return (
    <div className="min-h-screen p-6 bg-[#202020] text-gray-100 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-10 text-blue-500">Nueva Cita</h1>

      {/* Buscador de pacientes */}
      {!selectedPatient && (
        <div className="relative w-full max-w-2xl">
          <input
            type="text"
            placeholder="Buscar paciente por nombre, apellido o cédula..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-3 border border-gray-700 rounded bg-zinc-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {filteredPatients.length > 0 && (
            <ul className="absolute w-full max-h-64 overflow-y-auto bg-zinc-800 border border-gray-700 rounded mt-1 shadow-xl z-50">
              {filteredPatients.map(p => (
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

      {/* Formulario y odontograma */}
      {selectedPatient && (
        <div className="bg-zinc-900 p-6 rounded shadow-xl w-full max-w-4xl mt-6 flex flex-col gap-6">
          <button
            onClick={handleDeselectPatient}
            className="self-start px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
          >
            ← Buscar otro paciente
          </button>

          {/* Datos del paciente */}
          <h2 className="text-2xl font-semibold text-gray-200">Datos del paciente</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-100">
            <p><strong>Nombre:</strong> {selectedPatient.nombre} {selectedPatient.apellido}</p>
            <p><strong>Cédula:</strong> {selectedPatient.cedula}</p>
            <p><strong>Edad:</strong> {selectedPatient.edad}</p>
            <p><strong>Sexo:</strong> {selectedPatient.sexo}</p>
            <p><strong>Teléfono de contacto:</strong> {selectedPatient.telefonoContacto}</p>
            <p><strong>Teléfono de emergencia:</strong> {selectedPatient.telefonoEmergencia}</p>
            <p><strong>Dirección:</strong> {selectedPatient.direccion}</p>
            <p><strong>Carrera:</strong> {selectedPatient.carrera}</p>
            <p><strong>Grupo Sanguíneo:</strong> {selectedPatient.grupoSanguineo}</p>
          </div>

          {/* Odontograma */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-200 mb-4">Odontograma interactivo</h2>
            <p className="text-gray-400 text-sm mb-2">Haz clic en los dientes para cambiar su estado</p>
            <canvas
              ref={canvasRef}
              width={16 * (toothSize + toothSpacing) + 40}
              height={120}
              className="bg-zinc-800 rounded cursor-pointer border border-gray-600"
              onClick={handleCanvasClick}
            />
          </div>

          {/* Formulario de cita */}
          <h2 className="text-2xl font-semibold text-gray-200 mt-4">Datos de la cita</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
            <input
              name="motivo"
              value={citaData.motivo}
              onChange={handleChange}
              placeholder="Motivo de la cita"
              required
              className="w-full p-3 border border-gray-700 rounded bg-zinc-800 text-gray-100"
            />
            <textarea
              name="observaciones"
              value={citaData.observaciones}
              onChange={handleChange}
              placeholder="Observaciones"
              rows="3"
              className="w-full p-3 border border-gray-700 rounded bg-zinc-800 text-gray-100"
            />
            <input
              type="number"
              name="monto"
              value={citaData.monto}
              onChange={handleChange}
              placeholder="Monto (opcional)"
              min="0"
              step="0.01"
              className="w-full p-3 border border-gray-700 rounded bg-zinc-800 text-gray-100"
            />
            <input
              name="referenciaPago"
              value={citaData.referenciaPago}
              onChange={handleChange}
              placeholder="Número de referencia de pago (opcional)"
              className="w-full p-3 border border-gray-700 rounded bg-zinc-800 text-gray-100"
            />

            {/* Tratamientos */}
            <div className="mt-4">
              <label className="block mb-2 font-semibold">Tratamientos realizados:</label>
              <div className="flex gap-2">
                <select
                  className="flex-1 p-3 border border-gray-700 rounded bg-zinc-800 text-gray-100"
                  onChange={(e) => handleAgregarTratamiento(e.target.value)}
                  value=""
                >
                  <option value="">Seleccionar tratamiento</option>
                  {opcionesTratamientos.map((t, i) => (
                    <option key={i} value={t} disabled={tratamientosUsados.includes(t)}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              {tratamientosUsados.length > 0 && (
                <ul className="mt-2 space-y-2">
                  {tratamientosUsados.map((t, i) => (
                    <li key={i} className="flex justify-between items-center bg-zinc-700 p-2 rounded">
                      <span>{t}</span>
                      <button
                        type="button"
                        onClick={() => handleQuitarTratamiento(t)}
                        className="px-2 py-1 bg-red-600 rounded hover:bg-red-700"
                      >
                        Quitar
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Insumos */}
            <div>
              <label className="block mb-2 font-semibold">Insumos utilizados:</label>
              <div className="flex flex-col md:flex-row gap-2 md:items-end">
                <select
                  className="flex-1 p-3 border border-gray-700 rounded bg-zinc-800 text-gray-100"
                  value={insumoSeleccionado?._id || ''}
                  onChange={(e) => {
                    const insumo = insumosDisponibles.find(i => i._id === e.target.value);
                    setInsumoSeleccionado(insumo);
                  }}
                >
                  <option value="">Seleccionar insumo</option>
                  {insumosDisponibles.map(i => (
                    <option key={i._id} value={i._id}>
                      {i.nombre} ({i.cantidadDisponible} disponibles)
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min="1"
                  value={cantidadInsumo}
                  onChange={(e) => setCantidadInsumo(Number(e.target.value))}
                  placeholder="Cantidad"
                  className="w-32 p-3 border border-gray-700 rounded bg-zinc-800 text-gray-100"
                />
                <button
                  type="button"
                  onClick={handleAgregarInsumo}
                  disabled={!insumoSeleccionado || cantidadInsumo <= 0}
                  className="px-4 py-3 bg-blue-600 rounded hover:bg-blue-700 text-white disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                  Agregar
                </button>
              </div>

              {insumosUsados.length > 0 && (
                <div className="mt-4 bg-zinc-800 p-4 rounded">
                  <h3 className="font-semibold mb-2">Insumos a utilizar:</h3>
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
            </div>

            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 mt-4 font-semibold"
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