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
          setPaciente(data[0].paciente);
        }
        setCitas(data.reverse()); // última cita primero
      } catch (error) {
        console.error("Error al obtener citas del paciente:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCitas();
  }, [id]);

useEffect(() => {
  if (!modalCita || !canvasRef.current) return;
  const canvas = canvasRef.current;
  const ctx = canvas.getContext("2d");
  canvas.width = 16 * (30 + 10) + 40;
  canvas.height = 120;

  const odontogramaData = {};
  if (Array.isArray(modalCita.odontograma)) {
    modalCita.odontograma.forEach(d => {
      odontogramaData[d.numero] = d.estado;
    });
  }

  drawTeeth(ctx, odontogramaData);
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
        Historial de Citas {paciente ? `- ${paciente.nombre} ${paciente.apellido}` : ""}
      </h1>
      {!loading && citas.length > 0 && (
        <p className="mb-4 text-gray-400">{citas.length} cita(s) registradas</p>
      )}

      {/* Contenedor de citas */}
      {loading ? (
        <p>Cargando citas...</p>
      ) : citas.length === 0 ? (
        <p>No hay citas registradas para este paciente.</p>
      ) : (
        <div className="w-full max-w-4xl space-y-4 max-h-[70vh] overflow-y-auto">
          {citas.map((cita) => (
            <div
              key={cita._id}
              className="bg-zinc-900 p-6 rounded-lg shadow-md border-b border-gray-700 transition hover:bg-zinc-800 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <p>
                  <span className="font-semibold text-gray-300">Fecha:</span>{" "}
                  {new Date(cita.fecha).toLocaleString()}
                </p>
                <p>
                  <span className="font-semibold text-gray-300">Motivo:</span> {cita.motivo}
                </p>
              </div>

              <button
                onClick={() => setModalCita(cita)}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 self-start"
              >
                Ver más
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal de detalles */}
      {modalCita && (
  <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
    <div className="bg-zinc-900 p-6 rounded-lg max-w-4xl w-full relative overflow-y-auto max-h-[90vh]">
      
      {/* Botón cerrar */}
      <button
        onClick={() => setModalCita(null)}
        className="absolute top-2 right-2 px-2 py-1 bg-red-600 rounded hover:bg-red-700"
      >
        X
      </button>

      {/* Título */}
      <h2 className="text-2xl font-bold mb-4 text-blue-400">Detalles de la Cita</h2>

      {/* Datos del paciente */}
      <h3 className="text-xl font-semibold mt-2 text-gray-300">Datos del paciente</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-100">
        <p><strong>Nombre:</strong> {modalCita.pacienteDatos?.nombre} {modalCita.pacienteDatos?.apellido}</p>
        <p><strong>Cédula:</strong> {modalCita.pacienteDatos?.cedula}</p>
        <p><strong>Edad:</strong> {modalCita.pacienteDatos?.edad}</p>
        <p><strong>Sexo:</strong> {modalCita.pacienteDatos?.sexo}</p>
        <p><strong>Teléfono de contacto:</strong> {modalCita.pacienteDatos?.telefonoContacto}</p>
        <p><strong>Teléfono de emergencia:</strong> {modalCita.pacienteDatos?.telefonoEmergencia}</p>
        <p><strong>Dirección:</strong> {modalCita.pacienteDatos?.direccion}</p>
        <p><strong>Carrera:</strong> {modalCita.pacienteDatos?.carrera}</p>
        <p><strong>Grupo Sanguíneo:</strong> {modalCita.pacienteDatos?.grupoSanguineo}</p>
      </div>

      {/* Datos de la cita */}
      <h3 className="text-xl font-semibold mt-4 text-gray-300">Detalles de la cita</h3>
      <p><strong>Odontólogo:</strong> {modalCita.odontologo?.username}</p>
      <p><strong>Motivo:</strong> {modalCita.motivo}</p>
      <p><strong>Observaciones:</strong> {modalCita.observaciones || '-'}</p>
      <p><strong>Monto:</strong> ${modalCita.monto}</p>
      <p><strong>Número de referencia:</strong> {modalCita.numeroReferencia || '-'}</p>

      {/* Tratamientos */}
      <p><strong>Tratamientos realizados:</strong></p>
      {modalCita.tratamientos && modalCita.tratamientos.length > 0 ? (
        <ul className="list-disc list-inside ml-4">
          {modalCita.tratamientos.map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ul>
      ) : (
        <p>-</p>
      )}

      {/* Odontograma */}
      {modalCita.odontograma && modalCita.odontograma.length > 0 && (
        <>
          <h4 className="mt-4 font-semibold text-gray-300">Odontograma</h4>
          <div className="overflow-x-auto w-full">
            <canvas
              ref={canvasRef}
              width={16 * (30 + 10) + 40} // ajustar según tu tamaño de diente y espaciado
              height={120}
              className="bg-zinc-800 rounded mt-2"
            />
          </div>
        </>
      )}

      {/* Insumos usados */}
      {modalCita.insumosUsados && modalCita.insumosUsados.length > 0 && (
        <>
          <h4 className="mt-4 font-semibold text-gray-300">Insumos usados</h4>
          <ul className="list-disc list-inside">
            {modalCita.insumosUsados.map((i, idx) => (
              <li key={i.insumo?._id || idx}>
                {i.insumo?.nombre} - Cantidad: {i.cantidad}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  </div>
)}

    </div>
  );
}

export default PatientCitasPage;
