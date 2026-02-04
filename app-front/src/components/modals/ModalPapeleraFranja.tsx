"use client";
import { useEffect, useState } from "react";
import { Trash2, RotateCcw, X, Loader2, AlertCircle, Clock } from "lucide-react";
import { getFranjasEliminadas, restaurarFranja } from "@/services/admin-sucursal.service";
import { Franja } from "@/interface/admin.interface";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  idLocal: string;
  onRestored: () => void;
}

export default function ModalPapeleraFranja({ isOpen, onClose, idLocal, onRestored }: Props) {
  const [eliminados, setEliminados] = useState<Franja[]>([]);
  const [loading, setLoading] = useState(true);
  const [restoringId, setRestoringId] = useState<number | null>(null);
  const dias = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

  const fetchEliminados = async () => {
    setLoading(true);
    try {
      const data = await getFranjasEliminadas(idLocal);
      setEliminados(data);
    } catch (error) {
      console.error("Error al cargar papelera de franjas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (isOpen) fetchEliminados(); }, [isOpen]);

  const handleRestaurar = async (id: number) => {
    setRestoringId(id);
    try {
      const response = await restaurarFranja(id);
      if (response.data.result) {
        setEliminados((prev) => prev.filter((f) => f.id !== id));
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
        <div className="bg-orange-50 p-6 border-b flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 p-2 rounded-lg text-orange-600">
              <Clock size={20} />
            </div>
            <div>
              <h2 className="font-bold text-gray-800">Papelera de Franjas</h2>
              <p className="text-xs text-gray-500">Recupera horarios de reserva</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
        </div>

        <div className="p-4 max-h-100 overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center py-10 gap-3">
              <Loader2 className="animate-spin text-orange-500" size={32} />
              <p className="text-sm text-gray-400">Buscando...</p>
            </div>
          ) : eliminados.length === 0 ? (
            <div className="flex flex-col items-center py-10 text-center space-y-2">
              <AlertCircle className="text-gray-200" size={48} />
              <p className="text-gray-500 font-medium">No hay horarios eliminados</p>
            </div>
          ) : (
            <div className="space-y-3">
              {eliminados.map((f) => (
                <div key={f.id} className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 bg-gray-50/50">
                  <div>
                    <span className="text-[10px] font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded uppercase">{dias[f.diasem]}</span>
                    <h4 className="font-bold text-gray-700">{f.horini} - {f.horfin}</h4>
                  </div>
                  <button
                    onClick={() => handleRestaurar(f.id!)}
                    disabled={restoringId !== null}
                    className="flex items-center gap-1.5 px-3 py-2 bg-orange-500 text-white rounded-xl text-xs font-bold hover:bg-orange-600 transition-all disabled:opacity-50"
                  >
                    {restoringId === f.id ? <Loader2 size={14} className="animate-spin" /> : <RotateCcw size={14} />}
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