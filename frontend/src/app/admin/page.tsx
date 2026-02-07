"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  Loader2,
  Store,
  Edit3,
  Trash2,
  LayoutGrid,
  Users, 
} from "lucide-react";
import { useAuth } from "@/services/useAuth";
import {
  getEmpresas,
  eliminarEmpresa,
} from "@/services/empresa.service";
import { Restaurante } from "@/interface/Restaurante";
import ModalEmpresa from "@/components/modals/ModalEmpresa";
import ModalConfirmacionEmpresa from "@/components/modals/ModalConfirmacionEmpresa";
import ModalPapeleraEmpresa from "@/components/modals/ModalPapeleraEmpresa";

export default function AdminPage() {
  const router = useRouter();
  const checkingAuth = useAuth(["1"]);

  const [empresas, setEmpresas] = useState<Restaurante[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [empresaEdit, setEmpresaEdit] = useState<Restaurante | null>(null);
  const [empresaToDelete, setEmpresaToDelete] = useState<Restaurante | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isTrashOpen, setIsTrashOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchEmpresas = async () => {
    setLoading(true);
    const data = await getEmpresas();
    setEmpresas(data);
    setLoading(false);
  };

  useEffect(() => {
    if (!checkingAuth) fetchEmpresas();
  }, [checkingAuth]);

  if (checkingAuth) return null;

  const filtered = empresas.filter(
    (e) =>
      e.nomleg.toLowerCase().includes(search.toLowerCase()) ||
      e.nomfan.toLowerCase().includes(search.toLowerCase()) ||
      e.ruc.includes(search)
  );

  const handleDelete = async () => {
    if (!empresaToDelete?.id) return;
    setIsDeleting(true);
    await eliminarEmpresa(empresaToDelete.id);
    setIsDeleteModalOpen(false);
    setEmpresaToDelete(null);
    setIsDeleting(false);
    fetchEmpresas();
  };

  return (
    <div className="space-y-8 p-6">
    
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Gestión de Restaurantes
          </h1>
          <p className="text-sm text-gray-500">
            Administra los restaurantes y sucursales de tu red gastronómica
          </p>
        </div>

        <div className="flex gap-2">

          <button
            onClick={() => setIsTrashOpen(true)}
            className="px-3 py-2 border rounded-lg text-gray-500 hover:bg-gray-100"
          >
            <Trash2 size={18} />
          </button>
      
          <button
            onClick={() => router.push("/admin/usuarios")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-md transition-all active:scale-95"
          >
            <Users size={18} /> Personal
          </button>


          <button
            onClick={() => {
              setEmpresaEdit(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#dc902b] text-white hover:bg-[#c57d23] shadow-md transition-all active:scale-95"
          >
            <Plus size={18} /> Añadir restaurante
          </button>
        </div>
      </div>

    
      <div className="relative max-w-md">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={18}
        />
        <input
          placeholder="Buscar por nombre o RUC..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-3 py-2 border rounded-xl focus:ring-2 focus:ring-[#dc902b] outline-none"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-[#dc902b]" size={40} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((e) => (
            <div
              key={e.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between hover:shadow-md transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">
                    Restaurante
                  </span>
                  <h3 className="font-bold text-lg text-gray-800 leading-tight">
                    {e.nomfan}
                  </h3>
                  <p className="text-sm text-gray-500 italic truncate max-w-45">
                    {e.nomleg}
                  </p>
                  <div className="mt-2 inline-block bg-gray-100 px-2 py-1 rounded text-[11px] font-mono text-gray-600">
                    RUC: {e.ruc}
                  </div>
                </div>

                <div className="bg-orange-50 p-3 rounded-xl text-[#dc902b]">
                  <Store size={24} />
                </div>
              </div>

    
              <div className="flex justify-between pt-4 border-t border-gray-50 items-center">
                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      setEmpresaEdit(e);
                      setIsModalOpen(true);
                    }}
                    className="flex items-center gap-1 text-blue-600 text-sm font-medium hover:text-blue-800"
                  >
                    <Edit3 size={16} /> Editar
                  </button>

                  <button
                    onClick={() => {
                      setEmpresaToDelete(e);
                      setIsDeleteModalOpen(true);
                    }}
                    className="flex items-center gap-1 text-red-500 text-sm font-medium hover:text-red-700"
                  >
                    <Trash2 size={16} /> Eliminar
                  </button>
                </div>

                <button
                  onClick={() =>
                    router.push(`/admin/restaurantes/${e.id}/sucursales`)
                  }
                  className="flex items-center gap-1 text-[#dc902b] text-xs font-bold uppercase hover:bg-orange-50 px-2 py-1 rounded-md"
                >
                  <LayoutGrid size={16} /> Ver sucursales
                </button>
              </div>
            </div>
          ))}
        </div>
      )}


      {isModalOpen && (
        <ModalEmpresa
          alCerrar={() => setIsModalOpen(false)}
          alGuardar={fetchEmpresas}
          empresaEdit={empresaEdit}
        />
      )}

      <ModalConfirmacionEmpresa
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        titulo="¿Eliminar Restaurante?"
        mensaje={`Se desactivará "${empresaToDelete?.nomfan}"`}
        loading={isDeleting}
      />

      <ModalPapeleraEmpresa
        isOpen={isTrashOpen}
        onClose={() => setIsTrashOpen(false)}
        onRestored={fetchEmpresas}
      />
    </div>
  );
}