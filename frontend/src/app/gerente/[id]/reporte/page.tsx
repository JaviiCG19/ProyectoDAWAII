"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { BarChart3, Users, Table as TableIcon, Loader2, RefreshCw, ArrowLeft, AlertCircle } from "lucide-react";

import { getTopClientes, getUsoMesas } from "@/services/reporte.service";
import { TopCliente, UsoMesa } from "@/interface/reporte.interface";

export default function ReporteSucursalPage() {
  const params = useParams();
  const router = useRouter();
  const localId = Number(params.id); // ID de la sucursal

  const [topClientes, setTopClientes] = useState<TopCliente[]>([]);
  const [usoMesas, setUsoMesas] = useState<UsoMesa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (localId) {
      cargarDatosIniciales();
    }
  }, [localId]);

  const cargarDatosIniciales = async () => {
    setLoading(true);
    setError(null);

    try {
      const [top, mesas] = await Promise.all([
        getTopClientes(10, localId),   
        getUsoMesas(localId),         
      ]);
      setTopClientes(top || []);
      setUsoMesas(mesas || []);
    } catch (err: any) {
      console.error("Error cargando reportes:", err);
      setError(err.message || "Error al cargar los reportes de la sucursal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 md:px-8">
      {/* Header */}
      <header className="mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 font-medium"
        >
          <ArrowLeft size={20} />
          Volver al dashboard
        </button>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
            <BarChart3 size={32} className="text-indigo-600" />
            Reporte Sucursal #{localId}
          </h1>

          <button
            onClick={cargarDatosIniciales}
            disabled={loading}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium flex items-center gap-2 disabled:opacity-50 shadow-md transition-all"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin text-white" />
            ) : (
              <RefreshCw size={18} className="text-white" />
            )}
            Actualizar
          </button>
        </div>
      </header>

      {loading && (
        <div className="flex justify-center items-center py-20">
          <Loader2 size={40} className="animate-spin text-indigo-600" />
        </div>
      )}

      {error && (
        <div className="p-6 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-center">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="space-y-10">
          {/* Top Clientes */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <Users size={24} className="text-indigo-600" />
              Top Clientes - Sucursal #{localId}
            </h2>

            {topClientes.length > 0 ? (
              <div className="space-y-4">
                {topClientes.map((cliente) => (
                  <div
                    key={cliente.id}
                    className="flex justify-between items-center p-5 bg-gray-50 rounded-2xl border border-gray-100"
                  >
                    <div>
                      <p className="font-bold text-lg text-gray-800">{cliente.nombre}</p>
                      <p className="text-sm text-gray-500">{cliente.ruc_cc || "Sin documento"}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-black text-indigo-600">{cliente.total_reservas}</p>
                      <p className="text-xs uppercase text-gray-500 mt-1">reservas</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-10">
                No hay datos de clientes en esta sucursal
              </p>
            )}
          </div>

          {/* Uso de Mesas */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <TableIcon size={24} className="text-indigo-600" />
              Uso de Mesas - Sucursal #{localId}
            </h2>

            {usoMesas.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {usoMesas.map((mesa: any) => (
                  <div
                    key={mesa.id}
                    className="p-6 bg-gray-50 rounded-2xl border border-gray-100 text-center"
                  >
                    <p className="font-bold text-xl text-gray-800 mb-2">
                      {mesa.numero || `Mesa ${mesa.id}`}
                    </p>
                    <p className="text-4xl font-black text-indigo-600">
                      {mesa.total_reservas}
                    </p>
                    <p className="text-sm text-gray-500 mt-2 uppercase">reservas</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-10">
                No hay datos de uso de mesas en esta sucursal
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}