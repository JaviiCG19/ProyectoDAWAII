"use client";

import { useEffect, useState } from "react";
import { Trash2, RotateCcw, X, Loader2, AlertCircle } from "lucide-react";
import { getSucursalesEliminadas, restaurarSucursal } from "@/services/local.service";
import { Sucursal } from "@/interface/Sucursal";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  idEmpresa: number;
  onRestored: () => void; 
}

export default function ModalPapelera({ isOpen, onClose, idEmpresa, onRestored }: Props) {
  const [eliminados, setEliminados] = useState<Sucursal[]>([]);
  const [loading, setLoading] = useState(true);
  const [restoringId, setRestoringId] = useState<number | null>(null);

  const fetchEliminados = async () => {
    setLoading(true);
    try {
      const response = await getSucursalesEliminadas(idEmpresa);
      if (response.result) {
        setEliminados(response.data);
      }
    } catch (error) {
      console.error("Error al cargar papelera:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) fetchEliminados();
  }, [isOpen]);

  const handleRestaurar = async (id: number) => {
    setRestoringId(id);
    try {
      const response = await restaurarSucursal(id);
      if (response.result) {
        setEliminados((prev) => prev.filter((s) => s.id !== id));
        onRestored();
      }
    } catch (error) {
      console.error("Error al restaurar:", error);
    } finally {
      setRestoringId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-70 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
   
        <div className="bg-gray-50 p-6 border-b flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-gray-200 p-2 rounded-lg text-gray-600">
              <Trash2 size={20} />
            </div>
            <div>
              <h2 className="font-bold text-gray-800">Papelera de Sucursales</h2>
              <p className="text-xs text-gray-500">Recupera las sedes eliminadas</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

      
        <div className="p-4 max-h-100 overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center py-10 gap-3">
              <Loader2 className="animate-spin text-[#dc902b]" size={32} />
              <p className="text-sm text-gray-400">Cargando eliminados...</p>
            </div>
          ) : eliminados.length === 0 ? (
            <div className="flex flex-col items-center py-10 text-center space-y-2">
              <AlertCircle className="text-gray-200" size={48} />
              <p className="text-gray-500 font-medium">La papelera está vacía</p>
            </div>
          ) : (
            <div className="space-y-3">
              {eliminados.map((s) => (
                <div key={s.id} className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors">
                  <div className="min-w-0">
                    <h4 className="font-bold text-gray-700 truncate">{s.detalle}</h4>
                    <p className="text-xs text-gray-400 truncate">{s.direccion}</p>
                  </div>
                  <button
                    onClick={() => handleRestaurar(s.id!)}
                    disabled={restoringId !== null}
                    className="flex items-center gap-1.5 px-3 py-2 bg-green-500 text-white rounded-xl text-xs font-bold hover:bg-green-600 transition-all shadow-sm shadow-green-100 disabled:opacity-50"
                  >
                    {restoringId === s.id ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <RotateCcw size={14} />
                    )}
                    Restaurar
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      
        <div className="p-4 border-t bg-gray-50/50 text-center">
          <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">
            {eliminados.length} elementos en papelera
          </p>
        </div>
      </div>
    </div>
  );
}