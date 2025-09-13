import { useState, useEffect } from 'react';
import { getInsumos } from '../api/insumos';

function InsumosPage() {
  const [insumos, setInsumos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    cantidadDisponible: '',
    unidadMedida: '',
    precioUnitario: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchInsumos();
  }, []);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Aquí necesitarías crear la función createInsumo en tu api/insumos.js
      const response = await fetch('http://localhost:3000/api/insumos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Para enviar cookies de autenticación
        body: JSON.stringify({
          ...formData,
          cantidadDisponible: Number(formData.cantidadDisponible),
          precioUnitario: Number(formData.precioUnitario) || 0
        })
      });

      if (response.ok) {
        const nuevoInsumo = await response.json();
        setInsumos(prev => [...prev, nuevoInsumo]);
        setFormData({
          nombre: '',
          descripcion: '',
          cantidadDisponible: '',
          unidadMedida: '',
          precioUnitario: ''
        });
        setShowForm(false);
        alert('Insumo creado exitosamente');
      } else {
        const error = await response.json();
        alert('Error: ' + (error.message || 'No se pudo crear el insumo'));
      }
    } catch (error) {
      console.error('Error al crear insumo:', error);
      alert('Error al crear el insumo');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      cantidadDisponible: '',
      unidadMedida: '',
      precioUnitario: ''
    });
    setShowForm(false);
  };

  if (loading) return <div className="text-center py-8">Cargando insumos...</div>;

  return (
    <div className="min-h-screen bg-[#202020] text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-500">Gestión de Insumos</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-semibold transition-colors"
          >
            {showForm ? 'Cancelar' : 'Agregar Insumo'}
          </button>
        </div>

        {/* Formulario para agregar insumos */}
        {showForm && (
          <div className="bg-zinc-900 p-6 rounded-lg mb-8">
            <h2 className="text-xl font-semibold mb-4">Agregar Nuevo Insumo</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nombre *</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 bg-zinc-800 border border-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: Amalgama dental"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Unidad de Medida *</label>
                <select
                  name="unidadMedida"
                  value={formData.unidadMedida}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 bg-zinc-800 border border-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccionar...</option>
                  <option value="unidades">Unidades</option>
                  <option value="ml">Mililitros (ml)</option>
                  <option value="gr">Gramos (gr)</option>
                  <option value="cajas">Cajas</option>
                  <option value="paquetes">Paquetes</option>
                  <option value="tubos">Tubos</option>
                  <option value="frascos">Frascos</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Cantidad Inicial *</label>
                <input
                  type="number"
                  name="cantidadDisponible"
                  value={formData.cantidadDisponible}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="w-full p-3 bg-zinc-800 border border-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: 50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Precio Unitario (opcional)</label>
                <input
                  type="number"
                  name="precioUnitario"
                  value={formData.precioUnitario}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full p-3 bg-zinc-800 border border-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: 15.50"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Descripción</label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full p-3 bg-zinc-800 border border-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Descripción detallada del insumo..."
                />
              </div>

              <div className="md:col-span-2 flex gap-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded font-semibold transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Creando...' : 'Crear Insumo'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-600 hover:bg-gray-700 px-6 py-2 rounded font-semibold transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Lista de insumos */}
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
                    : insumo.cantidadDisponible <= 5 
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
                        : insumo.cantidadDisponible <= 5 
                        ? 'text-yellow-400' 
                        : 'text-green-400'
                    }`}>
                      {insumo.cantidadDisponible} {insumo.unidadMedida}
                    </span>
                  </p>
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
                  ) : insumo.cantidadDisponible <= 5 ? (
                    <span className="inline-block px-3 py-1 bg-yellow-600 text-white text-sm rounded-full">
                      Stock bajo (≤5)
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
                {insumos.filter(i => i.cantidadDisponible > 5).length}
              </p>
              <p>Insumos disponibles</p>
            </div>
            <div className="bg-yellow-600 p-4 rounded">
              <p className="text-2xl font-bold">
                {insumos.filter(i => i.cantidadDisponible <= 5 && i.cantidadDisponible > 0).length}
              </p>
              <p>Stock bajo (≤5 unidades)</p>
            </div>
            <div className="bg-red-600 p-4 rounded">
              <p className="text-2xl font-bold">
                {insumos.filter(i => i.cantidadDisponible === 0).length}
              </p>
              <p>Agotados</p>
            </div>
          </div>
          
          {/* Explicación del criterio de stock bajo */}
          <div className="mt-4 p-4 bg-zinc-800 rounded">
            <p className="text-sm text-gray-400">
              <strong>Criterio de Stock Bajo:</strong> Insumos con 5 unidades o menos se consideran en stock bajo. 
              Esto te permite reabastecerte antes de quedarte sin existencias.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InsumosPage;