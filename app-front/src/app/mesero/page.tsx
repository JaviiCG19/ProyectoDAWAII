"use client";

import { useAuth } from "@/services/useAuth";

export default function MeseroPage() {
  const loading = useAuth(["4"]);

  if (loading) return null; 

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#dc902b]">
        Panel de Meseros
      </h1>

      <div className="bg-white rounded-2xl shadow-md p-6 text-gray-600">
        Aquí el mesero podrá:
        <ul className="list-disc ml-6 mt-2 space-y-1">
          <li>Ver mesas asignadas</li>
          <li>Tomar pedidos</li>
          <li>Actualizar estados</li>
        </ul>
      </div>
    </div>
  );
}
