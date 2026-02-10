"use client";

import { CheckCircle } from "lucide-react";

interface ModalClienteCreadoProps {
  isOpen: boolean;
  onClose: () => void;
  nombreCliente: string;
}

export default function ModalClienteCreado({
  isOpen,
  onClose,
  nombreCliente,
}: ModalClienteCreadoProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        <div className="p-8 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            ¡Cliente creado!
          </h3>

          <p className="text-gray-600 mb-8">
            El cliente <span className="font-semibold text-gray-900">{nombreCliente}</span> ha sido registrado correctamente en el sistema.
          </p>

          <button
            onClick={onClose}
            className="w-full bg-[#F2B847] text-gray-900 py-3.5 rounded-xl font-semibold hover:bg-yellow-500 transition shadow-md active:scale-[0.98]"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}