"use client";

import { X } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  title: string;
  message: string;
  confirmText: string;
  confirmColor: string; 
  loading?: boolean;
}

export default function ConfirmarAccionModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  confirmColor,
  loading = false,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-800">{title}</h3>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-slate-500 hover:text-slate-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 text-center">
          <p className="text-lg text-slate-700 font-medium">{message}</p>
        </div>

        <div className="p-6 border-t border-slate-200 flex gap-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-3 border border-slate-300 rounded-xl font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 text-white py-3 rounded-xl font-bold disabled:opacity-50 transition flex items-center justify-center gap-2 ${confirmColor}`}
          >
            {loading && <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            {loading ? "Procesando..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}