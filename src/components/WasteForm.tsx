import React, { useState } from 'react';
import { Plus, Save, CheckCircle } from 'lucide-react';
import { addWasteRecord } from '../utils/storage';
import { WasteRecord } from '../types';

interface WasteFormProps {
  user: any;
  onRecordAdded: (record: WasteRecord) => void;
}

const WASTE_TYPES = [
  'Orgánicos',
  'Orgánicos (naranja/limón)',
  'Inorgánicos - no valorizables',
  'Pet',
  'Plástico duro',
  'Emplaye',
  'Vidrio',
  'Aluminio',
  'Cartón',
  'Papel',
  'Lata de conserva o latón',
  'Tetrapak',
  'Textiles',
  'Chatarra',
  'Café para composta'
];

const LOCATIONS = [
  'Áreas públicas',
  'Albercas',
  'Almacén',
  'Ama de llaves',
  'Audio visual',
  'Banquetes',
  'Bares',
  'Bodas',
  'Carpintería',
  'Cocina central',
  'Coco Café',
  'Comedor empleados',
  'Comisariato',
  'Edificios',
  'Entretenimiento',
  'Especialidades',
  'Eventos/Banquetes',
  'Jardinería',
  'Lavandería',
  'Limpieza de playa',
  'Mantenimiento',
  'Market',
  'Minibares/Servibar',
  'Oceana',
  'Oficinas',
  'Poblado',
  'Proveedores',
  'RH',
  'Room Service/IRD',
  'Seaside Grill',
  'Seguridad',
  'Sommelier',
  'Spa',
  'Steward',
  'Tiendas',
  'Tiendita colegas',
  'UVC',
  'Chatos'
];

export default function WasteForm({ user, onRecordAdded }: WasteFormProps) {
  const [type, setType] = useState('');
  const [location, setLocation] = useState('');
  const [weight, setWeight] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(new Date().toTimeString().split(' ')[0].substring(0, 5));
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const record = addWasteRecord({
        type,
        location,
        weight: parseFloat(weight),
        date,
        time,
        notes: notes.trim() || undefined,
        createdBy: user.id
      });

      onRecordAdded(record);
      
      // Show success message
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      
      // Reset form
      setType('');
      setLocation('');
      setWeight('');
      setDate(new Date().toISOString().split('T')[0]);
      setTime(new Date().toTimeString().split(' ')[0].substring(0, 5));
      setNotes('');
    } catch (error) {
      console.error('Error al guardar el registro:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 z-50 animate-pulse">
          <CheckCircle className="w-6 h-6" />
          <span className="font-medium">¡Registro guardado exitosamente!</span>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-green-100 p-2 rounded-lg">
            <Plus className="w-5 h-5 text-green-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">
            Registrar Residuos Recolectados
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Residuo
              </label>
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                <option value="">Seleccione un tipo</option>
                {WASTE_TYPES.map((wasteType) => (
                  <option key={wasteType} value={wasteType}>
                    {wasteType}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Ubicación
              </label>
              <select
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                <option value="">Seleccione una ubicación</option>
                {LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-2">
                Peso (kg)
              </label>
              <input
                id="weight"
                type="number"
                step="0.1"
                min="0"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="0.0"
              />
            </div>

            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                Fecha
              </label>
              <input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>

            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
                Hora
              </label>
              <input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
              Notas (Opcional)
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
              placeholder="Observaciones adicionales sobre el residuo recolectado..."
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-emerald-700 focus:ring-4 focus:ring-green-200 transition-all duration-200 flex items-center gap-2 font-medium disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Guardar Registro
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}