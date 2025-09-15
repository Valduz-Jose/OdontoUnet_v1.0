import { useState, useEffect } from 'react';
import { Calendar, Users, Package, TrendingUp, Clock, DollarSign, Activity, BarChart, RefreshCw } from 'lucide-react';

function StatisticsPage() {
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: '',
    period: 'month' // day, week, month, year
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
    odontologosActivos: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Configurar fechas por defecto (último mes)
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
    
    setDateRange({
      startDate: lastMonth.toISOString().split('T')[0],
      endDate: today.toISOString().split('T')[0],
      period: 'month'
    });
  }, []);

  useEffect(() => {
    if (dateRange.startDate && dateRange.endDate) {
      fetchStatistics();
    }
  }, [dateRange]);

  const fetchStatistics = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        period: dateRange.period
      });

      const response = await fetch(`http://localhost:3000/api/statistics?${params}`, {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
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
                    className={`px-4 py-2 rounded-md font-medium transition-pastel ${
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
                className="input-pastel w-full p-3"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-pastel-primary">Fecha fin</label>
              <input
                type="date"
                name="endDate"
                value={dateRange.endDate}
                onChange={handleDateChange}
                className="input-pastel w-full p-3"
              />
            </div>

            <div className="md:col-span-2 flex items-end">
              <button
                onClick={fetchStatistics}
                disabled={loading}
                className="w-full btn-pastel-primary px-6 py-3 rounded-lg font-semibold transition-pastel flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <RefreshCw className={loading ? 'animate-spin' : ''} size={18} />
                {loading ? 'Actualizando...' : 'Actualizar Estadísticas'}
              </button>
            </div>
          </div>
        </div>

        {/* Tarjetas de estadísticas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card-pastel p-6 text-center bg-pastel-blue hover:shadow-lg transition-pastel">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-pastel-secondary mb-1">Pacientes Atendidos</p>
                <p className="text-3xl font-bold text-blue-700">{stats.pacientesAtendidos}</p>
              </div>
              <Users size={40} className="text-blue-600" />
            </div>
          </div>

          <div className="card-pastel p-6 text-center bg-pastel-green hover:shadow-lg transition-pastel">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-pastel-secondary mb-1">Citas Realizadas</p>
                <p className="text-3xl font-bold text-green-700">{stats.citasRealizadas}</p>
              </div>
              <Calendar size={40} className="text-green-600" />
            </div>
          </div>

          <div className="card-pastel p-6 text-center bg-pastel-purple hover:shadow-lg transition-pastel">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-pastel-secondary mb-1">Insumos Usados</p>
                <p className="text-3xl font-bold text-purple-700">{stats.insumosUsados.reduce((total, i) => total + i.totalUsado, 0)}</p>
              </div>
              <Package size={40} className="text-purple-600" />
            </div>
          </div>

          <div className="card-pastel p-6 text-center bg-pastel-yellow hover:shadow-lg transition-pastel">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-pastel-secondary mb-1">Ingresos Totales</p>
                <p className="text-3xl font-bold text-yellow-700">${stats.ingresosTotales}</p>
              </div>
              <DollarSign size={40} className="text-yellow-600" />
            </div>
          </div>
        </div>

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
                <p className="text-pastel-muted text-center py-8">No hay datos de días concurridos para mostrar</p>
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
                stats.insumosUsados.slice(0, 10).map((insumo, index) => (
                  <div key={insumo._id} className="card-pastel p-4 bg-white hover:shadow-md transition-pastel">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-pastel-primary truncate">{insumo.nombre}</p>
                        <div className="w-full bg-pastel-mint-dark rounded-full h-2 mt-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                            style={{
                              width: `${(insumo.totalUsado / Math.max(...stats.insumosUsados.map(i => i.totalUsado))) * 100}%`
                            }}
                          />
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <span className="text-lg font-bold text-blue-600">{insumo.totalUsado}</span>
                        <span className="text-pastel-secondary text-sm ml-1">usos</span>
                      </div>
                    </div>
                  </div>
                ))
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
              ${stats.promedioIngresoDiario}
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

        {/* Información del período */}
        <div className="card-pastel p-6 bg-pastel-purple border border-purple-300">
          <h3 className="text-lg font-semibold text-pastel-primary mb-4 flex items-center gap-2">
            📊 Información del Reporte
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-pastel-secondary">
            <div className="space-y-2">
              <p><strong>Período analizado:</strong></p>
              <p className="bg-pastel-blue px-3 py-2 rounded-md">
                {new Date(dateRange.startDate).toLocaleDateString('es-ES')} - {new Date(dateRange.endDate).toLocaleDateString('es-ES')}
              </p>
            </div>
            <div className="space-y-2">
              <p><strong>Última actualización:</strong></p>
              <p className="bg-pastel-green px-3 py-2 rounded-md">
                {new Date().toLocaleString('es-ES')}
              </p>
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