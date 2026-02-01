'use client';

import { useState, useEffect } from 'react';
import { BarChart3, Users, Calendar, AlertCircle, Table } from 'lucide-react';
import api from '@/lib/api';

export default function DashboardOcupacion() {
  const [reservasPendientes, setReservasPendientes] = useState(0);
  const [tasas, setTasas] = useState<any>({ total_reservas: 0, no_show: 0, porcentaje_no_show: 0 });
  const [usoMesas, setUsoMesas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarDatos = async () => {
      setLoading(true);
      setError(null);

      try {
        // 1. Reservas pendientes (del listado)
        const resPendientes = await api.get('/reservas/list');
        setReservasPendientes(resPendientes.data?.data?.length || 0);

        // 2. Tasas (última semana como ejemplo)
        const hoy = new Date();
        const semanaPasada = new Date(hoy);
        semanaPasada.setDate(hoy.getDate() - 7);
        const tasasRes = await api.post('/reportes/tasas', {
          fecha_inicio: semanaPasada.toISOString().split('T')[0],
          fecha_fin: hoy.toISOString().split('T')[0]
        });
        setTasas(tasasRes.data?.data || {});

        // 3. Uso de mesas (mes actual)
        const mesActual = hoy.toISOString().slice(0, 7);
        const mesasRes = await api.get('/reportes/uso-mesas', { params: { mes: mesActual } });
        setUsoMesas(mesasRes.data?.data || []);
      } catch (err: any) {
        setError('Error al cargar datos del dashboard');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  // Ocupación simulada (puedes calcularla mejor si tienes datos de mesas totales)
  const ocupacionHoy = { total: 30, ocupadas: 22 }; // Cambia según tus datos reales

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold text-[#F2B847] mb-8 text-center">
        Dashboard de Ocupación
      </h1>

      {loading ? (
        <p className="text-center py-10 text-gray-600">Cargando datos del restaurante...</p>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl text-center">
          {error}
        </div>
      ) : (
        <>
          {/* Tarjetas principales */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center border-t-4 border-[#F2B847]">
              <Calendar size={48} className="mx-auto text-[#F2B847] mb-4" />
              <h3 className="text-xl font-bold text-gray-800">Reservas Pendientes</h3>
              <p className="text-5xl font-extrabold text-[#F2B847] mt-2">{reservasPendientes}</p>
              <p className="text-gray-600 mt-1">Activas y por confirmar</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 text-center border-t-4 border-[#F2B847]">
              <Users size={48} className="mx-auto text-[#F2B847] mb-4" />
              <h3 className="text-xl font-bold text-gray-800">Ocupación Hoy</h3>
              <p className="text-5xl font-extrabold text-[#F2B847] mt-2">
                {Math.round((ocupacionHoy.ocupadas / ocupacionHoy.total) * 100)}%
              </p>
              <p className="text-gray-600 mt-1">{ocupacionHoy.ocupadas} de {ocupacionHoy.total} mesas</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 text-center border-t-4 border-[#F2B847]">
              <AlertCircle size={48} className="mx-auto text-[#F2B847] mb-4" />
              <h3 className="text-xl font-bold text-gray-800">Tasa No-show (últ. semana)</h3>
              <p className="text-5xl font-extrabold text-[#F2B847] mt-2">
                {tasas.porcentaje_no_show ? `${tasas.porcentaje_no_show}%` : 'N/A'}
              </p>
              <p className="text-gray-600 mt-1">
                {tasas.no_show || 0} de {tasas.total_reservas || 0} reservas
              </p>
            </div>
          </div>

          {/* Tabla de uso de mesas */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <h2 className="text-xl font-bold text-[#F2B847] p-6 pb-4 border-b">
              Uso y Ocupación de Mesas (mes actual)
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mesa
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Reservas
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Confirmadas
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Canceladas
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      No-show
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {usoMesas.length > 0 ? (
                    usoMesas.map((mesa, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Mesa {mesa.idmesa}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {mesa.total_reservas}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {mesa.confirmadas}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {mesa.canceladas}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {mesa.no_show}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                        No hay datos de uso de mesas para este período
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Botón para reportes detallados */}
          <div className="text-center mt-8">
            <a
              href="/reservas/reportes"
              className="inline-flex items-center px-8 py-4 bg-[#F2B847] text-white rounded-xl font-semibold hover:opacity-90 transition"
            >
              Ver Reportes Detallados
            </a>
          </div>
        </>
      )}
    </div>
  );
}