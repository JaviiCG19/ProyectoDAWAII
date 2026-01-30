'use client';

import { useState } from 'react';
import { Calendar, Clock, Users, DollarSign, Check, Store, MapPin } from 'lucide-react';

export default function CrearReservaPage() {
  const [paso, setPaso] = useState(1);

  // Datos simulados
  const restaurantes = [
    { id: 1, nombre: 'La Parrilla Dorada', sucursales: ['Samborondón', 'Urdesa'] },
    { id: 2, nombre: 'El Sabor del Mar', sucursales: ['Urdesa', 'Alborada'] },
  ];

  const horariosDisponibles = ['19:00', '19:30', '20:00', '20:30', '21:00'];

  const [formData, setFormData] = useState({
    restauranteId: '',
    sucursal: '',
    fecha: '',
    hora: '',
    personas: 2,
    mesa: '',
    anticipo: false,
  });

  // Tipamos el evento para evitar el error "any"
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      anticipo: e.target.checked,
    });
  };

  const siguientePaso = () => setPaso(paso + 1);
  const anteriorPaso = () => setPaso(paso - 1);

  const confirmarReserva = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Reserva creada correctamente (simulada)');
    // Aquí iría la llamada real al backend
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-extrabold text-[#F2B847] text-center mb-8">
        Nueva Reserva
      </h1>

      {/* Barra de progreso */}
      <div className="flex justify-between mb-8">
        {['Restaurante', 'Fecha y Hora', 'Mesa y Anticipo', 'Confirmar'].map((etapa, index) => (
          <div key={index} className="flex-1 text-center">
            <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center text-white font-bold ${
              paso > index + 1 ? 'bg-green-500' :
              paso === index + 1 ? 'bg-[#F2B847]' :
              'bg-gray-300'
            }`}>
              {paso > index + 1 ? '✓' : index + 1}
            </div>
            <p className="text-sm mt-2">{etapa}</p>
          </div>
        ))}
      </div>

      {/* Paso 1: Restaurante y sucursal */}
      {paso === 1 && (
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
          <h2 className="text-xl font-bold text-[#F2B847]">1. Selecciona el restaurante y sucursal</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {restaurantes.map(rest => (
              <div
                key={rest.id}
                onClick={() => setFormData({ ...formData, restauranteId: rest.id.toString() })}
                className={`p-4 border rounded-xl cursor-pointer transition ${
                  formData.restauranteId === rest.id.toString() ? 'border-[#F2B847] bg-[#FDF3D8]' : 'hover:border-[#F2B847]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Store size={24} className="text-[#F2B847]" />
                  <div>
                    <h3 className="font-semibold">{rest.nombre}</h3>
                    <p className="text-sm text-gray-600">Sucursales: {rest.sucursales.join(', ')}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {formData.restauranteId && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Sucursal</label>
              <select
                name="sucursal"
                value={formData.sucursal}
                onChange={handleChange}
                className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F2B847]"
              >
                <option value="">Selecciona sucursal</option>
                {restaurantes.find(r => r.id === parseInt(formData.restauranteId))?.sucursales.map(suc => (
                  <option key={suc} value={suc}>{suc}</option>
                ))}
              </select>
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={siguientePaso}
              disabled={!formData.restauranteId || !formData.sucursal}
              className="flex items-center gap-2 bg-[#F2B847] text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}

      {/* Paso 2: Fecha y hora */}
      {paso === 2 && (
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
          <h2 className="text-xl font-bold text-[#F2B847]">2. Selecciona fecha y hora</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Fecha</label>
              <input
                type="date"
                name="fecha"
                value={formData.fecha}
                onChange={handleChange}
                className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F2B847]"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Hora</label>
              <select
                name="hora"
                value={formData.hora}
                onChange={handleChange}
                className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F2B847]"
              >
                <option value="">Selecciona hora</option>
                {horariosDisponibles.map(hora => (
                  <option key={hora} value={hora}>{hora}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={anteriorPaso}
              className="px-6 py-3 border border-gray-300 rounded-xl font-semibold hover:bg-gray-100 transition"
            >
              Anterior
            </button>
            <button
              onClick={siguientePaso}
              disabled={!formData.fecha || !formData.hora}
              className="flex items-center gap-2 bg-[#F2B847] text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}

      {/* Paso 3: Mesa y anticipo */}
      {paso === 3 && (
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
          <h2 className="text-xl font-bold text-[#F2B847]">3. Mesa y anticipo</h2>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Número de personas</label>
              <input
                type="number"
                name="personas"
                value={formData.personas}
                onChange={handleChange}
                min="1"
                max="12"
                className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F2B847]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Mesa preferida (opcional)</label>
              <select
                name="mesa"
                value={formData.mesa}
                onChange={handleChange}
                className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F2B847]"
              >
                <option value="">Automática (mejor disponible)</option>
                <option value="Mesa 1 (4 personas)">Mesa 1 (4 personas)</option>
                <option value="Mesa 5 (6 personas)">Mesa 5 (6 personas)</option>
                <option value="Mesa 12 (8 personas)">Mesa 12 (8 personas)</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="anticipo"
                checked={formData.anticipo}
                onChange={handleCheckbox}
                className="w-5 h-5 text-[#F2B847] border-gray-300 rounded"
              />
              <label htmlFor="anticipo" className="text-sm font-medium text-gray-700">
                Requiere anticipo (obligatorio en algunos casos)
              </label>
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={anteriorPaso}
              className="px-6 py-3 border border-gray-300 rounded-xl font-semibold hover:bg-gray-100 transition"
            >
              Anterior
            </button>
            <button
              onClick={siguientePaso}
              className="flex items-center gap-2 bg-[#F2B847] text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}

      {/* Paso 4: Confirmación */}
      {paso === 4 && (
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
          <h2 className="text-xl font-bold text-[#F2B847]">4. Confirmar Reserva</h2>

          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-xl">
              <h3 className="font-semibold mb-2">Resumen</h3>
              <p><strong>Restaurante:</strong> {restaurantes.find(r => r.id === parseInt(formData.restauranteId))?.nombre} ({formData.sucursal})</p>
              <p><strong>Fecha y hora:</strong> {formData.fecha} {formData.hora}</p>
              <p><strong>Personas:</strong> {formData.personas}</p>
              <p><strong>Mesa:</strong> {formData.mesa || 'Automática'}</p>
              <p><strong>Anticipo:</strong> {formData.anticipo ? 'Sí' : 'No'}</p>
            </div>

            <div className="flex justify-between">
              <button
                onClick={anteriorPaso}
                className="px-6 py-3 border border-gray-300 rounded-xl font-semibold hover:bg-gray-100 transition"
              >
                Anterior
              </button>
              <button
                onClick={confirmarReserva}
                className="flex items-center gap-2 bg-[#F2B847] text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition"
              >
                <Check size={18} />
                Confirmar Reserva
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}