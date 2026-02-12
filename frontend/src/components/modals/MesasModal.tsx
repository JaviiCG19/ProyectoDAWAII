"use client";

import { X, Loader2 } from "lucide-react";

interface MesasModalProps {
  isOpen: boolean;
  onClose: () => void;
  local: any;
  mesas: any[];
  mesasLoading: boolean;
  mesasError: string | null;
}

export default function MesasModal({
  isOpen,
  onClose,
  local,
  mesas,
  mesasLoading,
  mesasError,
}: MesasModalProps) {
  if (!isOpen || !local) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-y-auto">
        <div className="flex justify-between items-center p-5 md:p-6 border-b">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">
            Mesas - {local.detalle || "Sin nombre"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X size={28} className="text-gray-600" />
          </button>
        </div>

        <div className="p-5 md:p-6">
          {mesasLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 size={40} className="animate-spin text-blue-600" />
            </div>
          ) : mesasError ? (
            <p className="text-center text-red-600 py-10">{mesasError}</p>
          ) : mesas.length === 0 ? (
            <p className="text-center text-gray-600 py-10 text-lg">
              No hay mesas registradas en esta sucursal
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
              {mesas.map((mesa: any) => (
                <div
                  key={mesa.id}
                  className={`p-4 rounded-2xl border text-center ${
                    mesa.estado === 1
                      ? "bg-green-50 border-green-200"
                      : "bg-red-50 border-red-200"
                  }`}
                >
                  <div className="font-bold text-lg">
                    {mesa.numero || `Mesa ${mesa.id}`}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Capacidad: {mesa.maxper || "?"} pers.
                  </div>
                  <div className="mt-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        mesa.estado === 1
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {mesa.estado === 1 ? "Disponible" : "No disponible"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-5 md:p-6 border-t flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-200 text-gray-800 px-6 py-3 rounded-xl font-bold hover:bg-gray-300 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}