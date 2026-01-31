'use client';

import { useState } from 'react';
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle, Plus } from 'lucide-react';
import Link from 'next/link';

export default function MisReservasPage() {
  // Datos simulados (después vendrán de API)
  const [reservas] = useState([
    {
      id: 1,
      restaurante: 'La Parrilla Dorada',
      sucursal: 'Samborondón',
      fecha: '2026-02-05',
      hora: '20:00',
      mesa: 'Mesa 12 (4 personas)',
      estado: 'Confirmada',
      anticipo: true,
    },
    {
      id: 2,
      restaurante: 'El Sabor del Mar',
      sucursal: 'Urdesa',
      fecha: '2026-02-10',
      hora: '19:30',
      mesa: 'Mesa 5 (6 personas)',
      estado: 'Pendiente',
      anticipo: false,
    },
    {
      id: 3,
      restaurante: 'La Parrilla Dorada',
      sucursal: 'Samborondón',
      fecha: '2026-01-28',
      hora: '21:00',
      mesa: 'Mesa 8 (2 personas)',
      estado: 'Cancelada',
      anticipo: true,
    },
  ]);

  const [filtroEstado, setFiltroEstado] = useState('Todas');

  // Filtrar por estado
  const reservasFiltradas = reservas.filter(reserva =>
    filtroEstado === 'Todas' || reserva.estado === filtroEstado
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-[#F2B847]">
          Mis Reservas
        </h1>

        {/* Botón Nueva Reserva */}
        <Link href="/crearReserva">
          <button className="mt-4 md:mt-0 flex items-center gap-2 bg-[#F2B847] text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition">
            <Plus size={20} />
            Nueva Reserva
          </button>
        </Link>
      </div>

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
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Anticipo
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reservasFiltradas.length > 0 ? (
                reservasFiltradas.map(reserva => (
                  <tr key={reserva.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {reserva.restaurante} ({reserva.sucursal})
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {reserva.fecha} {reserva.hora}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {reserva.mesa}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        reserva.estado === 'Confirmada' ? 'bg-green-100 text-green-800' :
                        reserva.estado === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' :
                        reserva.estado === 'Cancelada' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {reserva.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {reserva.anticipo ? 'Sí' : 'No'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
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