'use client';

import { useState, useEffect } from 'react';
import { Calendar, Users, Table, BarChart3 } from 'lucide-react';
import api from '@/lib/api';

export default function ReportesPage() {
  const [reporteActivo, setReporteActivo] = useState('periodo');
  const [datos, setDatos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filtros comunes
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [limitClientes, setLimitClientes] = useState(10);

  const cargarReporte = async () => {
    setLoading(true);
    setError(null);
    setDatos([]);

    try {
      let response;

      switch (reporteActivo) {
        case 'periodo':
          if (!fechaInicio || !fechaFin) throw new Error('Selecciona rango de fechas');
          response = await api.get('/reportes/periodo', {
            params: { inicio: fechaInicio, fin: fechaFin }
          });
          break;

        case 'top-clientes':
          response = await api.get('/reportes/top-clientes', {
            params: { limit: limitClientes }
          });
          break;

        case 'uso-mesas':
          response = await api.get('/reportes/uso-mesas', {
            params: fechaInicio ? { mes: fechaInicio.slice(0, 7) } : {}
          });
          break;

        case 'tasas':
          if (!fechaInicio || !fechaFin) throw new Error('Selecciona rango de fechas');
          response = await api.post('/reportes/tasas', {
            fecha_inicio: fechaInicio,
            fecha_fin: fechaFin
          });
          break;

        default:
          return;
      }

      const data = response?.data?.data || [];
      setDatos(Array.isArray(data) ? data : [data]);
    } catch (err: any) {
      setError(err.message || err.response?.data?.message || 'Error al cargar reporte');
      console.error('Error completo:', err);
    } finally {
      setLoading(false);
    }
  };

  // Recargar al cambiar reporte o filtros clave
  useEffect(() => {
    if (reporteActivo === 'tasas' || reporteActivo === 'periodo') {
      // Espera a que el usuario seleccione fechas y presione botón
    } else {
      cargarReporte();
    }
  }, [reporteActivo, limitClientes]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold text-[#F2B847] mb-8 text-center">
        Reportes y Estadísticas
      </h1>

      {/* Pestañas de reportes */}
      <div className="flex flex-wrap gap-3 mb-8 justify-center">
        {[
          { id: 'periodo', label: 'Por Período', icon: Calendar },
          { id: 'top-clientes', label: 'Top Clientes', icon: Users },
          { id: 'uso-mesas', label: 'Uso de Mesas', icon: Table },
          { id: 'tasas', label: 'Tasas de Asistencia', icon: BarChart3 },
        ].map((rep) => (
          <button
            key={rep.id}
            onClick={() => setReporteActivo(rep.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition ${
              reporteActivo === rep.id
                ? 'bg-[#F2B847] text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <rep.icon size={20} />
            {rep.label}
          </button>
        ))}
      </div>

      {/* Filtros según reporte */}
      {(reporteActivo === 'periodo' || reporteActivo === 'tasas') && (
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-[#F2B847] mb-4">Rango de fechas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Inicio</label>
              <input
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F2B847]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fin</label>
              <input
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F2B847]"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={cargarReporte}
                disabled={loading || !fechaInicio || !fechaFin}
                className="bg-[#F2B847] text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 disabled:opacity-50"
              >
                {loading ? 'Cargando...' : 'Generar Reporte'}
              </button>
            </div>
          </div>
        </div>
      )}

      {reporteActivo === 'top-clientes' && (
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-[#F2B847] mb-4">Número de clientes a mostrar</h2>
          <input
            type="number"
            value={limitClientes}
            onChange={(e) => setLimitClientes(Number(e.target.value))}
            min="1"
            max="50"
            className="w-32 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F2B847]"
          />
          <button
            onClick={cargarReporte}
            disabled={loading}
            className="ml-4 bg-[#F2B847] text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 disabled:opacity-50"
          >
            {loading ? 'Cargando...' : 'Ver Reporte'}
          </button>
        </div>
      )}

      {/* Resultados */}
      {loading && <p className="text-center py-10 text-gray-600">Cargando reporte...</p>}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-6">
          {error}
        </div>
      )}

      {datos.length > 0 && !loading && (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {reporteActivo === 'periodo' && (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pendientes</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Confirmadas</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Canceladas</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No-show</th>
                    </>
                  )}
                  {reporteActivo === 'top-clientes' && (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reservas</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Personas</th>
                    </>
                  )}
                  {reporteActivo === 'uso-mesas' && (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mesa</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Reservas</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Confirmadas</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Canceladas</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No-show</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {datos.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    {reporteActivo === 'periodo' && (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap">{item.fecha}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{item.total}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{item.pendientes}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{item.confirmadas}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{item.canceladas}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{item.no_show}</td>
                      </>
                    )}
                    {reporteActivo === 'top-clientes' && (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap">{item.nombre || 'Cliente ' + item.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{item.total_reservas}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{item.total_personas}</td>
                      </>
                    )}
                    {reporteActivo === 'uso-mesas' && (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap">Mesa {item.idmesa}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{item.total_reservas}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{item.confirmadas}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{item.canceladas}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{item.no_show}</td>
                      </>
                    )}
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