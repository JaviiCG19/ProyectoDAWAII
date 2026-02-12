"use client";

import { useState, useEffect } from "react";
import { X, BarChart3, Users, Table as TableIcon, Loader2 } from "lucide-react";
import api from "@/services/api";

interface ReporteConsolidadoModalProps {
  isOpen: boolean;
  onClose: () => void;
  idcia: number;
}

interface TopCliente {
  id: number;
  nombre: string;
  ruc_cc?: string;
  total_reservas: number;
}

interface UsoMesa {
  id: number;
  numero?: string;
  total_reservas: number;
}

export default function ReporteConsolidadoModal({
  isOpen,
  onClose,
  idcia,
}: ReporteConsolidadoModalProps) {
  const [topClientes, setTopClientes] = useState<TopCliente[]>([]);
  const [usoMesas, setUsoMesas] = useState<UsoMesa[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && idcia) {
      cargarReporte();
    }
  }, [isOpen, idcia]);

  const cargarReporte = async () => {
    setLoading(true);
    setError(null);

    try {
      const [topRes, mesasRes] = await Promise.all([
        api.get("/admin/reportes/top-clientes", { params: { idcia, limit: 10 } }),
        api.get("/admin/reportes/uso-mesas", { params: { idcia } }),
      ]);

      setTopClientes(topRes.data?.data || topRes.data || []);
      setUsoMesas(mesasRes.data?.data || mesasRes.data || []);
    } catch (err: any) {
      console.error("Error cargando reporte:", err);
      setError(err.message || "No se pudieron cargar los reportes");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
            <BarChart3 size={28} className="text-indigo-600" />
            Reporte Consolidado
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X size={28} className="text-gray-600" />
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 size={40} className="animate-spin text-indigo-600 mb-4" />
              <p className="text-gray-600 font-medium">Cargando reporte...</p>
            </div>
          ) : error ? (
            <div className="p-8 bg-red-50 border border-red-200 rounded-2xl text-center text-red-700">
              {error}
            </div>
          ) : (
            <div className="space-y-12">
              <section>
                <h3 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-3">
                  <Users size={24} className="text-indigo-600" />
                  Top 10 Clientes
                </h3>
                {topClientes.length > 0 ? (
                  <div className="grid gap-4">
                    {topClientes.map((cliente) => (
                      <div
                        key={cliente.id}
                        className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 bg-gray-50 rounded-2xl border border-gray-100 hover:border-indigo-200 transition-all"
                      >
                        <div>
                          <p className="font-bold text-lg text-gray-800">{cliente.nombre}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            {cliente.ruc_cc || "Sin documento"}
                          </p>
                        </div>
                        <div className="mt-3 sm:mt-0 text-right">
                          <p className="text-3xl font-black text-indigo-600">
                            {cliente.total_reservas}
                          </p>
                          <p className="text-xs uppercase text-gray-500 font-medium mt-1">
                            reservas
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-10">
                    No hay datos de clientes aún
                  </p>
                )}
              </section>

              <section>
                <h3 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-3">
                  <TableIcon size={24} className="text-indigo-600" />
                  Uso de Mesas (todas las sucursales)
                </h3>
                {usoMesas.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {usoMesas.map((mesa) => (
                      <div
                        key={mesa.id}
                        className="p-5 bg-gray-50 rounded-2xl border border-gray-100 text-center hover:border-indigo-200 transition-all"
                      >
                        <p className="font-bold text-xl text-gray-800 mb-2">
                          {mesa.numero || `Mesa ${mesa.id}`}
                        </p>
                        <p className="text-4xl font-black text-indigo-600">
                          {mesa.total_reservas}
                        </p>
                        <p className="text-sm text-gray-500 mt-1 uppercase font-medium">
                          reservas
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-10">
                    No hay datos de uso de mesas
                  </p>
                )}
              </section>
            </div>
          )}
        </div>

        <div className="p-6 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-10 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-md"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}