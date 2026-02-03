'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Calendar, Users, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import api from '@/lib/api';

export default function MisReservasPage() {
  const [reservas, setReservas] = useState<any[]>([]);
  const [busqueda, setBusqueda] = useState('');

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/reservas/list')
      .then(res => {
        const data = res.data?.data || [];
        setReservas(data);
      })
      .finally(() => setLoading(false));
  }, []);

  const estadoTexto = (estado: number) => {
    switch (estado) {
      case 0: return 'Pendiente';
      case 1: return 'Confirmada';
      case 2: return 'Cancelada';
      case 3: return 'No-show';
      case 4: return 'Check-in';
      default: return 'Desconocido';
    }
  };

  const estadoColor = (estado: number) => {
    switch (estado) {
      case 0: return 'bg-yellow-100 text-yellow-800';
      case 1: return 'bg-green-100 text-green-800';
      case 2: return 'bg-red-100 text-red-800';
      case 3: return 'bg-gray-100 text-gray-800';
      case 4: return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const reservasFiltradas = reservas.filter(r =>
  r.id.toString().includes(busqueda) ||
  r.fecha.includes(busqueda)
);


  //const reservasFiltradas = reservas.filter(r =>
   // filtro === 'Todas' || estadoTexto(r.estado) === filtro
  //);

  return (
      <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold text-[#F2B847] mb-6">
        Mis Reservas
      </h1>

     <input
  type="text"
  placeholder="Buscar por fecha o ID…"
  className="w-full md:w-64 p-2 border rounded-xl"
  onChange={(e) => setBusqueda(e.target.value)}
/>


      
          


      {/* Tabla */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-6 py-3 text-left">ID</th>
              <th className="px-6 py-3 text-left">Fecha</th>
              <th className="px-6 py-3 text-left">Personas</th>
              <th className="px-6 py-3 text-left">Estado</th>
              <th className="px-6 py-3 text-left">Acciones</th>
            </tr>
          </thead>
          

          <tbody className="divide-y">
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-6">Cargando...</td>
              </tr>
            ) : reservasFiltradas.map(r => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">{r.id}</td>
                <td className="px-6 py-4">{r.fecha}</td>
                <td className="px-6 py-4">{r.numper}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full font-semibold ${estadoColor(r.estado)}`}>
                    {estadoTexto(r.estado)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <Link
                    href={`/reservas/${r.id}`}
                    className="text-[#F2B847] font-semibold hover:underline"
                  >
                    Ver detalle
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}