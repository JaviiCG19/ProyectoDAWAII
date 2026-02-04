"use client";

import { useParams } from "next/navigation";
import { useAuth } from "@/services/useAuth";
import { useState } from "react";
import { 
  Users, 
  Store, 
  TrendingUp, 
  FileText, 
  ChevronRight,
  ArrowUpRight,
  Calendar,
  Layers,
  Settings
} from "lucide-react";
import Link from "next/link";

export default function GerenteDashboardPage() {
  const params = useParams();
  const idRes = params?.id as string;
  
  const checking = useAuth(["2"]);

  const [stats, setStats] = useState({
    totalVentas: "$12,450.00",
    reservasHoy: 45,
    clientesNuevos: 12,
    ocupacionPromedio: "78%"
  });

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Cargando Dashboard Corporativo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-blue-600 font-bold text-xs uppercase tracking-widest">Administración Corporativa</span>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Panel de Gerencia</h1>
          <p className="text-gray-500 flex items-center gap-2 mt-1">
            <Calendar size={16} /> Restaurante ID: <span className="font-bold text-gray-700">#{idRes}</span>
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white border border-gray-200 px-5 py-2.5 rounded-2xl text-sm font-bold text-gray-700 hover:shadow-md transition-all">
            <FileText size={18} className="text-blue-600" />
            Reporte Consolidado
          </button>
          <button className="p-2.5 bg-gray-900 text-white rounded-2xl hover:bg-gray-800 transition-colors">
            <Settings size={20} />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { label: "Ventas Totales", val: stats.totalVentas, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Reservas Totales", val: stats.reservasHoy, icon: Store, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Nuevos Clientes", val: stats.clientesNuevos, icon: Users, color: "text-indigo-600", bg: "bg-indigo-50" },
          { label: "Ocupación Global", val: stats.ocupacionPromedio, icon: ArrowUpRight, color: "text-amber-600", bg: "bg-amber-50" },
        ].map((item, i) => (
          <div key={i} className="bg-white p-6 rounded-4xl shadow-sm border border-gray-100 group hover:scale-[1.02] transition-transform">
            <div className={`${item.bg} ${item.color} w-12 h-12 rounded-2xl flex items-center justify-center mb-4`}>
              <item.icon size={24} />
            </div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-tight">{item.label}</p>
            <h3 className="text-2xl font-black text-gray-900 mt-1">{item.val}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gray-100 rounded-2xl">
                <Layers size={22} className="text-gray-600" />
              </div>
              <h2 className="text-xl font-black text-gray-800">Rendimiento por Sucursal</h2>
            </div>
            <Link href={`/gerente/${idRes}/locales`} className="text-sm font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-100 transition-colors">
              Gestionar Locales
            </Link>
          </div>
          
          <div className="grid gap-4">
            {[1, 2, 3].map((local) => (
              <div key={local} className="flex items-center justify-between p-6 bg-gray-50/50 rounded-3xl border border-gray-100 group hover:bg-white hover:shadow-xl hover:shadow-gray-200/40 transition-all cursor-pointer">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-50 group-hover:border-blue-100 transition-colors">
                    <span className="font-black text-gray-300 group-hover:text-blue-500 text-lg">0{local}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-lg">Sucursal {local === 1 ? 'Norte' : local === 2 ? 'Centro' : 'Sur'}</h4>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">Activo</span>
                  </div>
                </div>
                <div className="flex items-center gap-10">
                  <div className="text-right hidden md:block">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Ingresos Hoy</p>
                    <p className="font-black text-gray-900 text-xl">$1,450.00</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-gray-100 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <ChevronRight size={20} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>


        <div className="space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
            <h3 className="text-lg font-black text-gray-800 mb-6 flex items-center gap-2">
              <span className="w-2 h-6 bg-blue-600 rounded-full"></span>
              Promociones de Red
            </h3>
            <div className="space-y-5">
              {[
                { name: "Global Happy Hour", status: "Activa", color: "bg-green-500" },
                { name: "Descuento Corporativo", status: "Programada", color: "bg-blue-500" },
                { name: "Campaña Fiestas", status: "En pausa", color: "bg-gray-300" }
              ].map((promo, idx) => (
                <div key={idx} className="flex items-center justify-between border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 ${promo.color} rounded-full`}></div>
                    <span className="text-sm font-bold text-gray-700">{promo.name}</span>
                  </div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">{promo.status}</span>
                </div>
              ))}
            </div>
            <button className="w-full mt-8 py-4 bg-gray-50 text-gray-600 rounded-2xl font-bold text-sm hover:bg-blue-600 hover:text-white transition-all">
              Configurar Campaña Global
            </button>
          </div>  
        </div>
      </div>
    </div>
  );
}