"use client";

import { X } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  fecha: string;
  franja: string;
  personas: number;
  mesa?: string;
  loading: boolean;
}

export default function ConfirmarReservaModal({
  isOpen,
  onClose,
  onConfirm,
  fecha,
  franja,
  personas,
  mesa,
  loading,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-800">Confirmar Reserva</h3>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-800 transition-colors"
            disabled={loading}
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-500">Fecha</p>
              <p className="font-medium">{fecha || "—"}</p>
            </div>
            <div>
              <p className="text-slate-500">Franja</p>
              <p className="font-medium">{franja || "—"}</p>
            </div>
            <div>
              <p className="text-slate-500">Personas</p>
              <p className="font-medium">{personas}</p>
            </div>
            <div>
              <p className="text-slate-500">Mesa</p>
              <p className="font-medium">{mesa || "Automática"}</p>
            </div>
          </div>

          <p className="text-slate-600 text-sm pt-2">
            ¿Desea confirmar esta reserva?
          </p>
        </div>

        <div className="p-6 border-t border-slate-200 flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-3 border border-slate-300 rounded-xl font-medium text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : null}
            {loading ? "Creando..." : "Confirmar"}
          </button>
        </div>
      </div>
    </div>
  );
}