
"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface Cliente {
  id: number;
  nombre: string;
  telefono: string;
}

interface ModalEditarClienteProps {
  isOpen: boolean;
  onClose: () => void;
  cliente: Cliente | null;
  onSave: (nombre: string, telefono: string) => void;
}

export default function ModalEditarCliente({
  isOpen,
  onClose,
  cliente,
  onSave,
}: ModalEditarClienteProps) {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");

  useEffect(() => {
    if (cliente) {
      setNombre(cliente.nombre);
      setTelefono(cliente.telefono);
    }
  }, [cliente]);

  if (!isOpen || !cliente) return null;

  const handleSubmit = () => {
    if (!nombre.trim() || !telefono.trim()) return;
    onSave(nombre, telefono);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-xl font-bold text-gray-900">Editar Cliente</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Nombre completo
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F2B847] focus:border-[#F2B847] outline-none transition"
              placeholder="Ej: Juan Pérez"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Teléfono
            </label>
            <input
              type="tel"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F2B847] focus:border-[#F2B847] outline-none transition"
              placeholder="Ej: 0991234567"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={!nombre.trim() || !telefono.trim()}
            className="px-5 py-2.5 bg-[#F2B847] text-gray-900 font-medium rounded-lg hover:bg-yellow-500 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
}