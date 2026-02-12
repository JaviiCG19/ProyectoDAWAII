"use client";
import { useEffect, useState } from "react";
import { Tag, RotateCcw, X, Loader2, AlertCircle } from "lucide-react";
import { getPromocionesEliminadas, restaurarPromocion } from "@/services/admin-sucursal.service";
import { Promocion } from "@/interface/admin.interface";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  idLocal: string;
  onRestored: () => void;
}

export default function ModalPapeleraPromocion({ isOpen, onClose, idLocal, onRestored }: Props) {
  const [eliminados, setEliminados] = useState<Promocion[]>([]);
  const [loading, setLoading] = useState(true);
  const [restoringId, setRestoringId] = useState<number | null>(null);

  const fetchEliminados = async () => {
    setLoading(true);
    try {
      const data = await getPromocionesEliminadas(idLocal);
      setEliminados(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (isOpen) fetchEliminados(); }, [isOpen]);

  const handleRestaurar = async (id: number) => {
    setRestoringId(id);
    try {
      const response = await restaurarPromocion(id);
      if (response.data.result) {
        setEliminados((prev) => prev.filter((p) => p.id !== id));
        onRestored();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setRestoringId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-70 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-blue-50 p-6 border-b flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
              <Tag size={20} />
            </div>
            <div>
              <h2 className="font-bold text-gray-800">Papelera de Promos</h2>
              <p className="text-xs text-gray-500">Recupera ofertas especiales</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
        </div>

        <div className="p-4 max-h-100 overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center py-10 gap-3">
              <Loader2 className="animate-spin text-blue-500" size={32} />
              <p className="text-sm text-gray-400">Cargando...</p>
            </div>
          ) : eliminados.length === 0 ? (
            <div className="flex flex-col items-center py-10 text-center">
              <AlertCircle className="text-gray-200" size={48} />
              <p className="text-gray-500 font-medium">Papelera vacía</p>
            </div>
          ) : (
            <div className="space-y-3">
              {eliminados.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 bg-gray-50/50">
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-gray-700 truncate">{p.nombre}</h4>
                    <p className="text-[10px] text-blue-600 font-bold uppercase">-{p.descuento}% Descuento</p>
                  </div>
                  <button
                    onClick={() => handleRestaurar(p.id!)}
                    disabled={restoringId !== null}
                    className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all shadow-sm"
                  >
                    {restoringId === p.id ? <Loader2 size={14} className="animate-spin" /> : <RotateCcw size={14} />}
                    Restaurar
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}