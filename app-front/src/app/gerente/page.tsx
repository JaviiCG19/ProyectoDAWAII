"use client";

import { useAuth } from "@/services/useAuth";

export default function GerentePage() {
  const loading = useAuth(["2"]);

  if (loading) return null; 

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#dc902b]">
        Panel de Gerencia
      </h1>

      <div className="bg-white rounded-2xl shadow-md p-6 text-gray-600">
        Aquí el gerente podrá:
        <ul className="list-disc ml-6 mt-2 space-y-1">
          <li>Ver reportes</li>
          <li>Administrar operaciones</li>
          <li>Supervisar restaurantes</li>
        </ul>
      </div>
    </div>
  );
}
