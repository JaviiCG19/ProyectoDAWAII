"use client";

import { Unlock } from "lucide-react";

interface LiberarMesaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  mesaNumero: string;
  isLoading?: boolean;
}

export default function LiberarMesaModal({
  isOpen,
  onClose,
  onConfirm,
  mesaNumero,
  isLoading = false,
}: LiberarMesaModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden transform transition-all">
        {/* Header */}
        <div className="bg-red-50 px-6 py-5 flex items-center gap-3 border-b border-red-100">
          <div className="p-3 bg-red-100 rounded-xl">
            <Unlock className="text-red-600" size={28} />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Liberar Mesa</h3>
        </div>

        {/* Contenido */}
        <div className="p-6">
          <p className="text-gray-700 mb-6">
            ¿Estás seguro de que deseas liberar la{" "}
            <strong>Mesa {mesaNumero.replace("ms-", "").toUpperCase()}</strong>?
          </p>
          <p className="text-sm text-gray-500">
            Esto la pondrá disponible nuevamente para nuevas reservas.
          </p>
        </div>

        {/* Botones */}
        <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3 border-t border-gray-100">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl font-medium transition disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition flex items-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                Liberando...
              </>
            ) : (
              "Liberar Mesa"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}