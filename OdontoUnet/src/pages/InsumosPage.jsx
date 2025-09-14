import { useState, useEffect } from 'react';
import { getInsumos } from '../api/insumos';

function InsumosPage() {
  const [insumos, setInsumos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showRestockForm, setShowRestockForm] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    cantidadDisponible: '',
    unidadMedida: '',
    precioUnitario: ''
  });
  const [restockData, setRestockData] = useState({
    insumoId: '',
    cantidadAAgregar: ''
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

  const handleRestockChange = (e) => {
    const { name, value } = e.target;
    setRestockData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Verificar si el insumo ya existe
      const insumoExistente = insumos.find(i => 
        i.nombre.toLowerCase().trim() === formData.nombre.toLowerCase().trim()
      );

      if (insumoExistente) {
        alert(`El insumo "${formData.nombre}" ya existe. Usa la función "Reabastecer" para agregar más unidades.`);
        setSubmitting(false);
        return;
      }

      const response = await fetch('http://localhost:3000/api/insumos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          cantidadDisponible: Number(formData.cantidadDisponible),
          precioUnitario: Number(formData.precioUnitario) || 0
        })
      });

      if (response.ok) {
        const nuevoInsumo = await response.json();
        setInsumos(prev => [...prev, nuevoInsumo]);
        resetForm();
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

  const handleRestock = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch(`http://localhost:3000/api/insumos/${restockData.insumoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          cantidadDisponible: insumos.find(i => i._id === restockData.insumoId).cantidadDisponible + Number(restockData.cantidadAAgregar)
        })
      });

      if (response.ok) {
        const updatedInsumo = await response.json();
        setInsumos(prev => prev.map(insumo => 
          insumo._id === restockData.insumoId ? updatedInsumo : insumo
        ));
        
        const insumoNombre = insumos.find(i => i._id === restockData.insumoId)?.nombre;
        alert(`Se agregaron ${restockData.cantidadAAgregar} unidades a "${insumoNombre}"`);
        resetRestockForm();
      } else {
        const error = await response.json();
        alert('Error: ' + (error.message || 'No se pudo reabastecer el insumo'));
      }
    } catch (error) {
      console.error('Error al reabastecer insumo:', error);
      alert('Error al reabastecer el insumo');
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

  const resetRestockForm = () => {
    setRestockData({
      insumoId: '',
      cantidadAAgregar: ''
    });
    setShowRestockForm(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-pastel-mint p-6 flex items-center justify-center">
        <div className="text-pastel-primary">Cargando insumos...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pastel-mint p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <h1 className="text-3xl font-bold text-pastel-primary">Gestión de Insumos</h1>
          <div className="flex gap-3">
            <button
              onClick={() => {
                setShowRestockForm(!showRestockForm);
                if (showForm) setShowForm(false);
              }}
              className="btn-pastel-success px-4 py-2 rounded-lg font-semibold transition-pastel"
            >
              {showRestockForm ? 'Cancelar' : 'Reabastecer'}
            </button>
            <button
              onClick={() => {
                setShowForm(!showForm);
                if (showRestockForm) setShowRestockForm(false);
              }}
              className="btn-pastel-primary px-4 py-2 rounded-lg font-semibold transition-pastel"
            >
              {showForm ? 'Cancelar' : 'Nuevo Insumo'}
            </button>
          </div>
        </div>

        {/* Formulario para reabastecer insumos */}
        {showRestockForm && (
          <div className="card-pastel p-6 rounded-lg mb-8 bg-pastel-green border border-pastel-green-dark">
            <h2 className="text-xl font-semibold mb-4 text-pastel-primary">Reabastecer Insumo Existente</h2>
            <form onSubmit={handleRestock} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-pastel-primary">Seleccionar Insumo *</label>
                <select
                  name="insumoId"
                  value={restockData.insumoId}
                  onChange={handleRestockChange}
                  required
                  className="input-pastel w-full p-3 rounded"
                >
                  <option value="">Seleccionar insumo...</option>
                  {insumos
                    .sort((a, b) => a.nombre.localeCompare(b.nombre))
                    .map(insumo => (
                    <option key={insumo._id} value={insumo._id}>
                      {insumo.nombre} (Actual: {insumo.cantidadDisponible} {insumo.unidadMedida})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-pastel-primary">Cantidad a Agregar *</label>
                <input
                  type="number"
                  name="cantidadAAgregar"
                  value={restockData.cantidadAAgregar}
                  onChange={handleRestockChange}
                  required
                  min="1"
                  className="input-pastel w-full p-3 rounded"
                  placeholder="Ej: 25"
                />
              </div>

              <div className="md:col-span-2 flex gap-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-pastel-success px-6 py-2 rounded font-semibold transition-pastel disabled:opacity-50"
                >
                  {submitting ? 'Reabasteciendo...' : 'Reabastecer'}
                </button>
                <button
                  type="button"
                  onClick={resetRestockForm}
                  className="btn-pastel-secondary px-6 py-2 rounded font-semibold transition-pastel"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Formulario para agregar nuevo insumo */}
        {showForm && (
          <div className="card-pastel p-6 rounded-lg mb-8 bg-pastel-blue border border-pastel-blue-dark">
            <h2 className="text-xl font-semibold mb-4 text-pastel-primary">Agregar Nuevo Insumo</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-pastel-primary">Nombre *</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  required
                  className="input-pastel w-full p-3 rounded"
                  placeholder="Ej: Amalgama dental"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-pastel-primary">Unidad de Medida *</label>
                <select
                  name="unidadMedida"
                  value={formData.unidadMedida}
                  onChange={handleInputChange}
                  required
                  className="input-pastel w-full p-3 rounded"
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
                <label className="block text-sm font-medium mb-2 text-pastel-primary">Cantidad Inicial *</label>
                <input
                  type="number"
                  name="cantidadDisponible"
                  value={formData.cantidadDisponible}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="input-pastel w-full p-3 rounded"
                  placeholder="Ej: 50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-pastel-primary">Precio Unitario (opcional)</label>
                <input
                  type="number"
                  name="precioUnitario"
                  value={formData.precioUnitario}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="input-pastel w-full p-3 rounded"
                  placeholder="Ej: 15.50"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2 text-pastel-primary">Descripción</label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  rows="3"
                  className="input-pastel w-full p-3 rounded"
                  placeholder="Descripción detallada del insumo..."
                />
              </div>

              <div className="md:col-span-2 flex gap-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-pastel-primary px-6 py-2 rounded font-semibold transition-pastel disabled:opacity-50"
                >
                  {submitting ? 'Creando...' : 'Crear Insumo'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn-pastel-secondary px-6 py-2 rounded font-semibold transition-pastel"
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
            <p className="text-xl text-pastel-secondary">No hay insumos registrados</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {insumos.map((insumo) => (
              <div
                key={insumo._id}
                className={`card-pastel p-6 rounded-lg border-l-4 ${
                  insumo.cantidadDisponible === 0 
                    ? 'border-red-400 bg-pastel-pink' 
                    : insumo.cantidadDisponible <= 5 
                    ? 'border-yellow-400 bg-pastel-yellow' 
                    : 'border-green-400 bg-pastel-green'
                }`}
              >
                <h3 className="text-xl font-semibold mb-3 text-pastel-primary">
                  {insumo.nombre}
                </h3>
                
                <div className="space-y-2 text-pastel-secondary">
                  <p><strong>Descripción:</strong> {insumo.descripcion || 'Sin descripción'}</p>
                  <p><strong>Cantidad disponible:</strong> 
                    <span className={`ml-2 font-bold ${
                      insumo.cantidadDisponible === 0 
                        ? 'text-red-600' 
                        : insumo.cantidadDisponible <= 5 
                        ? 'text-yellow-600' 
                        : 'text-green-600'
                    }`}>
                      {insumo.cantidadDisponible} {insumo.unidadMedida}
                    </span>
                  </p>
                  {insumo.precioUnitario > 0 && (
                    <p><strong>Precio unitario:</strong> ${insumo.precioUnitario}</p>
                  )}
                  <p className="text-sm text-pastel-muted">
                    <strong>Registrado por:</strong> {insumo.user?.username}
                  </p>
                </div>

                {/* Estado del insumo */}
                <div className="mt-4 flex justify-between items-center">
                  <div>
                    {insumo.cantidadDisponible === 0 ? (
                      <span className="inline-block px-3 py-1 bg-red-500 text-white text-sm rounded-full">
                        Agotado
                      </span>
                    ) : insumo.cantidadDisponible <= 5 ? (
                      <span className="inline-block px-3 py-1 bg-yellow-500 text-white text-sm rounded-full">
                        Stock bajo (≤5)
                      </span>
                    ) : (
                      <span className="inline-block px-3 py-1 bg-green-500 text-white text-sm rounded-full">
                        Disponible
                      </span>
                    )}
                  </div>
                  
                  {/* Botón rápido para reabastecer */}
                  <button
                    onClick={() => {
                      setRestockData({ insumoId: insumo._id, cantidadAAgregar: '' });
                      setShowRestockForm(true);
                      setShowForm(false);
                    }}
                    className="btn-pastel-success px-3 py-1 rounded text-sm transition-pastel"
                    title="Reabastecer este insumo"
                  >
                    + Stock
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Resumen general */}
        <div className="mt-8 card-pastel p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-pastel-primary">Resumen del Inventario</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-pastel-green p-4 rounded">
              <p className="text-2xl font-bold text-green-700">
                {insumos.filter(i => i.cantidadDisponible > 5).length}
              </p>
              <p className="text-pastel-secondary">Insumos disponibles</p>
            </div>
            <div className="bg-pastel-yellow p-4 rounded">
              <p className="text-2xl font-bold text-yellow-700">
                {insumos.filter(i => i.cantidadDisponible <= 5 && i.cantidadDisponible > 0).length}
              </p>
              <p className="text-pastel-secondary">Stock bajo (≤5 unidades)</p>
            </div>
            <div className="bg-pastel-pink p-4 rounded">
              <p className="text-2xl font-bold text-red-700">
                {insumos.filter(i => i.cantidadDisponible === 0).length}
              </p>
              <p className="text-pastel-secondary">Agotados</p>
            </div>
          </div>
          
          {/* Explicación del criterio de stock bajo */}
          <div className="mt-4 p-4 bg-pastel-blue rounded">
            <p className="text-sm text-pastel-secondary">
              <strong>Criterio de Stock Bajo:</strong> Insumos con 5 unidades o menos se consideran en stock bajo. 
              Esto te permite reabastecerte antes de quedarte sin existencias.
            </p>
            <p className="text-sm text-pastel-secondary mt-2">
              <strong>Funcionalidades:</strong> Usa "Nuevo Insumo" para agregar productos nuevos y "Reabastecer" para añadir stock a productos existentes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InsumosPage;