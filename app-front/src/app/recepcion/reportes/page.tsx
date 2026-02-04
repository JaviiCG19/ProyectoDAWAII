"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, RefreshCw, BarChart, Users, Table } from "lucide-react";
import {
  getReportePorPeriodo,
  getTopClientes,
  getUsoMesas,
  getTasasAsistencia,
  getReservasPorFranja,
} from "@/services/reporte.service";
import {
  ReportePorPeriodo,
  TopCliente,
  UsoMesa,
  TasasAsistencia,
  ReporteFranja,
} from "@/interface/reporte.interface";

export default function ReportesPage() {
  const router = useRouter();
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [reportePeriodo, setReportePeriodo] = useState<ReportePorPeriodo[]>([]);
  const [topClientes, setTopClientes] = useState<TopCliente[]>([]);
  const [usoMesas, setUsoMesas] = useState<UsoMesa[]>([]);
  const [tasas, setTasas] = useState<TasasAsistencia | null>(null);
  const [reservasFranjas, setReservasFranjas] = useState<ReporteFranja[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const hoy = new Date().toISOString().split("T")[0];
    const hace30 = new Date();
    hace30.setDate(hace30.getDate() - 30);
    setFechaInicio(hace30.toISOString().split("T")[0]);
    setFechaFin(hoy);
    cargarDatosIniciales();
  }, []);

  const cargarDatosIniciales = async () => {
    setLoading(true);
    try {
      const [top, mesas] = await Promise.all([getTopClientes(10), getUsoMesas()]);
      setTopClientes(top);
      setUsoMesas(mesas);
    } catch (err: any) {
      setError("Error al cargar datos iniciales");
    } finally {
      setLoading(false);
    }
  };

  const generarReportes = async () => {
    setLoading(true);
    setError(null);
    try {
      const [periodo, tasasData, franjas] = await Promise.all([
        getReportePorPeriodo(fechaInicio, fechaFin),
        getTasasAsistencia(fechaInicio, fechaFin),
        getReservasPorFranja(),
      ]);
      setReportePeriodo(periodo);
      setTasas(tasasData);
      setReservasFranjas(franjas);
    } catch (err: any) {
      setError(err.message || "Error al generar reportes");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto bg-slate-50 min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
          <BarChart size={32} className="text-indigo-600" />
          Panel de Reportes
        </h1>
        <button onClick={() => router.back()} className="px-5 py-2 bg-white border rounded-lg hover:bg-slate-100 font-medium transition-all">
          Volver
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Fecha Inicio</label>
            <input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Fecha Fin</label>
            <input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <button onClick={generarReportes} disabled={loading} className="bg-indigo-600 text-white h-[50px] rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
            {loading ? "Cargando..." : "Actualizar Reportes"}
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
        {error && <div className="mt-4 p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm">{error}</div>}
      </div>

      {/* Tabla Reservas por Período */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100"><h2 className="font-bold text-slate-700">Resumen de Reservas</h2></div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
              <tr>
                <th className="px-6 py-4">Periodo</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Pendientes</th>
                <th className="px-6 py-4">Confirmadas</th>
                <th className="px-6 py-4">Canceladas</th>
                <th className="px-6 py-4">No-Show</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reportePeriodo.map((item, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-700">{fechaInicio} al {fechaFin}</td>
                  <td className="px-6 py-4">{item.total_reservas}</td>
                  <td className="px-6 py-4 text-blue-600 font-bold">{item.pendientes}</td>
                  <td className="px-6 py-4 text-green-600 font-bold">{item.confirmadas}</td>
                  <td className="px-6 py-4 text-red-500">{item.canceladas}</td>
                  <td className="px-6 py-4 text-orange-600">{item.noshow}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tasas en Cards */}
      {tasas && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-slate-500 text-xs font-bold uppercase">Total Personas</p>
            <p className="text-2xl font-black text-slate-800">{reportePeriodo[0]?.total_personas || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-slate-500 text-xs font-bold uppercase">% No-Show</p>
            <p className="text-2xl font-black text-orange-600">{tasas.porcentaje_no_show}%</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-slate-500 text-xs font-bold uppercase">% Cancelaciones</p>
            <p className="text-2xl font-black text-red-600">{tasas.porcentaje_canceladas}%</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-slate-500 text-xs font-bold uppercase">Check-ins</p>
            <p className="text-2xl font-black text-green-600">{reportePeriodo[0]?.checkin || 0}</p>
          </div>
        </div>
      )}

      {/* Mesas y Clientes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="font-bold text-slate-700 mb-4 flex items-center gap-2"><Table size={18}/> Uso de Mesas</h2>
          <div className="space-y-4">
            {usoMesas.slice(0, 5).map(mesa => (
              <div key={mesa.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                <span className="font-bold text-slate-600">Mesa {mesa.numero}</span>
                <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-lg text-sm font-bold">{mesa.total_reservas} reserv.</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="font-bold text-slate-700 mb-4 flex items-center gap-2"><Users size={18}/> Top Clientes</h2>
          <div className="space-y-4">
            {topClientes.slice(0, 5).map(cliente => (
              <div key={cliente.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                <div>
                  <p className="font-bold text-sm text-slate-700">{cliente.nombre}</p>
                  <p className="text-xs text-slate-400">{cliente.telefono}</p>
                </div>
                <span className="text-indigo-600 font-bold">{cliente.total_reservas}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}