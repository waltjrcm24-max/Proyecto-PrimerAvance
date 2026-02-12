import React, { useState } from 'react';
import { Filter, X, Plus, Edit, Save, Check } from 'lucide-react';
import { WasteRecord, Manifesto } from '../types';
import { getManifestos, addManifesto, updateManifesto, deleteManifesto } from '../utils/storage';

interface ManifestoProps {
  records: WasteRecord[];
}

const ALL_WASTE_TYPES = [
  'Orgánicos',
  'Orgánicos (naranja/limón)',
  'Inorgánicos - no valorizables',
  'Pet',
  'Plástico duro',
  'Emplaye',
  'BOPP (envolturas)',
  'Vidrio',
  'Aluminio',
  'Cartón',
  'Papel, libros, revistas y periódicos',
  'Lata de conserva o latón',
  'Tetrapak',
  'Textiles',
  'Chatarra',
  'Café para composta',
  'Residuos para rancho'
];

const ALL_LOCATIONS = [
  'NA (No aplica)',
  'Áreas públicas',
  'Albercas',
  'Almacén',
  'Ama de llaves',
  'Audio visual',
  'Banquetes',
  'Barefoot',
  'Bares',
  'Barracuda',
  'Bodas',
  'Bordeaux',
  'Carpintería',
  'Club Preferred',
  'Cocina central',
  'Coco Café',
  'Comedor empleados',
  'Comisariato',
  'Edificios',
  'El Patio',
  'Entretenimiento',
  'Especialidades',
  'Eventos/Banquetes',
  'Himitsu',
  'Jardinería',
  'Lavandería',
  'Limpieza de playa',
  'Manatees',
  'Mantenimiento',
  'Market',
  'Market Café',
  'Minibares/Servibar',
  'Oceana',
  'Oficinas',
  'Poblado',
  'Portofino',
  'Proveedores',
  'RH',
  'Room Service/IRD',
  'Seaside',
  'Seaside Grill',
  'SPA',
  'Sports Bar',
  'Terraza',
  'Tintorería',
  'Tours',
  'Tratamiento de agua',
  'Vigilancia',
  'Vitrolero'
];

interface ManifestoFilters {
  types: string[];
  locations: string[];
  startDate: string;
  endDate: string;
  sortBy: 'newest' | 'oldest';
}

