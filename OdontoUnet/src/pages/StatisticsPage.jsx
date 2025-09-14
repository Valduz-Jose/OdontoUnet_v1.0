import { useState, useEffect } from 'react';
import { Calendar, Users, Package, TrendingUp, Clock, DollarSign, Activity } from 'lucide-react';

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

  if (loading) {
    return <div className="text-center py-8">Cargando estadísticas...</div>;
  }

  return (
    <div className="min-h-screen bg-[#202020] text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-blue-500">Estadísticas y Reportes</h1>

        {/* Controles de filtros */}
        <div className="bg-zinc-900 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Calendar className="mr-2" size={20} />
            Filtros de Tiempo
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Botones de períodos rápidos */}
            <div className="md:col-span-4 mb-4">
              <p className="text-sm text-gray-400 mb-2">Períodos predefinidos:</p>
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
                    className={`px-4 py-2 rounded-md transition-colors ${
                      dateRange.period === key
                        ? 'bg-blue-600 text-white'
                        : 'bg-zinc-800 hover:bg-zinc-700 text-gray-300'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Fechas personalizadas */}
            <div>
              <label className="block text-sm font-medium mb-2">Fecha inicio</label>
              <input
                type="date"
                name="startDate"
                value={dateRange.startDate}
                onChange={handleDateChange}
                className="w-full p-3 bg-zinc-800 border border-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Fecha fin</label>
              <input
                type="date"
                name="endDate"
                value={dateRange.endDate}
                onChange={handleDateChange}
                className="w-full p-3 bg-zinc-800 border border-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2 flex items-end">
              <button
                onClick={fetchStatistics}
                className="w-full bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Actualizar Estadísticas
              </button>
            </div>
          </div>
        </div>

        {/* Tarjetas de estadísticas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 rounded-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Pacientes Atendidos</p>
                <p className="text-3xl font-bold">{stats.pacientesAtendidos}</p>
              </div>
              <Users size={40} className="text-blue-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 rounded-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Citas Realizadas</p>
                <p className="text-3xl font-bold">{stats.citasRealizadas}</p>
              </div>
              <Calendar size={40} className="text-green-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6 rounded-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Insumos Usados</p>
                <p className="text-3xl font-bold">{stats.insumosUsados.reduce((total, i) => total + i.totalUsado, 0)}</p>
              </div>
              <Package size={40} className="text-purple-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 p-6 rounded-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm">Ingresos Totales</p>
                <p className="text-3xl font-bold">${stats.ingresosTotales}</p>
              </div>
              <DollarSign size={40} className="text-yellow-200" />
            </div>
          </div>
        </div>

        {/* Gráficos y análisis detallado */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Días más concurridos */}
          <div className="bg-zinc-900 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Clock className="mr-2" size={20} />
              Días Más Concurridos
            </h3>
            <div className="space-y-3">
              {stats.diasMasConcurridos.map((dia, index) => (
                <div key={dia._id} className="flex items-center justify-between bg-zinc-800 p-3 rounded">
                  <div className="flex items-center">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3 ${
                      index === 0 ? 'bg-gold text-black' :
                      index === 1 ? 'bg-gray-400 text-black' :
                      index === 2 ? 'bg-amber-600 text-white' : 'bg-zinc-700 text-white'
                    }`}>
                      {index + 1}
                    </span>
                    <span className="font-medium">
                      {diasSemana[dia._id - 1] || `Día ${dia._id}`}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-blue-400">{dia.totalCitas}</span>
                    <span className="text-gray-400 text-sm ml-1">citas</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Insumos más utilizados */}
          <div className="bg-zinc-900 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <TrendingUp className="mr-2" size={20} />
              Insumos Más Utilizados
            </h3>
            <div className="space-y-3">
              {stats.insumosUsados.slice(0, 10).map((insumo, index) => (
                <div key={insumo._id} className="flex items-center justify-between bg-zinc-800 p-3 rounded">
                  <div className="flex-1">
                    <p className="font-medium text-white truncate">{insumo.nombre}</p>
                    <div className="w-full bg-zinc-700 rounded-full h-2 mt-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${(insumo.totalUsado / Math.max(...stats.insumosUsados.map(i => i.totalUsado))) * 100}%`
                        }}
                      />
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <span className="text-lg font-bold text-blue-400">{insumo.totalUsado}</span>
                    <span className="text-gray-400 text-sm ml-1">usos</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Estadísticas adicionales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-zinc-900 p-6 rounded-lg text-center">
            <Activity size={32} className="mx-auto text-blue-400 mb-3" />
            <h4 className="text-lg font-semibold mb-2">Promedio Diario</h4>
            <p className="text-2xl font-bold text-blue-400">
              ${stats.promedioIngresoDiario}
            </p>
            <p className="text-gray-400 text-sm">Ingresos por día</p>
          </div>

          <div className="bg-zinc-900 p-6 rounded-lg text-center">
            <Package size={32} className="mx-auto text-red-400 mb-3" />
            <h4 className="text-lg font-semibold mb-2">Insumos Críticos</h4>
            <p className="text-2xl font-bold text-red-400">
              {stats.insumosAgotados}
            </p>
            <p className="text-gray-400 text-sm">Insumos agotados</p>
          </div>

          <div className="bg-zinc-900 p-6 rounded-lg text-center">
            <Users size={32} className="mx-auto text-green-400 mb-3" />
            <h4 className="text-lg font-semibold mb-2">Odontólogos</h4>
            <p className="text-2xl font-bold text-green-400">
              {stats.odontologosActivos}
            </p>
            <p className="text-gray-400 text-sm">Activos en el período</p>
          </div>
        </div>

        {/* Información del período */}
        <div className="mt-8 bg-blue-900/30 border border-blue-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-400 mb-3">📊 Información del Reporte</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
            <div>
              <p><strong>Período analizado:</strong></p>
              <p>{new Date(dateRange.startDate).toLocaleDateString()} - {new Date(dateRange.endDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p><strong>Última actualización:</strong></p>
              <p>{new Date().toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatisticsPage;