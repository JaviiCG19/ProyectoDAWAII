"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw, BarChart, Users, Table } from "lucide-react";
import {
  getReportePorPeriodo,
  getTopClientes,
  getUsoMesas,
  getTasasAsistencia,
} from "@/services/reporte.service";

import {
  ReportePorPeriodo,
  TopCliente,
  UsoMesa,
  TasasAsistencia,
} from "@/interface/reporte.interface";


import { useAuth } from "@/services/useAuth";

export default function ReportesPage() {
  const router = useRouter();

  const checking = useAuth(["4"]);  // Rol 4 = recepcionista

  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [reportePeriodo, setReportePeriodo] = useState<ReportePorPeriodo[]>([]);
  const [topClientes, setTopClientes] = useState<TopCliente[]>([]);
  const [usoMesas, setUsoMesas] = useState<UsoMesa[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("Estado de checking:", checking);  // ← Log para depurar si se resuelve

    const hoy = new Date().toISOString().split("T")[0];
    const hace30 = new Date();
    hace30.setDate(hace30.getDate() - 30);
    setFechaInicio(hace30.toISOString().split("T")[0]);
    setFechaFin(hoy);

    if (!checking) {
      cargarDatosIniciales();
    }
  }, [checking]);

  const cargarDatosIniciales = async () => {
    try {
      const [top, mesas] = await Promise.all([getTopClientes(10), getUsoMesas()]);
      setTopClientes(top || []);
      setUsoMesas(mesas || []);
    } catch (err: any) {
      console.error("Error inicial:", err);
    }
  };

  const generarReportes = async () => {
    if (!fechaInicio || !fechaFin) {
      setError("Por favor selecciona ambas fechas");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [periodo, tasasData] = await Promise.all([
        getReportePorPeriodo(fechaInicio, fechaFin),
        getTasasAsistencia(fechaInicio, fechaFin)
      ]);

      setReportePeriodo(periodo || []);
      console.log("Tasas cargadas:", tasasData);
    } catch (err: any) {
      console.error("Error al generar:", err);
      setError(err.message || "Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-50">
        <p className="animate-pulse font-medium text-slate-600">
          Verificando acceso...
        </p>
      </div>
    );
  }
  
  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto bg-slate-50 min-h-screen text-slate-900">
      {/* Cabecera */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
          <BarChart size={32} className="text-indigo-600" />
          Panel de Reportes
        </h1>
        <button 
          onClick={() => router.back()} 
          className="px-5 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 font-medium text-slate-600 shadow-sm"
        >
          Volver
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <div className="flex flex-col">
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-wider">
              Fecha Inicio
            </label>
            <input 
              type="date" 
              value={fechaInicio} 
              onChange={(e) => setFechaInicio(e.target.value)} 
              className="w-full border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 text-slate-700" 
            />
          </div>
          <div className="flex flex-col">
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-wider">
              Fecha Fin
            </label>
            <input 
              type="date" 
              value={fechaFin} 
              onChange={(e) => setFechaFin(e.target.value)} 
              className="w-full border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 text-slate-700" 
            />
          </div>
          
          <div className="w-full">
            <button 
              type="button"
              onClick={generarReportes} 
              disabled={loading} 
              className="w-full h-[54px] bg-indigo-600 hover:bg-indigo-700 rounded-xl font-extrabold transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 disabled:bg-slate-400 cursor-pointer"
              style={{ color: 'red' }} 
            >
              {loading ? (
                <RefreshCw size={20} className="animate-spin text-white" />
              ) : (
                <>
                  <span className="text-white uppercase tracking-wide">Actualizar Reportes</span>
                  <RefreshCw size={18} className="text-white" />
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-medium">
            {error}
          </div>
        )}


      {/* El resto de tu JSX (tabla, mesas, clientes) queda igual */}
      {/* ... (copia el resto de tu return aquí) ... */}
    </div> 


      {/* Tabla de Resumen */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 font-bold text-slate-700">Resumen de Reservas del Periodo</div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
              <tr>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Pendientes</th>
                <th className="px-6 py-4">Confirmadas</th>
                <th className="px-6 py-4">Canceladas</th>
                <th className="px-6 py-4">No-Show</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reportePeriodo.length > 0 ? (
                reportePeriodo.map((item, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-700">{item.total_reservas || 0}</td>
                    <td className="px-6 py-4 text-blue-600 font-bold">{item.pendientes || 0}</td>
                    <td className="px-6 py-4 text-green-600 font-bold">{item.confirmadas || 0}</td>
                    <td className="px-6 py-4 text-red-500">{item.canceladas || 0}</td>
                    <td className="px-6 py-4 text-orange-600">{item.noshow || 0}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-slate-400 italic">No hay datos. Ajusta las fechas y actualiza.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sección de Mesas y Clientes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="font-bold text-slate-700 mb-4 flex items-center gap-2"><Table size={18} className="text-indigo-500" /> Uso de Mesas</h2>
          <div className="space-y-3">
            {usoMesas.map((mesa: any) => (
              <div key={mesa.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-indigo-200 transition-all">
                <span className="font-bold text-slate-600">{mesa.numero || `Mesa ${mesa.id}`}</span>
                <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-lg text-xs font-bold">{mesa.total_reservas} reserv.</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="font-bold text-slate-700 mb-4 flex items-center gap-2"><Users size={18} className="text-indigo-500" /> Top Clientes</h2>
          <div className="space-y-3">
            {topClientes.map((cliente) => (
              <div key={cliente.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-indigo-200 transition-all">
                <div>
                  <p className="font-bold text-sm text-slate-700">{cliente.nombre}</p>
                  <p className="text-xs text-slate-400 font-medium">{cliente.ruc_cc || "Sin ID"}</p>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-indigo-600 font-black text-lg">{cliente.total_reservas}</span>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Reservas</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}