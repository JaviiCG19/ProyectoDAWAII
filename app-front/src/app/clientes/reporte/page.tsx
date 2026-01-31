'use client';

import { useState } from 'react';
import { BarChart3, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

export default function ReportesReservasPage() {
  // Datos simulados (después de API real)
  const [reservas] = useState([
    { id: 1, fecha: '2026-02-05', estado: 'Confirmada' },
    { id: 2, fecha: '2026-02-05', estado: 'Confirmada' },
    { id: 3, fecha: '2026-02-06', estado: 'No-show' },
    { id: 4, fecha: '2026-02-06', estado: 'Cancelada' },
    { id: 5, fecha: '2026-02-07', estado: 'Confirmada' },
  ]);

  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  // Filtrar por fechas
  const reservasFiltradas = reservas.filter(reserva => {
    if (!fechaInicio && !fechaFin) return true;
    const fechaRes = new Date(reserva.fecha);
    const inicio = fechaInicio ? new Date(fechaInicio) : null;
    const fin = fechaFin ? new Date(fechaFin) : null;
    return (!inicio || fechaRes >= inicio) && (!fin || fechaRes <= fin);
  });

  // Métricas
  const totalReservas = reservasFiltradas.length;
  const confirmadas = reservasFiltradas.filter(r => r.estado === 'Confirmada').length;
  const canceladas = reservasFiltradas.filter(r => r.estado === 'Cancelada').length;
  const noShows = reservasFiltradas.filter(r => r.estado === 'No-show').length;
  const porcNoShow = totalReservas > 0 ? Math.round((noShows / totalReservas) * 100) : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold text-[#F2B847] mb-8">
        Reportes de Reservas
      </h1>

      {/* Filtros por fecha */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Inicio</label>
            <input
              type="date"
              value={fechaInicio}
              onChange={e => setFechaInicio(e.target.value)}
              className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F2B847]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Fin</label>
            <input
              type="date"
              value={fechaFin}
              onChange={e => setFechaFin(e.target.value)}
              className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F2B847]"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={() => { setFechaInicio(''); setFechaFin(''); }}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition"
            >
              Limpiar Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Tarjetas de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
          <BarChart3 size={32} className="mx-auto text-[#F2B847] mb-2" />
          <p className="text-3xl font-bold">{totalReservas}</p>
          <p className="text-sm text-gray-600">Total Reservas</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
          <CheckCircle size={32} className="mx-auto text-green-600 mb-2" />
          <p className="text-3xl font-bold">{confirmadas}</p>
          <p className="text-sm text-gray-600">Confirmadas</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
          <XCircle size={32} className="mx-auto text-red-600 mb-2" />
          <p className="text-3xl font-bold">{canceladas}</p>
          <p className="text-sm text-gray-600">Canceladas</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
          <AlertCircle size={32} className="mx-auto text-orange-600 mb-2" />
          <p className="text-3xl font-bold">{porcNoShow}%</p>
          <p className="text-sm text-gray-600">No-Show</p>
        </div>
      </div>

      {/* Tabla detallada */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reservasFiltradas.length > 0 ? (
                reservasFiltradas.map(reserva => (
                  <tr key={reserva.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {reserva.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {reserva.fecha}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        reserva.estado === 'Confirmada' ? 'bg-green-100 text-green-800' :
                        reserva.estado === 'Cancelada' ? 'bg-red-100 text-red-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {reserva.estado}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                    No hay reservas en el rango seleccionado
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