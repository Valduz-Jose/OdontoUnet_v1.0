import { useState, useEffect } from 'react';
import { getInsumos } from '../api/insumos';

function InsumosPage() {
  const [insumos, setInsumos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsumos = async () => {
      try {
        const data = await getInsumos();
        setInsumos(data);
      } catch (error) {
        console.error('Error al obtener insumos:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchInsumos();
  }, []);

  if (loading) return <div className="text-center py-8">Cargando insumos...</div>;

  return (
    <div className="min-h-screen bg-[#202020] text-white p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-blue-500">Gestión de Insumos</h1>
        
        {insumos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-400">No hay insumos registrados</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {insumos.map((insumo) => (
              <div
                key={insumo._id}
                className={`bg-zinc-900 p-6 rounded-lg shadow-md border-l-4 ${
                  insumo.cantidadDisponible === 0 
                    ? 'border-red-500' 
                    : insumo.cantidadDisponible <= 10 
                    ? 'border-yellow-500' 
                    : 'border-green-500'
                }`}
              >
                <h3 className="text-xl font-semibold mb-3 text-white">
                  {insumo.nombre}
                </h3>
                
                <div className="space-y-2 text-gray-300">
                  <p><strong>Descripción:</strong> {insumo.descripcion || 'Sin descripción'}</p>
                  <p><strong>Cantidad disponible:</strong> 
                    <span className={`ml-2 font-bold ${
                      insumo.cantidadDisponible === 0 
                        ? 'text-red-400' 
                        : insumo.cantidadDisponible <= 10 
                        ? 'text-yellow-400' 
                        : 'text-green-400'
                    }`}>
                      {insumo.cantidadDisponible}
                    </span>
                  </p>
                  <p><strong>Unidad de medida:</strong> {insumo.unidadMedida}</p>
                  {insumo.precioUnitario > 0 && (
                    <p><strong>Precio unitario:</strong> ${insumo.precioUnitario}</p>
                  )}
                  <p className="text-sm text-gray-400">
                    <strong>Registrado por:</strong> {insumo.user?.username}
                  </p>
                </div>

                {/* Estado del insumo */}
                <div className="mt-4">
                  {insumo.cantidadDisponible === 0 ? (
                    <span className="inline-block px-3 py-1 bg-red-600 text-white text-sm rounded-full">
                      Agotado
                    </span>
                  ) : insumo.cantidadDisponible <= 10 ? (
                    <span className="inline-block px-3 py-1 bg-yellow-600 text-white text-sm rounded-full">
                      Stock bajo
                    </span>
                  ) : (
                    <span className="inline-block px-3 py-1 bg-green-600 text-white text-sm rounded-full">
                      Disponible
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Resumen general */}
        <div className="mt-8 bg-zinc-900 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Resumen del Inventario</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-green-600 p-4 rounded">
              <p className="text-2xl font-bold">
                {insumos.filter(i => i.cantidadDisponible > 10).length}
              </p>
              <p>Insumos disponibles</p>
            </div>
            <div className="bg-yellow-600 p-4 rounded">
              <p className="text-2xl font-bold">
                {insumos.filter(i => i.cantidadDisponible <= 10 && i.cantidadDisponible > 0).length}
              </p>
              <p>Stock bajo</p>
            </div>
            <div className="bg-red-600 p-4 rounded">
              <p className="text-2xl font-bold">
                {insumos.filter(i => i.cantidadDisponible === 0).length}
              </p>
              <p>Agotados</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InsumosPage;