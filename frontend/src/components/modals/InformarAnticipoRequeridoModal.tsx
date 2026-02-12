"use client";

import { X, AlertTriangle } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function InformarAnticipoRequeridoModal({ isOpen, onClose }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <AlertTriangle className="text-amber-500" size={24} />
            Anticipo requerido
          </h3>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 text-center space-y-4">
          <p className="text-lg text-slate-700 font-medium">
            No se puede realizar el check-in: la reserva no tiene anticipo pagado.
          </p>
          <p className="text-slate-600">
            Debes registrar un anticipo primero para poder hacer check-in.
          </p>
        </div>

        <div className="p-6 border-t border-slate-200 flex justify-center">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-slate-700 text-white rounded-xl font-medium hover:bg-slate-800 transition"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}