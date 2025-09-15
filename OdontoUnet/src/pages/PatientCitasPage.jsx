import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCitasByPaciente } from "../api/citas";
import { drawTeeth } from "../utils/odontogramaUtils";
import { ArrowLeft, Eye, Calendar, User, Phone, MapPin, Stethoscope, FileText } from "lucide-react";

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
    <div className="min-h-screen bg-pastel-mint p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            className="btn-pastel-secondary px-4 py-2 rounded-md font-medium transition-pastel flex items-center gap-2 mb-4"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={16} />
            Volver
          </button>

          <div className="card-pastel p-6 bg-pastel-blue">
            <h1 className="text-3xl font-bold text-pastel-primary mb-2 flex items-center gap-3">
              <Calendar className="text-blue-600" size={32} />
              Historial de Citas
            </h1>
            {paciente && (
              <div className="flex items-center gap-4 text-pastel-secondary">
                <p className="text-lg font-semibold">
                  {paciente.nombre} {paciente.apellido}
                </p>
                <span className="text-sm bg-pastel-green px-3 py-1 rounded-full text-green-700">
                  {citas.length} cita(s) registradas
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Contenido principal */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center gap-3 text-pastel-primary">
              <Stethoscope className="animate-pulse" size={32} />
              <span>Cargando historial de citas...</span>
            </div>
          </div>
        ) : citas.length === 0 ? (
          <div className="text-center py-12">
            <div className="card-pastel p-12 bg-pastel-yellow">
              <Calendar size={64} className="mx-auto text-pastel-muted mb-4" />
              <h3 className="text-xl font-semibold text-pastel-primary mb-4">
                No hay citas registradas
              </h3>
              <p className="text-pastel-secondary mb-6">
                Este paciente no tiene citas registradas en el sistema.
              </p>
              <button
                onClick={() => navigate('/citas')}
                className="btn-pastel-primary px-6 py-3 rounded-md font-medium transition-pastel"
              >
                Crear nueva cita
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {citas.map((cita) => (
              <div
                key={cita._id}
                className="card-pastel p-6 hover:shadow-lg transition-pastel"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-3 flex-1">
                    {/* Fecha y hora */}
                    <div className="flex items-center gap-3">
                      <Calendar className="text-blue-600" size={20} />
                      <div>
                        <p className="text-lg font-semibold text-pastel-primary">
                          {new Date(cita.fecha).toLocaleDateString('es-ES', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                        <p className="text-sm text-pastel-secondary">
                          {new Date(cita.fecha).toLocaleTimeString('es-ES', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Información básica */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-pastel-secondary">
                      <div className="flex items-center gap-2">
                        <Stethoscope size={16} />
                        <span><strong>Odontólogo:</strong> {cita.odontologo?.username || 'No especificado'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText size={16} />
                        <span><strong>Motivo:</strong> {cita.motivo}</span>
                      </div>
                      {cita.monto > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="text-green-600">💰</span>
                          <span><strong>Monto:</strong> ${cita.monto}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => setModalCita(cita)}
                    className="btn-pastel-info px-4 py-2 rounded-md font-medium transition-pastel flex items-center gap-2"
                  >
                    <Eye size={16} />
                    Ver detalles
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal de detalles */}
        {modalCita && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="card-pastel max-w-6xl w-full max-h-[95vh] overflow-y-auto">
              
              {/* Header del modal */}
              <div className="sticky top-0 bg-pastel-blue border-b border-pastel-mint-dark p-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-pastel-primary flex items-center gap-3">
                  <Calendar className="text-blue-600" size={24} />
                  Detalles de la Cita
                </h2>
                <button
                  onClick={() => setModalCita(null)}
                  className="btn-pastel-danger px-3 py-2 rounded-md font-bold transition-pastel"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 space-y-8">
                {/* Información de la cita */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="card-pastel p-6 bg-pastel-green">
                    <h3 className="text-xl font-semibold mb-4 text-pastel-primary flex items-center gap-2">
                      <Calendar size={20} />
                      Información de la cita
                    </h3>
                    <div className="space-y-3 text-pastel-secondary">
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
                  <div className="card-pastel p-6 bg-pastel-purple">
                    <h3 className="text-xl font-semibold mb-4 text-pastel-primary flex items-center gap-2">
                      <User size={20} />
                      Datos del paciente
                    </h3>
                    <div className="space-y-3 text-pastel-secondary">
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
                        <p className="text-pastel-muted">Información no disponible</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Tratamientos */}
                {modalCita.tratamientos && modalCita.tratamientos.length > 0 && (
                  <div className="card-pastel p-6 bg-pastel-yellow">
                    <h3 className="text-xl font-semibold mb-4 text-pastel-primary flex items-center gap-2">
                      <FileText size={20} />
                      Tratamientos realizados
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-pastel-secondary">
                      {modalCita.tratamientos.map((t, i) => (
                        <li key={i}>{t}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Odontograma */}
                <div className="card-pastel p-6 bg-pastel-pink">
                  <h3 className="text-xl font-semibold mb-4 text-pastel-primary flex items-center gap-2">
                    🦷 Odontograma
                  </h3>
                  <div className="bg-white p-4 rounded-lg border border-pastel-mint-dark">
                    {modalCita.odontograma && modalCita.odontograma.length > 0 ? (
                      <canvas
                        ref={canvasRef}
                        width={16 * (30 + 10) + 40}
                        height={120}
                        className="bg-gray-100 rounded mx-auto"
                      />
                    ) : (
                      <p className="text-pastel-muted text-center py-8">Sin información del odontograma</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
    {[
      { estado: "Sano", color: "#ffffff" },
      { estado: "Cariado", color: "#f87171" },
      { estado: "Obturado", color: "#2563eb" },
      { estado: "Extraído", color: "#9ca3af" },
      { estado: "Endodoncia", color: "#f97316" },
      { estado: "Corona", color: "#a78bfa" },
      { estado: "Fracturado", color: "#000000" },
      { estado: "Implante", color: "#22c55e" },
      { estado: "Sellado", color: "#38bdf8" },
      { estado: "Ausente", color: "#eab308" },
    ].map(({ estado, color }) => (
      <div key={estado} className="flex items-center gap-2">
        <span
          className="w-6 h-6 rounded-full border border-black"
          style={{ backgroundColor: color }}
        ></span>
        <span className="text-pastel-secondary text-sm">{estado}</span>
      </div>
    ))}
  </div>
                {/* Insumos usados */}
                {modalCita.insumosUsados && modalCita.insumosUsados.length > 0 && (
                  <div className="card-pastel p-6 bg-pastel-mint">
                    <h3 className="text-xl font-semibold mb-4 text-pastel-primary flex items-center gap-2">
                      📦 Insumos utilizados
                    </h3>
                    <div className="space-y-3">
                      {modalCita.insumosUsados.map((insumoUsado, idx) => (
                        <div key={idx} className="flex justify-between items-center card-pastel p-4 bg-pastel-blue">
                          <span className="font-medium text-pastel-primary">
                            {insumoUsado.insumo?.nombre || 'Insumo no especificado'}
                          </span>
                          <span className="text-sm bg-pastel-green px-3 py-1 rounded-full text-green-700">
                            Cantidad: {insumoUsado.cantidad}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PatientCitasPage;