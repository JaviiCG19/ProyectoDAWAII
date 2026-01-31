"use client";

import { useState } from "react";
import { Plus, Archive, Search } from "lucide-react";
import { useAuth } from "@/services/useAuth";

export default function AdminPage() {
  const loading = useAuth(["1"]);


  const [search, setSearch] = useState("");
  const [showTrash, setShowTrash] = useState(false);
  const [showModal, setShowModal] = useState(false);

  if (loading) return null; //spinner para evitar parpadeos

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#dc902b]">
          Gestión de Restaurantes
        </h1>

        <div className="flex gap-3">
          <button
            onClick={() => setShowTrash(!showTrash)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border"
          >
            <Archive size={18} />
            Papelera
          </button>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#dc902b] text-white"
          >
            <Plus size={18} />
            Añadir restaurante
          </button>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          placeholder="Buscar restaurante"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-3 py-2 border rounded-xl"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6 text-center text-gray-500">
        Aquí se mostrarán los restaurantes cuando el backend esté listo
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl space-y-4">
            <h2 className="text-lg font-bold">Agregar restaurante</h2>
            <p className="text-gray-500">
              Este formulario estará disponible cuando exista el backend.
            </p>
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 bg-[#dc902b] text-white rounded-lg"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
