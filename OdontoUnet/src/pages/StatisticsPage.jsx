import { useState, useEffect } from 'react';
import { Calendar, Users, Package, TrendingUp, Clock, DollarSign, Activity, BarChart, RefreshCw, AlertTriangle } from 'lucide-react';

function StatisticsPage() {
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: '',
    period: 'month'
  });
  const [stats, setStats] = useState({
    pacientesAtendidos: 0,
    citasRealizadas: 0,
    insumosUsados: [],
    diasMasConcurridos: [],
    ingresosTotales: 0,
    promedioIngresoDiario: 0,
    pacientesPorMes: [],
    insumosAgotados: 0,
    odontologosActivos: 0,
    promedioCitasPorPaciente: 0,
    montoPromedioPorCita: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [initialized, setInitialized] = useState(false);

  // Inicializar fechas
  useEffect(() => {
    const today = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(today.getMonth() - 1);

    const startDateStr = lastMonth.toISOString().split('T')[0];
    const endDateStr = today.toISOString().split('T')[0];
    
    setDateRange({
      startDate: startDateStr,
      endDate: endDateStr,
      period: 'month'
    });
    setInitialized(true);
  }, []);

  // Cargar estadísticas cuando se inicializa o cambian las fechas
  useEffect(() => {
    if (initialized && dateRange.startDate && dateRange.endDate) {
      fetchStatistics();
    }
  }, [initialized, dateRange.startDate, dateRange.endDate]);

  const fetchStatistics = async () => {
    if (!dateRange.startDate || !dateRange.endDate) {
      setError('Por favor selecciona fechas válidas');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const params = new URLSearchParams({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        period: dateRange.period
      });

      console.log('Enviando parámetros:', params.toString());

      const response = await fetch(`http://localhost:3000/api/statistics?${params}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Datos recibidos:', data);
      
      // Asegurarnos de que todos los campos existan
      setStats({
        pacientesAtendidos: data.pacientesAtendidos || 0,
        citasRealizadas: data.citasRealizadas || 0,
        insumosUsados: data.insumosUsados || [],
        diasMasConcurridos: data.diasMasConcurridos || [],
        ingresosTotales: data.ingresosTotales || 0,
        promedioIngresoDiario: data.promedioIngresoDiario || 0,
        pacientesPorMes: data.pacientesPorMes || [],
        insumosAgotados: data.insumosAgotados || 0,
        odontologosActivos: data.odontologosActivos || 0,
        promedioCitasPorPaciente: data.promedioCitasPorPaciente || 0,
        montoPromedioPorCita: data.montoPromedioPorCita || 0
      });

    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
      setError(error.message || 'Error al cargar las estadísticas');
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({ ...prev, [name]: value }));
  };

  const handlePeriodChange = (period) => {
    const today = new Date();
    let startDate = new Date();

    switch (period) {
      case 'day':
        startDate.setDate(today.getDate() - 1);
        break;
      case 'week':
        startDate.setDate(today.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(today.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(today.getFullYear() - 1);
        break;
      default:
        startDate.setDate(today.getDate() - 1);
    }

    setDateRange({
      startDate: startDate.toISOString().split('T')[0],
      endDate: today.toISOString().split('T')[0],
      period
    });
  };

  const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  return (
    <div className="min-h-screen bg-pastel-mint p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-pastel-primary mb-2 flex items-center gap-3">
            <BarChart className="text-blue-600" size={36} />
            Estadísticas y Reportes
          </h1>
          <p className="text-pastel-secondary">
            Análisis detallado del rendimiento y actividad de la clínica
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 card-pastel bg-pastel-pink border-red-300 p-4 rounded-lg flex items-center gap-3">
            <AlertTriangle className="text-red-600 flex-shrink-0" size={20} />
            <div>
              <p className="text-red-700 font-medium">Error al cargar estadísticas</p>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Controles de filtros */}
        <div className="card-pastel p-6 mb-8 bg-pastel-blue">
          <h2 className="text-xl font-semibold mb-4 flex items-center text-pastel-primary">
            <Calendar className="mr-2" size={20} />
            Filtros de Tiempo
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Botones de períodos rápidos */}
            <div className="md:col-span-4 mb-4">
              <p className="text-sm text-pastel-secondary mb-3">Períodos predefinidos:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { key: 'day', label: 'Última 24h' },
                  { key: 'week', label: 'Última semana' },
                  { key: 'month', label: 'Último mes' },
                  { key: 'year', label: 'Último año' }
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => handlePeriodChange(key)}
                    disabled={loading}
                    className={`px-4 py-2 rounded-md font-medium transition-pastel disabled:opacity-50 ${
                      dateRange.period === key
                        ? 'btn-pastel-primary'
                        : 'btn-pastel-secondary'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Fechas personalizadas */}
            <div>
              <label className="block text-sm font-medium mb-2 text-pastel-primary">Fecha inicio</label>
              <input
                type="date"
                name="startDate"
                value={dateRange.startDate}
                onChange={handleDateChange}
                disabled={loading}
                className="input-pastel w-full p-3 disabled:opacity-50"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-pastel-primary">Fecha fin</label>
              <input
                type="date"
                name="endDate"
                value={dateRange.endDate}
                onChange={handleDateChange}
                disabled={loading}
                className="input-pastel w-full p-3 disabled:opacity-50"
              />
            </div>

            <div className="md:col-span-2 flex items-end">
              <button
                onClick={fetchStatistics}
                disabled={loading || !dateRange.startDate || !dateRange.endDate}
                className="w-full btn-pastel-primary px-6 py-3 rounded-lg font-semibold transition-pastel flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <RefreshCw className={loading ? 'animate-spin' : ''} size={18} />
                {loading ? 'Actualizando...' : 'Actualizar Estadísticas'}
              </button>
            </div>
          </div>

          {/* Info del período actual */}
          <div className="mt-4 p-3 bg-white rounded-lg">
            <p className="text-sm text-pastel-secondary">
              <strong>Período actual:</strong> {dateRange.startDate && dateRange.endDate ? 
                `${new Date(dateRange.startDate).toLocaleDateString('es-ES')} - ${new Date(dateRange.endDate).toLocaleDateString('es-ES')}` : 
                'Selecciona fechas'}
            </p>
          </div>
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="text-center py-16">
            <div className="card-pastel p-12 bg-pastel-blue">
              <RefreshCw className="animate-spin mx-auto mb-4 text-pastel-primary" size={48} />
              <p className="text-pastel-primary text-lg">Cargando estadísticas...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Tarjetas de estadísticas principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="card-pastel p-6 bg-pastel-blue hover:shadow-lg transition-pastel">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-pastel-secondary mb-1">Pacientes Atendidos</p>
                    <p className="text-3xl font-bold text-blue-700">{stats.pacientesAtendidos}</p>
                    {stats.promedioCitasPorPaciente > 0 && (
                      <p className="text-xs text-pastel-muted mt-1">
                        Promedio: {stats.promedioCitasPorPaciente} citas/paciente
                      </p>
                    )}
                  </div>
                  <Users size={40} className="text-blue-600" />
                </div>
              </div>

              <div className="card-pastel p-6 bg-pastel-green hover:shadow-lg transition-pastel">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-pastel-secondary mb-1">Citas Realizadas</p>
                    <p className="text-3xl font-bold text-green-700">{stats.citasRealizadas}</p>
                    {stats.montoPromedioPorCita > 0 && (
                      <p className="text-xs text-pastel-muted mt-1">
                        Promedio: {formatCurrency(stats.montoPromedioPorCita)}/cita
                      </p>
                    )}
                  </div>
                  <Calendar size={40} className="text-green-600" />
                </div>
              </div>

              <div className="card-pastel p-6 bg-pastel-purple hover:shadow-lg transition-pastel">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-pastel-secondary mb-1">Insumos Usados</p>
                    <p className="text-3xl font-bold text-purple-700">
                      {stats.insumosUsados.reduce((total, i) => total + (i.totalUsado || 0), 0)}
                    </p>
                    <p className="text-xs text-pastel-muted mt-1">
                      {stats.insumosUsados.length} tipos diferentes
                    </p>
                  </div>
                  <Package size={40} className="text-purple-600" />
                </div>
              </div>

              <div className="card-pastel p-6 bg-pastel-yellow hover:shadow-lg transition-pastel">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-pastel-secondary mb-1">Ingresos Totales</p>
                    <p className="text-3xl font-bold text-yellow-700">
                      {formatCurrency(stats.ingresosTotales)}
                    </p>
                    {stats.promedioIngresoDiario > 0 && (
                      <p className="text-xs text-pastel-muted mt-1">
                        {formatCurrency(stats.promedioIngresoDiario)}/día
                      </p>
                    )}
                  </div>
                  <DollarSign size={40} className="text-yellow-600" />
                </div>
              </div>
            </div>

            {/* Contenido condicional basado en si hay datos */}
            {stats.citasRealizadas === 0 ? (
              <div className="card-pastel p-12 bg-pastel-yellow text-center">
                <Calendar size={64} className="mx-auto text-pastel-muted mb-4" />
                <h3 className="text-xl font-semibold text-pastel-primary mb-4">
                  Sin datos para el período seleccionado
                </h3>
                <p className="text-pastel-secondary mb-6">
                  No hay citas registradas en el período {dateRange.startDate} - {dateRange.endDate}.
                  Intenta seleccionar un rango de fechas diferente o crear nuevas citas.
                </p>
                <div className="space-y-2 text-sm text-pastel-secondary">
                  <p>💡 <strong>Sugerencias:</strong></p>
                  <p>• Amplía el rango de fechas</p>
                  <p>• Verifica que hay citas registradas en el sistema</p>
                  <p>• Contacta al administrador si persiste el problema</p>
                </div>
              </div>
            ) : (
              <>
                {/* Gráficos y análisis detallado */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  {/* Días más concurridos */}
                  <div className="card-pastel p-6 bg-pastel-pink">
                    <h3 className="text-xl font-semibold mb-4 flex items-center text-pastel-primary">
                      <Clock className="mr-2" size={20} />
                      Días Más Concurridos
                    </h3>
                    <div className="space-y-3">
                      {stats.diasMasConcurridos.length > 0 ? (
                        stats.diasMasConcurridos.map((dia, index) => (
                          <div key={dia._id} className="flex items-center justify-between card-pastel p-4 bg-white hover:shadow-md transition-pastel">
                            <div className="flex items-center">
                              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3 ${
                                index === 0 ? 'bg-yellow-400 text-black' :
                                index === 1 ? 'bg-gray-400 text-black' :
                                index === 2 ? 'bg-amber-600 text-white' : 'bg-pastel-mint-dark text-pastel-primary'
                              }`}>
                                {index + 1}
                              </span>
                              <span className="font-medium text-pastel-primary">
                                {diasSemana[dia._id - 1] || `Día ${dia._id}`}
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="text-lg font-bold text-blue-600">{dia.totalCitas}</span>
                              <span className="text-pastel-secondary text-sm ml-1">citas</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-pastel-muted text-center py-8">No hay datos de días para mostrar</p>
                      )}
                    </div>
                  </div>

                  {/* Insumos más utilizados */}
                  <div className="card-pastel p-6 bg-pastel-mint">
                    <h3 className="text-xl font-semibold mb-4 flex items-center text-pastel-primary">
                      <TrendingUp className="mr-2" size={20} />
                      Insumos Más Utilizados
                    </h3>
                    <div className="space-y-3">
                      {stats.insumosUsados.length > 0 ? (
                        stats.insumosUsados.slice(0, 8).map((insumo, index) => {
                          const maxUsage = Math.max(...stats.insumosUsados.map(i => i.totalUsado || 0));
                          const percentage = maxUsage > 0 ? (insumo.totalUsado / maxUsage) * 100 : 0;
                          
                          return (
                            <div key={insumo._id} className="card-pastel p-4 bg-white hover:shadow-md transition-pastel">
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <p className="font-medium text-pastel-primary truncate">{insumo.nombre}</p>
                                  <div className="w-full bg-pastel-mint-dark rounded-full h-2 mt-2">
                                    <div
                                      className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                                      style={{ width: `${percentage}%` }}
                                    />
                                  </div>
                                </div>
                                <div className="text-right ml-4">
                                  <span className="text-lg font-bold text-blue-600">{insumo.totalUsado}</span>
                                  <span className="text-pastel-secondary text-sm ml-1">usos</span>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-pastel-muted text-center py-8">No hay datos de insumos para mostrar</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Estadísticas adicionales */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="card-pastel p-6 text-center bg-pastel-blue hover:shadow-lg transition-pastel">
                    <Activity size={32} className="mx-auto text-blue-600 mb-3" />
                    <h4 className="text-lg font-semibold mb-2 text-pastel-primary">Promedio Diario</h4>
                    <p className="text-2xl font-bold text-blue-600">
                      {formatCurrency(stats.promedioIngresoDiario)}
                    </p>
                    <p className="text-pastel-secondary text-sm">Ingresos por día</p>
                  </div>

                  <div className="card-pastel p-6 text-center bg-pastel-pink hover:shadow-lg transition-pastel">
                    <Package size={32} className="mx-auto text-red-600 mb-3" />
                    <h4 className="text-lg font-semibold mb-2 text-pastel-primary">Insumos Críticos</h4>
                    <p className="text-2xl font-bold text-red-600">
                      {stats.insumosAgotados}
                    </p>
                    <p className="text-pastel-secondary text-sm">Insumos agotados</p>
                  </div>

                  <div className="card-pastel p-6 text-center bg-pastel-green hover:shadow-lg transition-pastel">
                    <Users size={32} className="mx-auto text-green-600 mb-3" />
                    <h4 className="text-lg font-semibold mb-2 text-pastel-primary">Odontólogos</h4>
                    <p className="text-2xl font-bold text-green-600">
                      {stats.odontologosActivos}
                    </p>
                    <p className="text-pastel-secondary text-sm">Activos en el período</p>
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {/* Información del período */}
        <div className="card-pastel p-6 bg-pastel-purple">
          <h3 className="text-lg font-semibold text-pastel-primary mb-4 flex items-center gap-2">
            📊 Información del Reporte
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-pastel-secondary">
            <div className="space-y-2">
              <p><strong>Período analizado:</strong></p>
              <p className="bg-white px-3 py-2 rounded-md text-pastel-primary">
                {dateRange.startDate && dateRange.endDate ? 
                  `${new Date(dateRange.startDate).toLocaleDateString('es-ES')} - ${new Date(dateRange.endDate).toLocaleDateString('es-ES')}` : 
                  'Sin fechas seleccionadas'}
              </p>
            </div>
            <div className="space-y-2">
              <p><strong>Última actualización:</strong></p>
              <p className="bg-white px-3 py-2 rounded-md text-pastel-primary">
                {new Date().toLocaleString('es-ES')}
              </p>
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm">
            <div className="bg-white p-3 rounded-lg">
              <p className="font-bold text-pastel-primary">{stats.citasRealizadas}</p>
              <p className="text-pastel-muted">Total Citas</p>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <p className="font-bold text-pastel-primary">{stats.pacientesAtendidos}</p>
              <p className="text-pastel-muted">Pacientes</p>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <p className="font-bold text-pastel-primary">{stats.insumosUsados.length}</p>
              <p className="text-pastel-muted">Insumos Diferentes</p>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <p className="font-bold text-pastel-primary">{formatCurrency(stats.ingresosTotales)}</p>
              <p className="text-pastel-muted">Ingresos</p>
            </div>
          </div>

          {loading && (
            <div className="mt-4 flex items-center justify-center gap-3 text-pastel-primary">
              <RefreshCw className="animate-spin" size={20} />
              <span>Actualizando estadísticas...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StatisticsPage;