'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, Users, DollarSign, Check, Store, MapPin } from 'lucide-react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function CrearReservaPage() {
  const router = useRouter();
  const [paso, setPaso] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mesas reales desde el backend
  const [mesasDisponibles, setMesasDisponibles] = useState<any[]>([]);
  const [cargandoMesas, setCargandoMesas] = useState(false);

  // Restaurantes simulados (temporal, hasta que llegue el endpoint de locales)
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
    mesa: ''
  });

  // Cargar mesas disponibles cuando se seleccione fecha y estemos en paso 3
  useEffect(() => {
    if (paso === 3 && formData.fecha) {
      setCargandoMesas(true);
      setError(null);
       
      api.get(`/mesas/disponibles/${formData.fecha}?franja_id=1`)
     // api.get(`/mesas/disponibles/${formData.fecha}`)
        .then(response => {
          const data = response.data.data || response.data || [];
          setMesasDisponibles(Array.isArray(data) ? data : []);
        })
        .catch(err => {
          console.error('Error al cargar mesas:', err);
          setError('No se pudieron cargar las mesas disponibles para esta fecha');
          setMesasDisponibles([]);
        })
        .finally(() => setCargandoMesas(false));
    }
  }, [paso, formData.fecha]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

 

  const siguientePaso = () => setPaso(paso + 1);
  const anteriorPaso = () => setPaso(paso - 1);

  const confirmarReserva = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Validación básica
    if (!formData.restauranteId) {
      setError('Selecciona un restaurante');
      setLoading(false);
      return;
    }
    if (!formData.sucursal) {
      setError('Selecciona una sucursal');
      setLoading(false);
      return;
    }
    if (!formData.fecha) {
      setError('Selecciona una fecha');
      setLoading(false);
      return;
    }
    if (!formData.hora) {
      setError('Selecciona una hora');
      setLoading(false);
      return;
    }
    if (formData.personas < 1) {
      setError('El número de personas debe ser al menos 1');
      setLoading(false);
      return;
    }

    try {
    const payload = {
      idlocal: Number(formData.restauranteId),
      idmesa: formData.mesa ? Number(formData.mesa) : 0,
      idcliente: 12,
      fecha: formData.fecha,
      franja_id: 1,
      numper: Number(formData.personas),
    };

    console.log('📤 Enviando payload:', payload);

    const response = await api.post('/reservas', payload);

    console.log('✅ RESPUESTA BACKEND:', response.data);

    // 🔑 EL BACK DEVUELVE SOLO UN NÚMERO
    const reservaId = response.data?.data;

    if (!reservaId || reservaId === 0) {
      alert('Reserva creada, pero no se recibió el ID');
      router.push('/reservas/list');
      return;
    }

    alert('✅ Reserva creada correctamente');

    // 👉 NUNCA registres anticipo aquí
    // 👉 eso se hace en el DETALLE

    router.push(`/reservas/${reservaId}`);

  } catch (err: any) {
    console.error(' Error completo:', err.response?.data || err);

    if (err.response?.status === 409) {
      setError(err.response.data.message);
    } else {
      setError('Error al crear la reserva');
    }
  } finally {
    setLoading(false);
  }
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

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-6">
          {error}
        </div>
      )}

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
              disabled={!formData.restauranteId || !formData.sucursal || loading}
              className={`flex items-center gap-2 bg-[#F2B847] text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed`}
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
              disabled={loading}
              className="px-6 py-3 border border-gray-300 rounded-xl font-semibold hover:bg-gray-100 transition disabled:opacity-50"
            >
              Anterior
            </button>
            <button
              onClick={siguientePaso}
              disabled={!formData.fecha || !formData.hora || loading}
              className="flex items-center gap-2 bg-[#F2B847] text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}

      {/* Paso 3: Mesa y anticipo - con mesas reales */}
      {paso === 3 && (
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">

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
              <label className="text-sm font-medium text-gray-700">Mesa preferida</label>

              {cargandoMesas ? (
                <p className="text-sm text-gray-600">Cargando mesas disponibles...</p>
              ) : mesasDisponibles.length > 0 ? (
                <select
                  name="mesa"
                  value={formData.mesa}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F2B847]"
                >
                  <option value="">Automática (mejor disponible)</option>
                  {mesasDisponibles.map(mesa => (
                    <option key={mesa.id} value={mesa.id}>
                      Mesa {mesa.numero} ({mesa.maxper} personas)
                    </option>
                  ))}
                </select>
              ) : formData.fecha ? (
                <p className="text-sm text-orange-600">
                  No hay mesas disponibles para {formData.fecha}. Prueba otra fecha.
                </p>
              ) : (
                <p className="text-sm text-gray-600">Selecciona primero una fecha para ver mesas disponibles</p>
              )}
            </div>

            
          </div>

          <div className="flex justify-between">
            <button
              onClick={anteriorPaso}
              disabled={loading}
              className="px-6 py-3 border border-gray-300 rounded-xl font-semibold hover:bg-gray-100 transition disabled:opacity-50"
            >
              Anterior
            </button>
            <button
              onClick={siguientePaso}
              disabled={cargandoMesas || loading}
              className="flex items-center gap-2 bg-[#F2B847] text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50"
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
              <p><strong>Restaurante:</strong> {restaurantes.find(r => r.id === parseInt(formData.restauranteId))?.nombre || 'Local ' + formData.restauranteId} ({formData.sucursal})</p>
              <p><strong>Fecha y hora:</strong> {formData.fecha} {formData.hora}</p>
              <p><strong>Personas:</strong> {formData.personas}</p>
              <p><strong>Mesa:</strong> {formData.mesa ? `Mesa ${formData.mesa}` : 'Automática'}</p>
              
            </div>

            <div className="flex justify-between">
              <button
                onClick={anteriorPaso}
                disabled={loading}
                className="px-6 py-3 border border-gray-300 rounded-xl font-semibold hover:bg-gray-100 transition disabled:opacity-50"
              >
                Anterior
              </button>
              <button
                onClick={confirmarReserva}
                disabled={loading}
                className={`flex items-center gap-2 bg-[#F2B847] text-white px-6 py-3 rounded-xl font-semibold transition ${
                  loading ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90'
                }`}
              >
                <Check size={18} />
                {loading ? 'Creando...' : 'Confirmar Reserva'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}