"use client";
import { Trash2, Loader2, AlertCircle } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  nombreUsuario: string;
  loading?: boolean;
}

export default function ModalEliminarUsuario({
  isOpen,
  onClose,
  onConfirm,
  nombreUsuario,
  loading = false,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl p-6 space-y-6 animate-in fade-in zoom-in duration-200 border border-gray-100">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="bg-red-50 p-4 rounded-full text-red-500">
            <Trash2 size={40} />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-gray-800">¿Eliminar personal?</h2>
            <p className="text-sm text-gray-500 px-4">
              Estás a punto de eliminar a <span className="font-bold text-gray-700">{nombreUsuario}</span>. 
              Esta acción no se puede deshacer.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-3 text-gray-500 hover:bg-gray-100 rounded-2xl font-semibold transition-all disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-4 py-3 bg-red-500 text-white rounded-2xl font-bold flex justify-center items-center hover:bg-red-600 transition-all shadow-lg shadow-red-200 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : "Sí, eliminar"}
          </button>
        </div>
      </div>
    </div>
  );
}