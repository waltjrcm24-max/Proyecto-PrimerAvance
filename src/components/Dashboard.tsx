import React from 'react';
import { useState } from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { BarChart3, PieChart, TrendingUp, Filter, X } from 'lucide-react';
import { WasteRecord } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

interface DashboardProps {
  records: WasteRecord[];
}

export default function Dashboard({ records }: DashboardProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    type: '',
    location: '',
    startDate: '',
    endDate: '',
    minWeight: '',
    maxWeight: '',
    startTime: '',
    endTime: ''
  });

  // Apply filters to records
  const filteredRecords = records.filter(record => {
    if (filters.type && record.type !== filters.type) return false;
    if (filters.location && record.location !== filters.location) return false;
    if (filters.startDate && record.date < filters.startDate) return false;
    if (filters.endDate && record.date > filters.endDate) return false;
    if (filters.minWeight && record.weight < parseFloat(filters.minWeight)) return false;
    if (filters.maxWeight && record.weight > parseFloat(filters.maxWeight)) return false;
    if (filters.startTime && record.time < filters.startTime) return false;
    if (filters.endTime && record.time > filters.endTime) return false;
    return true;
  });

  const clearFilters = () => {
    setFilters({
      type: '',
      location: '',
      startDate: '',
      endDate: '',
      minWeight: '',
      maxWeight: '',
      startTime: '',
      endTime: ''
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  // Process data for charts
  const wasteByType = filteredRecords.reduce((acc, record) => {
    acc[record.type] = (acc[record.type] || 0) + record.weight;
    return acc;
  }, {} as Record<string, number>);

  const wasteByLocation = filteredRecords.reduce((acc, record) => {
    acc[record.location] = (acc[record.location] || 0) + record.weight;
    return acc;
  }, {} as Record<string, number>);

  const wasteByDate = filteredRecords.reduce((acc, record) => {
    const date = record.date;
    acc[date] = (acc[date] || 0) + record.weight;
    return acc;
  }, {} as Record<string, number>);

  // Get unique values for filter options
  const wasteTypes = Array.from(new Set(records.map(record => record.type)));
  const locations = Array.from(new Set(records.map(record => record.location)));

  // Chart colors
  const colors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
    '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6B7280'
  ];

  // Bar Chart Data
  const barData = {
    labels: Object.keys(wasteByType),
    datasets: [
      {
        label: 'Peso (kg)',
        data: Object.values(wasteByType),
        backgroundColor: colors.slice(0, Object.keys(wasteByType).length),
        borderColor: colors.slice(0, Object.keys(wasteByType).length),
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  // Pie Chart Data
  const pieData = {
    labels: Object.keys(wasteByType),
    datasets: [
      {
        data: Object.values(wasteByType),
        backgroundColor: colors.slice(0, Object.keys(wasteByType).length),
        borderColor: '#ffffff',
        borderWidth: 2,
      },
    ],
  };

  // Line Chart Data
  const sortedDates = Object.keys(wasteByDate).sort();
  const lineData = {
    labels: sortedDates,
    datasets: [
      {
        label: 'Peso Total por Día (kg)',
        data: sortedDates.map(date => wasteByDate[date]),
        fill: true,
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderColor: '#3B82F6',
        borderWidth: 2,
        pointBackgroundColor: '#3B82F6',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
        tension: 0.4,
      },
    ],
  };

  // Location Chart Data
  const locationData = {
    labels: Object.keys(wasteByLocation),
    datasets: [
      {
        label: 'Peso por Ubicación (kg)',
        data: Object.values(wasteByLocation),
        backgroundColor: colors.slice(0, Object.keys(wasteByLocation).length),
        borderColor: colors.slice(0, Object.keys(wasteByLocation).length),
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
      },
    },
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-100 p-2 rounded-lg">
            <BarChart3 className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Dashboard de Residuos</h2>
          
          <div className="ml-auto flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                showFilters || hasActiveFilters
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Filter className="w-4 h-4" />
              Filtros
              {hasActiveFilters && (
                <span className="bg-white text-blue-600 text-xs px-2 py-1 rounded-full font-medium">
                  Activos
                </span>
              )}
            </button>
            
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
                Limpiar
              </button>
            )}
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Filtros Interactivos</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Residuo:
                </label>
                <select
                  value={filters.type}
                  onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Todos los tipos</option>
                  {wasteTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ubicación:
                </label>
                <select
                  value={filters.location}
                  onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Todas las ubicaciones</option>
                  {locations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha Inicio:
                </label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha Fin:
                </label>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Peso Mínimo (kg):
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={filters.minWeight}
                  onChange={(e) => setFilters(prev => ({ ...prev, minWeight: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Peso Máximo (kg):
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={filters.maxWeight}
                  onChange={(e) => setFilters(prev => ({ ...prev, maxWeight: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hora Inicio:
                </label>
                <input
                  type="time"
                  value={filters.startTime}
                  onChange={(e) => setFilters(prev => ({ ...prev, startTime: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hora Fin:
                </label>
                <input
                  type="time"
                  value={filters.endTime}
                  onChange={(e) => setFilters(prev => ({ ...prev, endTime: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="mt-4 text-sm text-gray-600">
              Mostrando {filteredRecords.length} de {records.length} registros
            </div>
          </div>
        )}

        {filteredRecords.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 mb-2">
              {records.length === 0 ? 'No hay datos registrados' : 'No hay registros que coincidan con los filtros'}
            </p>
            <p className="text-sm text-gray-400">
              {records.length === 0 
                ? 'Los gráficos aparecerán cuando registres residuos'
                : 'Ajusta los filtros para ver más resultados'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Bar Chart */}
            <div className="bg-gray-50 rounded-lg p-4 w-full">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                Residuos por Tipo
              </h3>
              <div className="h-80">
                <Bar data={barData} options={chartOptions} />
              </div>
            </div>

            {/* Location Chart */}
            <div className="bg-gray-50 rounded-lg p-4 w-full">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-orange-600" />
                Residuos por Ubicación
              </h3>
              <div className="h-80">
                <Bar data={locationData} options={chartOptions} />
              </div>
            </div>

            {/* Bottom Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pie Chart */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-green-600" />
                  Distribución
                </h3>
                <div className="h-64">
                  <Pie data={pieData} options={pieOptions} />
                </div>
              </div>

              {/* Line Chart */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  Tendencia Temporal
                </h3>
                <div className="h-64">
                  <Line data={lineData} options={chartOptions} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Recent Records Table */}
      {filteredRecords.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {hasActiveFilters ? 'Registros Filtrados' : 'Registros Recientes'}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Tipo</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Ubicación</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Peso (kg)</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Fecha</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Notas</th>
                </tr>
              </thead>
              <tbody>
                {(hasActiveFilters ? filteredRecords : filteredRecords.slice(-10)).reverse().map((record) => (
                  <tr key={record.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {record.type}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        {record.location}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-900">
                      {record.weight.toFixed(1)}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {new Date(record.date).toLocaleDateString('es-MX')} {record.time}
                    </td>
                    <td className="py-3 px-4 text-gray-600 max-w-xs truncate">
                      {record.notes || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}