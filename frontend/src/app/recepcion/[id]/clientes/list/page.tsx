"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { User, Phone, CreditCard, Edit, Trash2, Search } from "lucide-react";
import api from "@/lib/api";
import { getClientes } from "@/services/cliente.service";

import ModalConfirmacionEliminar from "@/components/modals/ModalConfirmacionEliminar";
import ModalEditarCliente from "@/components/modals/ModalEditarCliente";

export default function ListadoClientesPage() {
  const params = useParams();
  const localId = Number(params?.id); // Obtenemos el ID de la sucursal desde la URL

  const [clientes, setClientes] = useState<any[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [clienteToDelete, setClienteToDelete] = useState<number | null>(null);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [clienteToEdit, setClienteToEdit] = useState<any | null>(null);

  const cargarClientes = async () => {
    if (!localId || isNaN(localId)) {
      console.error("No se encontró ID de sucursal en la URL");
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await getClientes(localId, 0, 100); // ← Ahora pasa localId
      setClientes(data);
    } catch (error) {
      console.error("Error al cargar clientes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarClientes();
  }, [localId]); // Se recarga si cambia la sucursal

  // Abrir modal de eliminar
  const handleOpenDelete = (id: number) => {
    setClienteToDelete(id);
    setDeleteModalOpen(true);
  };

  // Confirmar eliminación
  const handleConfirmDelete = async () => {
    if (!clienteToDelete) return;

    try {
      await api.delete(`/reservas/clientes/${clienteToDelete}`);

      // Recargar lista con el mismo localId
      await cargarClientes();

      alert("Cliente eliminado correctamente");
    } catch (error: any) {
      console.error("Error al eliminar cliente:", error);
      console.log("Respuesta del servidor:", error.response?.data);

      let mensaje = "No se pudo eliminar el cliente";

      if (error.response?.status === 404) {
        mensaje = "Cliente no encontrado";
      } else if (error.response?.status === 400 || error.response?.status === 422) {
        mensaje = error.response?.data?.message || "El cliente tiene reservas asociadas";
      } else if (error.response?.status === 403) {
        mensaje = "No tienes permiso para eliminar este cliente";
      }

      alert(mensaje);
    } finally {
      setDeleteModalOpen(false);
      setClienteToDelete(null);
    }
  };

  // Editar
  const handleOpenEdit = (c: any) => {
    setClienteToEdit(c);
    setEditModalOpen(true);
  };

  const handleSaveEdit = async (nombre: string, telefono: string) => {
    if (!clienteToEdit) return;
    try {
      await api.put(`/reservas/clientes/${clienteToEdit.id}`, { nombre, telefono });

      // Recargar lista con el mismo localId
      await cargarClientes();
    } catch (error) {
      alert("Error al actualizar el cliente");
      console.error(error);
    } finally {
      setEditModalOpen(false);
      setClienteToEdit(null);
    }
  };

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
                            onClick={() => handleOpenEdit(c)}
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            <Edit size={16} />
                            Editar
                          </button>
                          <button
                            onClick={() => handleOpenDelete(c.id)}
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

      {/* Modales */}
      <ModalConfirmacionEliminar
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />

      <ModalEditarCliente
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        cliente={clienteToEdit}
        onSave={handleSaveEdit}
      />
    </div>
  );
}