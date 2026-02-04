"use client";

import { useEffect, useState } from "react";
import { User, Phone, CreditCard, Edit, Trash2, Search } from "lucide-react";
import api from "@/lib/api";

export default function ListadoClientesPage() {
  const [clientes, setClientes] = useState<any[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);

  const cargar = async () => {
    setLoading(true);
    try {
      const res = await api.get("/clientes/list");
      const data = res.data?.data || [];
      setClientes(data);
    } catch (error) {
      console.error("Error al cargar clientes", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const eliminar = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este cliente?")) return;
    try {
      await api.delete(`/clientes/${id}`);
      cargar();
    } catch (error) {
      alert("No se pudo eliminar el cliente");
    }
  };

  const editar = async (c: any) => {
    const nombre = prompt("Nuevo nombre", c.nombre);
    const telefono = prompt("Nuevo teléfono", c.telefono);

    if (!nombre || !telefono) return;

    try {
      await api.put(`/clientes/${c.id}`, { nombre, telefono });
      cargar();
    } catch (error) {
      alert("Error al actualizar el cliente");
    }
  };

  // Lógica de filtrado
  const clientesFiltrados = clientes.filter(
    (c) =>
      c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.ruc_cc.includes(busqueda)
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Título y Buscador */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h1 className="text-3xl font-extrabold text-[#F2B847]">
          Listado de Clientes
        </h1>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Buscar por nombre o cédula..."
            className="w-full md:w-80 pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F2B847] transition-all shadow-sm"
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
      </div>

      {/* Tabla con Estilo "Mis Reservas" */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-6 py-4 text-left font-bold uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-4 text-left font-bold uppercase tracking-wider">Cédula / RUC</th>
                <th className="px-6 py-4 text-left font-bold uppercase tracking-wider">Teléfono</th>
                <th className="px-6 py-4 text-left font-bold uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="text-center py-10">
                    <div className="flex justify-center items-center gap-2 text-gray-500">
                      <div className="w-5 h-5 border-2 border-[#F2B847] border-t-transparent rounded-full animate-spin"></div>
                      Cargando clientes...
                    </div>
                  </td>
                </tr>
              ) : clientesFiltrados.length > 0 ? (
                clientesFiltrados.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-50 rounded-lg">
                          <User size={16} className="text-[#F2B847]" />
                        </div>
                        <span className="font-semibold text-gray-700">{c.nombre}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <CreditCard size={14} />
                        {c.ruc_cc}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone size={14} />
                        {c.telefono}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => editar(c)}
                          className="flex items-center gap-1 text-blue-600 font-bold hover:text-blue-800 transition-colors"
                        >
                          <Edit size={16} />
                          Editar
                        </button>
                        <button
                          onClick={() => eliminar(c.id)}
                          className="flex items-center gap-1 text-red-500 font-bold hover:text-red-700 transition-colors"
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
                  <td colSpan={4} className="text-center py-10 text-gray-400 italic">
                    No se encontraron clientes que coincidan con la búsqueda.
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