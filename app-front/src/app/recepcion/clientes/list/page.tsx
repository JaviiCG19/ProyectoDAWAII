"use client";

import { useState, useEffect } from "react";
import { User, Phone, CreditCard, Edit, Trash2, Search } from "lucide-react";
import api from "@/lib/api";
import { getClientes } from "@/services/cliente.service";

export default function ListadoClientesPage() {
  const [clientes, setClientes] = useState<any[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);

  // Cargar clientes al montar el componente
  useEffect(() => {
    const cargar = async () => {
      setLoading(true);
      try {
        const data = await getClientes(0, 100);
        setClientes(data);
      } catch (error) {
        console.error("Error al cargar clientes:", error);
      } finally {
        setLoading(false);
      }
    };

    cargar();
  }, []);

  // Eliminar cliente
  const eliminar = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este cliente?")) return;

    try {
      await api.delete(`/clientes/${id}`);
      // Recargar la lista después de eliminar
      const data = await getClientes(0, 100);
      setClientes(data);
    } catch (error) {
      alert("No se pudo eliminar el cliente");
      console.error(error);
    }
  };

  // Editar cliente (prompt simple)
  const editar = async (c: any) => {
    const nombre = prompt("Nuevo nombre", c.nombre);
    const telefono = prompt("Nuevo teléfono", c.telefono);

    if (!nombre || !telefono) return;

    try {
      await api.put(`/clientes/${c.id}`, { nombre, telefono });
      // Recargar la lista después de editar
      const data = await getClientes(0, 100);
      setClientes(data);
    } catch (error) {
      alert("Error al actualizar el cliente");
      console.error(error);
    }
  };

  // Filtrado de clientes
  const clientesFiltrados = clientes.filter(
    (c) =>
      c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.ruc_cc.includes(busqueda)
  );

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
        {/* Título y Buscador */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#F2B847]">
            Listado de Clientes
          </h1>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar por nombre o cédula..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-[#F2B847] transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-2xl md:rounded-3xl shadow-md overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-4 sm:px-6 text-left text-xs md:text-sm font-bold text-gray-600 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-4 py-4 sm:px-6 text-left text-xs md:text-sm font-bold text-gray-600 uppercase tracking-wider">
                    Cédula / RUC
                  </th>
                  <th className="px-4 py-4 sm:px-6 text-left text-xs md:text-sm font-bold text-gray-600 uppercase tracking-wider">
                    Teléfono
                  </th>
                  <th className="px-4 py-4 sm:px-6 text-left text-xs md:text-sm font-bold text-gray-600 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="text-center py-12">
                      <div className="flex justify-center items-center gap-3 text-gray-500">
                        <div className="w-6 h-6 border-4 border-[#F2B847] border-t-transparent rounded-full animate-spin"></div>
                        Cargando clientes...
                      </div>
                    </td>
                  </tr>
                ) : clientesFiltrados.length > 0 ? (
                  clientesFiltrados.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4 sm:px-6 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-yellow-50 rounded-lg">
                            <User size={18} className="text-[#F2B847]" />
                          </div>
                          <span className="font-medium text-gray-900">{c.nombre}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 sm:px-6 whitespace-nowrap text-gray-700">
                        <div className="flex items-center gap-2">
                          <CreditCard size={16} className="text-gray-500" />
                          {c.ruc_cc}
                        </div>
                      </td>
                      <td className="px-4 py-4 sm:px-6 whitespace-nowrap text-gray-700">
                        <div className="flex items-center gap-2">
                          <Phone size={16} className="text-gray-500" />
                          {c.telefono}
                        </div>
                      </td>
                      <td className="px-4 py-4 sm:px-6 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => editar(c)}
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            <Edit size={16} />
                            Editar
                          </button>
                          <button
                            onClick={() => eliminar(c.id)}
                            className="flex items-center gap-1 text-red-500 hover:text-red-700 transition-colors"
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
                    <td colSpan={4} className="text-center py-12 text-gray-500 italic">
                      No se encontraron clientes que coincidan con la búsqueda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}