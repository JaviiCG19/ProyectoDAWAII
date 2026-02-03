"use client";

import { useParams } from "next/navigation";
import { useAuth } from "@/services/useAuth"; 
import { useEffect, useState } from "react";
import { getMesasByLocal } from "@/services/mesa.service";
import { Mesa } from "@/interface/mesa.interface";
import { ConciergeBell, LayoutPanelLeft } from "lucide-react";

export default function RecepcionPage() {
  const params = useParams();
  const localId = params?.id as string;
  

  const checking = useAuth(["4"]); 
  
  const [mesas, setMesas] = useState<Mesa[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDatosRecepcion = async () => {
      if (!checking && localId) {
        setLoading(true);
     
        const dataMesas = await getMesasByLocal(localId);
        setMesas(dataMesas);
        setLoading(false);
      }
    };

    cargarDatosRecepcion();
  }, [checking, localId]);

  if (checking || loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-50">
        <p className="animate-pulse font-medium text-slate-600">Cargando Gestión de Recepción...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <ConciergeBell className="text-blue-500" size={28} />
            Panel de Recepción
          </h1>
          <p className="text-slate-500">Sucursal ID: {localId}</p>
        </div>
      </header>


      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-slate-400 text-sm font-bold uppercase">Mesas Totales</h3>
          <p className="text-3xl font-black text-slate-800">{mesas.length}</p>
        </div>
    
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
            <LayoutPanelLeft size={20}/> Vista de Planta
        </h2>
   
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {mesas.map(mesa => (
                <div key={mesa.id} className="bg-white p-4 rounded-xl border border-slate-200 text-center">
                    <span className="block font-bold text-slate-800">{mesa.numero}</span>
                    <span className="text-xs text-slate-400">Capacidad: {mesa.maxper}</span>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}