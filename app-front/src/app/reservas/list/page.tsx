'use client';

import { useState, useEffect } from 'react';
import { Users, DollarSign, CheckCircle, XCircle, AlertCircle, Plus } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';

export default function MisReservasPage() {
  const [reservas, setReservas] = useState<any[]>([]);
  const [filtroEstado, setFiltroEstado] = useState('Todas');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar reservas reales del backend
  useEffect(() => {
    const cargarReservas = async () => {
      try {
        const response = await api.get('/reservas/list');
        // Maneja si viene envuelto en { data: [...], result: true, etc. }
        let data = response.data;
        if (data && data.data && Array.isArray(data.data)) data = data.data;
        else if (data && data.result && Array.isArray(data.result)) data = data.result;
        else if (!Array.isArray(data)) data = [];

        setReservas(data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'No se pudieron cargar las reservas');
        console.error('Error al cargar reservas:', err);
      } finally {
        setLoading(false);
      }
    };

    cargarReservas();
  }, []);

  // Filtrar por estado
  const reservasFiltradas = reservas.filter(reserva =>
    filtroEstado === 'Todas' || reserva.estado === filtroEstado
  );

  // Colores por estado (para que se vea bonito como en tu diseño anterior)
  const estadoColor = (estado: string) => {
    switch (estado) {
      case 'Confirmada': return 'bg-green-100 text-green-800';
      case 'Pendiente': return 'bg-yellow-100 text-yellow-800';
      case 'Cancelada': return 'bg-red-100 text-red-800';
      case 'No-show': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-[#F2B847]">
          Mis Reservas
        </h1>

        {/* Botón Nueva Reserva */}
        <Link href="/reservas">
          <button className="mt-4 md:mt-0 flex items-center gap-2 bg-[#F2B847] text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition">
            <Plus size={20} />
            Nueva Reserva
          </button>
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-6">
          {error}
        </div>
      )}

      {/* Filtro por estado */}
      <div className="mb-6 flex flex-wrap gap-3">
        {['Todas', 'Confirmada', 'Pendiente', 'Cancelada', 'No-show'].map(estado => (
          <button
            key={estado}
            onClick={() => setFiltroEstado(estado)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              filtroEstado === estado
                ? 'bg-[#F2B847] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {estado}
          </button>
        ))}
      </div>

      {/* Tabla de reservas */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Restaurante
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha y Hora
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mesa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Personas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Anticipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                    Cargando reservas...
                  </td>
                </tr>
              ) : reservasFiltradas.length > 0 ? (
                reservasFiltradas.map((reserva: any) => (
                  <tr key={reserva.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {reserva.restaurante || 'No disponible'} ({reserva.sucursal || ''})
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {reserva.fecha} {reserva.hora}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {reserva.mesa || 'Automática'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {reserva.numero || reserva.personas || '?'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${estadoColor(reserva.estado || 'Pendiente')}`}>
                        {reserva.estado || 'Pendiente'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {reserva.anticipo ? 'Sí' : 'No'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link href={`/reservas/${reserva.id}`}>
                        <button className="text-[#F2B847] hover:text-[#d89f3a] transition">
                          Ver detalle
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                    No tienes reservas en este estado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Función auxiliar para colores de estado (puedes personalizar)
const estadoColor = (estado: string) => {
  switch (estado) {
    case 'Confirmada': return 'bg-green-100 text-green-800';
    case 'Pendiente': return 'bg-yellow-100 text-yellow-800';
    case 'Cancelada': return 'bg-red-100 text-red-800';
    case 'No-show': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};