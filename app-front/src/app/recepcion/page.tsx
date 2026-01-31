"use client";

import { useAuth } from "@/services/useAuth";
export default function RecepcionPage() {
  const loading = useAuth(["4"]);
  
  if (loading) return null; 
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#dc902b]">
        Panel de Recepción
      </h1>

      <div className="bg-white rounded-2xl shadow-md p-6 text-gray-600">
        Aquí recepción podrá:
        <ul className="list-disc ml-6 mt-2 space-y-1">
          <li>Gestionar reservas</li>
          <li>Atender clientes</li>
          <li>Confirmar llegadas</li>
        </ul>
      </div>
    </div>
  );
}
