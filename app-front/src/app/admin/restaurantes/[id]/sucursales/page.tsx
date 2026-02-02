"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, MapPin, Utensils, Loader2, 
  Plus, Users, Edit3, Trash2, Search 
} from "lucide-react";
import { getSucursalesByEmpresa, eliminarSucursal } from "@/services/local.service";
import { Sucursal } from "@/interface/Sucursal";
import ModalSucursal from "@/components/modals/ModalSucursal";
import ModalConfirmacion from "@/components/modals/ModalConfirmacion";
import ModalPapelera from "@/components/modals/ModalPapelera"; 

export default function SucursalesPage() {
  const params = useParams();
  const router = useRouter();
  
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(""); 
  
  //Estados para Modales
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTrashOpen, setIsTrashOpen] = useState(false); 
  const [selectedSucursal, setSelectedSucursal] = useState<Sucursal | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [sucursalToDelete, setSucursalToDelete] = useState<Sucursal | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchSucursales = useCallback(async () => {
    if (params.id) {
      setLoading(true);
      try {
        const data = await getSucursalesByEmpresa(Number(params.id));
        setSucursales(data);
      } catch (err) {
        console.error("Error al cargar sucursales:", err);
      } finally {
        setLoading(false);
      }
    }
  }, [params.id]);

  useEffect(() => {
    fetchSucursales();
  }, [fetchSucursales]);

  
  const filteredSucursales = sucursales.filter(
    (s) =>
      s.detalle.toLowerCase().includes(search.toLowerCase()) ||
      s.direccion.toLowerCase().includes(search.toLowerCase())
  );

  //MANEJADORES
  const handleNuevaSucursal = () => {
    setSelectedSucursal(null);
    setIsModalOpen(true);
  };

  const handleEditarSucursal = (sucursal: Sucursal) => {
    setSelectedSucursal(sucursal);
    setIsModalOpen(true);
  };

  const openDeleteModal = (sucursal: Sucursal) => {
    setSucursalToDelete(sucursal);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!sucursalToDelete?.id) return;
    setIsDeleting(true);
    try {
      const response = await eliminarSucursal(sucursalToDelete.id);
      if (response.result) {
        setSucursales((prev) => prev.filter((s) => s.id !== sucursalToDelete.id));
        setIsDeleteModalOpen(false);
      }
    } catch (error) {
      console.error("Error al eliminar:", error);
    } finally {
      setIsDeleting(false);
      setSucursalToDelete(null);
    }
  };

  return (
    <div className="space-y-6 p-6">
     
      <div className="flex justify-between items-center">
        <button
          onClick={() => router.push("/admin")}
          className="flex items-center gap-2 text-gray-500 hover:text-[#dc902b] transition-colors font-medium"
        >
          <ArrowLeft size={20} /> Volver
        </button>

        <div className="flex gap-3">
        
          <button
            onClick={() => setIsTrashOpen(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 transition-all shadow-sm"
            title="Ver eliminados"
          >
            <Trash2 size={18} />
          </button>

          <button
            onClick={handleNuevaSucursal}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#dc902b] text-white hover:bg-[#c57d23] shadow-md transition-all active:scale-95"
          >
            <Plus size={18} /> Nueva Sucursal
          </button>
        </div>
      </div>

      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-800">Sucursales</h1>
        <p className="text-sm text-gray-500">Gestiona las sedes de este restaurante</p>
      </div>

     
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          placeholder="Buscar por nombre o dirección..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-3 py-2 border rounded-xl focus:ring-2 focus:ring-[#dc902b] outline-none transition-all"
        />
      </div>

    
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-[#dc902b]" size={40} />
        </div>
      ) : filteredSucursales.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <Utensils className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="text-gray-500 font-medium">
            {search ? "No se encontraron coincidencias" : "No hay sucursales registradas"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSucursales.map((s) => (
            <div
              key={s.id}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-orange-50 p-2.5 rounded-xl text-[#dc902b]">
                      <Utensils size={22} />
                    </div>
                    <h3 className="font-bold text-xl text-gray-800">{s.detalle}</h3>
                  </div>
                  <div className="flex items-start gap-2 text-gray-500">
                    <MapPin size={18} className="mt-0.5 text-orange-300" />
                    <p className="text-sm">{s.direccion}</p>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-2 rounded-xl text-center min-w-[80px]">
                  <span className="block text-[10px] font-bold text-gray-400 uppercase">Mesas</span>
                  <span className="text-2xl font-black text-[#dc902b]">{s.totmesas}</span>
                </div>
              </div>
              <div className="flex justify-between pt-4 border-t border-gray-50 items-center">
                <div className="flex gap-4">
                  <button
                    onClick={() => handleEditarSucursal(s)}
                    className="flex items-center gap-1 text-blue-600 text-sm font-medium hover:text-blue-800 transition-colors"
                  >
                    <Edit3 size={16} /> Editar
                  </button>
                  <button
                    onClick={() => openDeleteModal(s)}
                    className="flex items-center gap-1 text-red-500 text-sm font-medium hover:text-red-700 transition-colors"
                  >
                    <Trash2 size={16} /> Eliminar
                  </button>
                </div>
                <button
                  onClick={() => router.push(`/admin/locales/${s.id}/personal`)}
                  className="flex items-center gap-1 text-[#dc902b] text-xs font-bold uppercase hover:bg-orange-50 px-2 py-1 rounded-md transition-colors"
                >
                  <Users size={16} /> Personal
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

  
      {isModalOpen && (
        <ModalSucursal
          idEmpresa={Number(params.id)}
          onClose={() => setIsModalOpen(false)}
          onSaved={fetchSucursales}
          sucursalEdit={selectedSucursal}
        />
      )}


      <ModalPapelera
        isOpen={isTrashOpen}
        onClose={() => setIsTrashOpen(false)}
        idEmpresa={Number(params.id)}
        onRestored={fetchSucursales}
      />

    
      <ModalConfirmacion
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        titulo="¿Eliminar Sucursal?"
        mensaje={`Esta acción desactivará la sucursal "${sucursalToDelete?.detalle}". ¿Deseas continuar?`}
        loading={isDeleting}
      />
    </div>
  );
}