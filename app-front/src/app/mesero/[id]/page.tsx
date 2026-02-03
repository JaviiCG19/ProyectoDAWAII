"use client";

import { useParams } from "next/navigation";
import { useAuth } from "@/services/useAuth"; 
import { useEffect, useState } from "react";
import { getMesasByLocal } from "@/services/mesa.service";
import { Mesa } from "@/interface/mesa.interface";
import { Users, LayoutDashboard, Utensils } from "lucide-react";

export default function MeseroPage() {
  const params = useParams();
  const localId = params?.id as string;
  
  // Protección de ruta para meseros
  const checking = useAuth(["5"]); 
  
  const [mesas, setMesas] = useState<Mesa[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMesas = async () => {
      if (!checking && localId && localId !== "undefined") {
        setLoading(true);
        const data = await getMesasByLocal(localId);
        setMesas(data);
        setLoading(false);
      }
    };
    fetchMesas();
  }, [checking, localId]);

  if (checking || loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F2B847]"></div>
        <p className="mt-4 text-gray-600 font-medium">Cargando mesas de sucursal...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="max-w-7xl mx-auto mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-2">
            <LayoutDashboard className="text-[#F2B847]" size={32} />
            Panel de Mesero
          </h1>
          <p className="text-gray-500 mt-1">Gestión de mesas - Sucursal #{localId}</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
          <span className="text-sm font-medium text-gray-600">Total Mesas: </span>
          <span className="text-lg font-bold text-[#F2B847]">{mesas.length}</span>
        </div>
      </header>


      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {mesas.length > 0 ? (
          mesas.map((mesa) => (
            <div 
              key={mesa.id} 
              className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow p-5 relative overflow-hidden group"
            >

              <div className="absolute left-0 top-0 h-full w-2 bg-green-500"></div>

              <div className="flex justify-between items-start mb-4">
                <div className="bg-green-50 p-3 rounded-xl group-hover:bg-green-100 transition-colors">
                  <Utensils className="text-green-600" size={24} />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-1 rounded bg-green-100 text-green-700">
                  Disponible
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-bold text-gray-800 tracking-tight">
                  Mesa {mesa.numero.toUpperCase().replace("MS-", "")}
                </h3>
                <div className="flex items-center gap-2 text-gray-500">
                  <Users size={16} />
                  <span className="text-sm font-medium">Capacidad: {mesa.maxper} personas</span>
                </div>
              </div>

              <button className="w-full mt-6 py-2.5 bg-gray-900 text-white rounded-xl font-semibold text-sm hover:bg-gray-800 transition-colors">
                Ver Pedidos
              </button>
            </div>
          ))
        ) : (
          <div className="col-span-full bg-white rounded-2xl p-12 text-center border-2 border-dashed border-gray-200">
            <p className="text-gray-400 text-lg">No hay mesas disponibles en esta sucursal.</p>
          </div>
        )}
      </div>
    </div>
  );
}