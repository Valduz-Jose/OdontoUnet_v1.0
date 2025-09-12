import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCitasByPaciente } from "../api/citas";
import { drawTeeth } from "../utils/odontogramaUtils";

function PatientCitasPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [citas, setCitas] = useState([]);
  const [paciente, setPaciente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalCita, setModalCita] = useState(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const fetchCitas = async () => {
      try {
        const data = await getCitasByPaciente(id);
        if (data.length > 0) {
          setPaciente(data[0].paciente || data[0].pacienteDatos);
        }
        // Ordenar citas de más reciente a más antigua
        setCitas(data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)));
      } catch (error) {
        console.error("Error al obtener citas del paciente:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCitas();
  }, [id]);

  // Dibujar odontograma cuando se abre el modal
  useEffect(() => {
    if (!modalCita || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = 16 * (30 + 10) + 40;
    canvas.height = 120;

    // Preparar datos del odontograma para dibujar
    if (modalCita.odontograma && modalCita.odontograma.length > 0) {
      drawTeeth(ctx, modalCita.odontograma, 30, 10);
    } else {
      // Si no hay odontograma, crear uno por defecto
      const defaultOdontograma = {};
      for (let i = 1; i <= 32; i++) {
        defaultOdontograma[i] = "Sano";
      }
      drawTeeth(ctx, defaultOdontograma, 30, 10);
    }
  }, [modalCita]);

  return (
    <div className="min-h-screen bg-[#202020] text-white p-6 flex flex-col items-center">
      {/* Botón volver */}
      <button
        className="mb-6 px-4 py-2 bg-zinc-900 rounded hover:bg-zinc-800 transition"
        onClick={() => navigate(-1)}
      >
        ← Volver
      </button>

      {/* Título */}
      <h1 className="text-3xl font-bold mb-2 text-blue-500">
        Historial de Citas
        {paciente && ` - ${paciente.nombre || ''} ${paciente.apellido || ''}`}
      </h1>
      {!loading && citas.length > 0 && (
        <p className="mb-4 text-gray-400">{citas.length} cita(s) registradas</p>
      )}

      {/* Contenedor de citas */}
      {loading ? (
        <p>Cargando citas...</p>
      ) : citas.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-400 mb-4">No hay citas registradas para este paciente.</p>
          <button
            onClick={() => navigate('/citas')}
            className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Crear nueva cita
          </button>
        </div>
      ) : (
        <div className="w-full max-w-4xl space-y-4 max-h-[70vh] overflow-y-auto">
          {citas.map((cita) => (
            <div
              key={cita._id}
              className="bg-zinc-900 p-6 rounded-lg shadow-md border-b border-gray-700 transition hover:bg-zinc-800"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-2 flex-1">
                  <p className="text-lg font-semibold text-blue-400">
                    {new Date(cita.fecha).toLocaleDateString('es-ES', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <p className="text-gray-300">
                    <span className="font-semibold">Hora:</span>{' '}
                    {new Date(cita.fecha).toLocaleTimeString('es-ES', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                  <p className="text-gray-300">
                    <span className="font-semibold">Motivo:</span> {cita.motivo}
                  </p>
                  <p className="text-gray-300">
                    <span className="font-semibold">Odontólogo:</span>{' '}
                    {cita.odontologo?.username || 'No especificado'}
                  </p>
                  {cita.monto > 0 && (
                    <p className="text-gray-300">
                      <span className="font-semibold">Monto:</span> ${cita.monto}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => setModalCita(cita)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Ver detalles
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de detalles */}
      {modalCita && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 rounded-lg max-w-6xl w-full relative overflow-y-auto max-h-[95vh]">
            
            {/* Header del modal */}
            <div className="sticky top-0 bg-zinc-900 border-b border-gray-700 p-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-blue-400">Detalles de la Cita</h2>
              <button
                onClick={() => setModalCita(null)}
                className="px-3 py-1 bg-red-600 rounded hover:bg-red-700 text-white font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Información de la cita */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-300">Información de la cita</h3>
                  <div className="space-y-2 text-gray-100">
                    <p><strong>Fecha:</strong> {new Date(modalCita.fecha).toLocaleDateString('es-ES')}</p>
                    <p><strong>Hora:</strong> {new Date(modalCita.fecha).toLocaleTimeString('es-ES')}</p>
                    <p><strong>Odontólogo:</strong> {modalCita.odontologo?.username}</p>
                    <p><strong>Motivo:</strong> {modalCita.motivo}</p>
                    <p><strong>Observaciones:</strong> {modalCita.observaciones || 'Sin observaciones'}</p>
                    {modalCita.monto > 0 && <p><strong>Monto:</strong> ${modalCita.monto}</p>}
                    {modalCita.numeroReferencia && (
                      <p><strong>Referencia de pago:</strong> {modalCita.numeroReferencia}</p>
                    )}
                  </div>
                </div>

                {/* Datos del paciente */}
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-300">Datos del paciente</h3>
                  <div className="space-y-2 text-gray-100">
                    {modalCita.pacienteDatos ? (
                      <>
                        <p><strong>Nombre:</strong> {modalCita.pacienteDatos.nombre} {modalCita.pacienteDatos.apellido}</p>
                        <p><strong>Cédula:</strong> {modalCita.pacienteDatos.cedula}</p>
                        <p><strong>Edad:</strong> {modalCita.pacienteDatos.edad} años</p>
                        <p><strong>Sexo:</strong> {modalCita.pacienteDatos.sexo === 'M' ? 'Masculino' : 'Femenino'}</p>
                        <p><strong>Teléfono:</strong> {modalCita.pacienteDatos.telefonoContacto}</p>
                        <p><strong>Emergencia:</strong> {modalCita.pacienteDatos.telefonoEmergencia}</p>
                        <p><strong>Dirección:</strong> {modalCita.pacienteDatos.direccion}</p>
                        <p><strong>Carrera:</strong> {modalCita.pacienteDatos.carrera}</p>
                        <p><strong>Grupo sanguíneo:</strong> {modalCita.pacienteDatos.grupoSanguineo}</p>
                      </>
                    ) : modalCita.paciente ? (
                      <>
                        <p><strong>Nombre:</strong> {modalCita.paciente.nombre} {modalCita.paciente.apellido}</p>
                        <p><strong>Cédula:</strong> {modalCita.paciente.cedula}</p>
                      </>
                    ) : (
                      <p>Información no disponible</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Tratamientos */}
              {modalCita.tratamientos && modalCita.tratamientos.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-300">Tratamientos realizados</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-100">
                    {modalCita.tratamientos.map((t, i) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Odontograma */}
              <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-300">Odontograma</h3>
                <div className="bg-zinc-800 p-4 rounded border border-gray-600">
                  {modalCita.odontograma && modalCita.odontograma.length > 0 ? (
                    <canvas
                      ref={canvasRef}
                      width={16 * (30 + 10) + 40}
                      height={120}
                      className="bg-zinc-700 rounded mx-auto"
                    />
                  ) : (
                    <p className="text-gray-400 text-center py-8">Sin información del odontograma</p>
                  )}
                </div>
              </div>

              {/* Insumos usados */}
              {modalCita.insumosUsados && modalCita.insumosUsados.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-300">Insumos utilizados</h3>
                  <div className="bg-zinc-800 p-4 rounded">
                    <ul className="space-y-2">
                      {modalCita.insumosUsados.map((insumoUsado, idx) => (
                        <li key={idx} className="flex justify-between items-center bg-zinc-700 p-2 rounded">
                          <span className="text-gray-100">
                            {insumoUsado.insumo?.nombre || 'Insumo no especificado'}
                          </span>
                          <span className="text-gray-300">
                            Cantidad: {insumoUsado.cantidad}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PatientCitasPage;