export default function ManifestoComponent({ records }: ManifestoProps) {
  const [manifesatos, setManifesatos] = useState<Manifesto[]>(getManifestos());
  const [showFilters, setShowFilters] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filters, setFilters] = useState<ManifestoFilters>({
    types: [],
    locations: [],
    startDate: '',
    endDate: '',
    sortBy: 'newest'
  });

  const [formData, setFormData] = useState({
    wasteRecordId: '',
    exitDate: '',
    authorizationNumber: '',
    notes: ''
  });

  const toggleType = (type: string) => {
    setFilters(prev => ({
      ...prev,
      types: prev.types.includes(type)
        ? prev.types.filter(t => t !== type)
        : [...prev.types, type]
    }));
  };

  const toggleLocation = (location: string) => {
    setFilters(prev => ({
      ...prev,
      locations: prev.locations.includes(location)
        ? prev.locations.filter(l => l !== location)
        : [...prev.locations, location]
    }));
  };

  const clearFilters = () => {
    setFilters({
      types: [],
      locations: [],
      startDate: '',
      endDate: '',
      sortBy: 'newest'
    });
  };

  const getFilteredRecords = () => {
    const manifestoRecordIds = new Set(manifesatos.map(m => {
      const record = records.find(r => `${r.id}-${r.date}-${r.time}` === m.id);
      return record?.id;
    }));

    let filtered = records.filter(record => !manifestoRecordIds.has(record.id));

    if (filters.types.length > 0) {
      filtered = filtered.filter(r => filters.types.includes(r.type));
    }

    if (filters.locations.length > 0) {
      filtered = filtered.filter(r => filters.locations.includes(r.location));
    }

    if (filters.startDate) {
      filtered = filtered.filter(r => r.date >= filters.startDate);
    }

    if (filters.endDate) {
      filtered = filtered.filter(r => r.date <= filters.endDate);
    }

    if (filters.sortBy === 'newest') {
      filtered = filtered.reverse();
    }

    return filtered;
  };

  const filteredRecords = getFilteredRecords();
  const hasActiveFilters = filters.types.length > 0 || filters.locations.length > 0 || filters.startDate || filters.endDate;

  const handleAddManifesto = (record: WasteRecord) => {
    const newManifesto: Omit<Manifesto, 'id'> = {
      type: record.type,
      location: record.location,
      weight: record.weight,
      date: record.date,
      time: record.time,
      exitDate: formData.exitDate,
      authorizationNumber: formData.authorizationNumber,
      notes: formData.notes,
      createdBy: 'admin'
    };

    const saved = addManifesto(newManifesto);
    setManifesatos([...manifesatos, saved]);
    setFormData({ wasteRecordId: '', exitDate: '', authorizationNumber: '', notes: '' });
    setShowForm(false);
  };

  const handleUpdateManifesto = (id: string, updates: Partial<Manifesto>) => {
    updateManifesto(id, updates);
    setManifesatos(manifesatos.map(m => m.id === id ? { ...m, ...updates } : m));
    setEditingId(null);
  };

  const handleDeleteManifesto = (id: string) => {
    deleteManifesto(id);
    setManifesatos(manifesatos.filter(m => m.id !== id));
  };

  const wasteTypes = ALL_WASTE_TYPES;
  const locations = ALL_LOCATIONS;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-purple-100 p-2 rounded-lg">
            <Edit className="w-5 h-5 text-purple-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Manifiestos de Salida</h2>

          <div className="ml-auto flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                showFilters || hasActiveFilters
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Filter className="w-4 h-4" />
              Filtros
              {hasActiveFilters && (
                <span className="bg-white text-purple-600 text-xs px-2 py-1 rounded-full font-medium">
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
            <h3 className="text-lg font-medium text-gray-900 mb-4">Filtros</h3>

            {/* Multi-select Type Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Tipos de Residuo ({filters.types.length} seleccionado{filters.types.length !== 1 ? 's' : ''}):
              </label>
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden max-h-64 overflow-y-auto">
                {wasteTypes.map((type, index) => (
                  <div
                    key={type}
                    onClick={() => toggleType(type)}
                    className={`flex items-center px-4 py-3 cursor-pointer transition-colors ${
                      filters.types.includes(type)
                        ? 'bg-purple-50 border-l-4 border-l-purple-600'
                        : 'hover:bg-gray-50 border-l-4 border-l-transparent'
                    } ${index !== wasteTypes.length - 1 ? 'border-b border-gray-100' : ''}`}
                  >
                    <div className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center ${
                      filters.types.includes(type)
                        ? 'bg-purple-600 border-purple-600'
                        : 'border-gray-300'
                    }`}>
                      {filters.types.includes(type) && (
                        <svg className="w-3 h-3 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="currentColor">
                          <path d="M5 13l4 4L19 7"></path>
                        </svg>
                      )}
                    </div>
                    <span className={`text-sm ${
                      filters.types.includes(type) ? 'font-medium text-purple-900' : 'text-gray-700'
                    }`}>
                      {type}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Multi-select Location Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Ubicaciones ({filters.locations.length} seleccionada{filters.locations.length !== 1 ? 's' : ''}):
              </label>
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden max-h-64 overflow-y-auto">
                {locations.map((location, index) => (
                  <div
                    key={location}
                    onClick={() => toggleLocation(location)}
                    className={`flex items-center px-4 py-3 cursor-pointer transition-colors ${
                      filters.locations.includes(location)
                        ? 'bg-purple-50 border-l-4 border-l-purple-600'
                        : 'hover:bg-gray-50 border-l-4 border-l-transparent'
                    } ${index !== locations.length - 1 ? 'border-b border-gray-100' : ''}`}
                  >
                    <div className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center ${
                      filters.locations.includes(location)
                        ? 'bg-purple-600 border-purple-600'
                        : 'border-gray-300'
                    }`}>
                      {filters.locations.includes(location) && (
                        <svg className="w-3 h-3 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="currentColor">
                          <path d="M5 13l4 4L19 7"></path>
                        </svg>
                      )}
                    </div>
                    <span className={`text-sm ${
                      filters.locations.includes(location) ? 'font-medium text-purple-900' : 'text-gray-700'
                    }`}>
                      {location}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Date and Sort Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha Inicio:
                </label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ordenar por:
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as 'newest' | 'oldest' }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="newest">Más Recientes</option>
                  <option value="oldest">Más Antiguos</option>
                </select>
              </div>
            </div>

            <div className="mt-4 text-sm text-gray-600">
              Mostrando {filteredRecords.length} registros disponibles
            </div>
          </div>
        )}

        {/* Add New Manifesto Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Agregar Manifiesto
          </button>
        </div>

        {/* Add Manifesto Form */}
        {showForm && filteredRecords.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-6 mb-6 border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Nuevo Manifiesto</h3>

            {/* Select Waste Record */}
            <div className="mb-6 overflow-y-auto max-h-48">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Seleccionar Registro:
              </label>
              <div className="space-y-2">
                {filteredRecords.map(record => (
                  <button
                    key={record.id}
                    onClick={() => setFormData(prev => ({ ...prev, wasteRecordId: record.id }))}
                    className={`w-full p-3 text-left rounded-lg border transition-colors ${
                      formData.wasteRecordId === record.id
                        ? 'bg-purple-100 border-purple-600'
                        : 'bg-white border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="font-medium text-gray-900">{record.type}</div>
                    <div className="text-sm text-gray-600">{record.location} - {record.weight}kg - {record.date}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Form Fields */}
            {formData.wasteRecordId && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Salida *
                  </label>
                  <input
                    type="date"
                    value={formData.exitDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, exitDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número de Autorización *
                  </label>
                  <input
                    type="text"
                    value={formData.authorizationNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, authorizationNumber: e.target.value.toUpperCase() }))}
                    placeholder="Letras y números"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent uppercase"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notas
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Información adicional..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}

            {/* Form Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  const record = records.find(r => r.id === formData.wasteRecordId);
                  if (record && formData.exitDate && formData.authorizationNumber) {
                    handleAddManifesto(record);
                  }
                }}
                disabled={!formData.wasteRecordId || !formData.exitDate || !formData.authorizationNumber}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Check className="w-4 h-4" />
                Guardar Manifiesto
              </button>

              <button
                onClick={() => {
                  setShowForm(false);
                  setFormData({ wasteRecordId: '', exitDate: '', authorizationNumber: '', notes: '' });
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Manifesto Table */}
      {manifesatos.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Manifiestos Registrados ({manifesatos.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Tipo</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Ubicación</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Peso (kg)</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Fecha Salida</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Autorización</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Notas</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {manifesatos.map(manifesto => (
                  <tr key={manifesto.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {manifesto.type}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        {manifesto.location}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-900">
                      {manifesto.weight.toFixed(1)}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {editingId === manifesto.id ? (
                        <input
                          type="date"
                          value={manifesto.exitDate}
                          onChange={(e) => {
                            const updated = { ...manifesto, exitDate: e.target.value };
                            handleUpdateManifesto(manifesto.id, { exitDate: e.target.value });
                          }}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      ) : (
                        new Date(manifesto.exitDate).toLocaleDateString('es-MX')
                      )}
                    </td>
                    <td className="py-3 px-4 text-gray-600 font-mono">
                      {editingId === manifesto.id ? (
                        <input
                          type="text"
                          value={manifesto.authorizationNumber}
                          onChange={(e) => handleUpdateManifesto(manifesto.id, { authorizationNumber: e.target.value.toUpperCase() })}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm uppercase"
                        />
                      ) : (
                        manifesto.authorizationNumber
                      )}
                    </td>
                    <td className="py-3 px-4 text-gray-600 max-w-xs truncate">
                      {manifesto.notes || '-'}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        {editingId === manifesto.id ? (
                          <button
                            onClick={() => setEditingId(null)}
                            className="text-green-600 hover:text-green-700 p-1"
                            title="Guardar"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => setEditingId(manifesto.id)}
                            className="text-blue-600 hover:text-blue-700 p-1"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          onClick={() => handleDeleteManifesto(manifesto.id)}
                          className="text-red-600 hover:text-red-700 p-1"
                          title="Eliminar"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {manifesatos.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Edit className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 mb-2">No hay manifiestos registrados</p>
          <p className="text-sm text-gray-400">
            Agrega manifiestos desde los registros disponibles
          </p>
        </div>
      )}
    </div>
  );
}
