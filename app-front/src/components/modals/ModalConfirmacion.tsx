"use client";

import { AlertTriangle, Loader2, X } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  titulo: string;
  mensaje: string;
  loading?: boolean;
}

export default function ModalConfirmacion({
  isOpen,
  onClose,
  onConfirm,
  titulo,
  mensaje,
  loading = false,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-60 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl p-6 space-y-4 animate-in fade-in zoom-in duration-200">
        <div className="flex justify-center text-red-500">
          <div className="bg-red-50 p-3 rounded-full">
            <AlertTriangle size={40} />
          </div>
        </div>

        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold text-gray-800">{titulo}</h2>
          <p className="text-sm text-gray-500">{mensaje}</p>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-xl font-medium transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-red-500 text-white rounded-xl font-bold flex justify-center items-center hover:bg-red-600 transition-colors shadow-md shadow-red-100 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : "Eliminar"}
          </button>
        </div>
      </div>
    </div>
  );
}