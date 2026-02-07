'use client';

import { useState, useEffect } from 'react';
import { Search, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';

export default function ListadoClientesPage() {
  const [clientes, setClientes] = useState<any[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar clientes del backend
  useEffect(() => {
    const cargarClientes = async () => {
      try {
        const response = await api.get('/clientes/list');
        
        const data = response.data.data || response.data || [];
        setClientes(Array.isArray(data) ? data : []);
      } catch (err: any) {
        setError(err.response?.data?.message || 'No se pudieron cargar los clientes');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    cargarClientes();
  }, []);

  const clientesFiltrados = clientes.filter((cliente: any) =>
    (cliente.nombre || '').toLowerCase().includes(busqueda.toLowerCase()) ||
    (cliente.ruc_cc || '').toLowerCase().includes(busqueda.toLowerCase()) ||
    (cliente.telefono || '').includes(busqueda)
  );

  const eliminarCliente = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este cliente? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      await api.delete(`/clientes/${id}`);
      // Actualiza la lista quitando el cliente eliminado
      setClientes(clientes.filter(c => c.id !== id));
      alert('Cliente eliminado con éxito');
    } catch (err: any) {
      alert('Error al eliminar: ' + (err.response?.data?.message || 'Intenta de nuevo'));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-[#F2B847]">
          Listado de Clientes
        </h1>

        {/* Búsqueda */}
        <div className="relative w-full md:w-80 mt-4 md:mt-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Buscar por nombre, RUC/CC o teléfono..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F2B847]"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-6">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  RUC/CC
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Teléfono
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                    Cargando clientes...
                  </td>
                </tr>
              ) : clientesFiltrados.length > 0 ? (
                clientesFiltrados.map((cliente: any) => (
                  <tr key={cliente.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {cliente.nombre}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {cliente.ruc_cc}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {cliente.telefono}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-4">
                        <Link href={`/editar/${cliente.id}`}>
                          <button className="flex items-center gap-1 text-[#F2B847] hover:text-[#d89f3a] transition">
                            <Edit size={16} />
                            Editar
                          </button>
                        </Link>

                        <button
                          onClick={() => eliminarCliente(cliente.id)}
                          className="flex items-center gap-1 text-red-600 hover:text-red-800 transition"
                        >
                          <Trash2 size={16} />
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                    No se encontraron clientes
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