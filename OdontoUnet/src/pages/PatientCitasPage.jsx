import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCitasByPaciente } from "../api/citas";

function PatientCitasPage() {
  const { id } = useParams(); // id del paciente
  const navigate = useNavigate();
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCitas = async () => {
      try {
        const data = await getCitasByPaciente(id);
        setCitas(data);
      } catch (error) {
        console.error("Error al obtener citas del paciente:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCitas();
  }, [id]);

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
      <h1 className="text-3xl font-bold mb-2 text-blue-500">Historial de Citas</h1>
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
              className="bg-zinc-900 p-6 rounded-lg shadow-md flex flex-col md:flex-row md:justify-between md:items-center border-b border-gray-700 transition hover:bg-zinc-800"
            >
              <div className="space-y-2">
                <p>
                  <span className="font-semibold text-gray-300">Fecha:</span>{" "}
                  {new Date(cita.fecha).toLocaleString()}
                </p>
                <p>
                  <span className="font-semibold text-gray-300">Motivo:</span> {cita.motivo}
                </p>
                <p>
                  <span className="font-semibold text-gray-300">Observaciones:</span>{" "}
                  {cita.observaciones || "-"}
                </p>
              </div>

              <div className="space-y-2 mt-4 md:mt-0 text-right">
                <p>
                  <span className="font-semibold text-gray-300">Odontólogo:</span>{" "}
                  {cita.odontologo.username}
                </p>
                <p>
                  <span className="font-semibold text-gray-300">Monto:</span> ${cita.monto}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PatientCitasPage;
