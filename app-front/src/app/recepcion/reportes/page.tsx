"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BarChart, Users, Table, Search, Loader2, RefreshCw } from "lucide-react";

import { getTopClientes, getUsoMesas } from "@/services/reporte.service";
import { TopCliente, UsoMesa } from "@/interface/reporte.interface";
import { useAuth } from "@/services/useAuth";


export default function ReportesPage() {
  const router = useRouter();
  const checking = useAuth(["4"]); // Rol recepcionista

  const [topClientes, setTopClientes] = useState<TopCliente[]>([]);
  const [usoMesas, setUsoMesas] = useState<UsoMesa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchId, setSearchId] = useState("");
  const [searchedReserva, setSearchedReserva] = useState<any>(null);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);


  useEffect(() => {
    if (!checking) {
      cargarDatosIniciales();
    }
  }, [checking]);

  const cargarDatosIniciales = async () => {
    setLoading(true);
    setError(null);

    try {
      const [top, mesas] = await Promise.all([
        getTopClientes(10),
        getUsoMesas(),
      ]);
      setTopClientes(top || []);
      setUsoMesas(mesas || []);
    } catch (err: any) {
      console.error("Error inicial:", err);
      setError(err.message || "Error al cargar los reportes");
    } finally {
      setLoading(false);
    }
  };


  const buscarReservaPorId = async () => {
    if (!searchId.trim() || isNaN(Number(searchId))) {
      setSearchError("Ingresa un ID numérico válido");
      return;
    }

    setLoadingSearch(true);
    setSearchError(null);
    setSearchedReserva(null);

    try {
      const response = await fetch(`http://localhost:5000/reservas/${searchId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          tokenapp: localStorage.getItem("token") || "",
        },
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || `Reserva no encontrada (código ${response.status})`);
      }

      const data = await response.json();
      setSearchedReserva(data.data || data);
    } catch (err: any) {
      setSearchError(err.message || "No se pudo encontrar la reserva");
    } finally {
      setLoadingSearch(false);
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
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
        {/* Cabecera */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800 flex items-center gap-3">
            <BarChart size={32} className="text-indigo-600" />
            Panel de Reportes
          </h1>

          <div className="flex flex-wrap gap-3 md:gap-4">
            <button
              onClick={cargarDatosIniciales}
              disabled={loading}
              className="px-5 py-2.5 md:px-6 md:py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium flex items-center gap-2 disabled:opacity-50 shadow-md transition-all"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin text-white" />
              ) : (
                <RefreshCw size={18} className="text-white" />
              )}
              Actualizar
            </button>

            <button
              onClick={() => router.back()}
              className="px-5 py-2.5 md:px-6 md:py-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 font-medium text-slate-600 shadow-sm transition-all"
            >
              Volver
            </button>
          </div>
        </div>

        {loading && (
          <div className="text-center py-10 md:py-12 text-slate-500 flex items-center justify-center gap-3">
            <Loader2 size={24} className="animate-spin" />
            Cargando reportes...
          </div>
        )}

        {error && (
          <div className="p-4 md:p-5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-center text-sm md:text-base">
            {error}
          </div>
        )}

        <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-base md:text-lg font-bold text-slate-800 mb-3 md:mb-4 flex items-center gap-2">
            <Search size={20} className="text-indigo-600" />
            Ver estado de una reserva por ID
          </h2>

          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Ingresa el ID de la reserva (ej. 6)"
              className="flex-1 px-4 py-3 border border-slate-300 rounded-xl text-base focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
            <button
              onClick={buscarReservaPorId}
              disabled={loadingSearch || !searchId.trim()}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:bg-indigo-400 disabled:text-white/70 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium min-w-[140px] shadow-md transition-all"
            >
              {loadingSearch ? (
                <Loader2 size={18} className="animate-spin text-white" />
              ) : (
                <Search size={18} className="text-white" />
              )}
              Buscar
            </button>
          </div>

          {searchError && (
            <div className="mt-3 md:mt-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm md:text-base">
              {searchError}
            </div>
          )}

          {searchedReserva && (
            <div className="mt-6 md:mt-8 p-5 md:p-6 bg-slate-50 rounded-xl border border-slate-200 text-sm md:text-base">
              <h3 className="text-base md:text-lg font-bold text-slate-800 mb-4">
                Reserva encontrada - ID: {searchedReserva.id}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-2">
                  <p><strong>Cliente ID:</strong> {searchedReserva.idcliente}</p>
                  <p><strong>Fecha:</strong> {searchedReserva.fecha}</p>
                  <p><strong>Franja:</strong> {searchedReserva.franja_id}</p>
                </div>
                <div className="space-y-2">
                  <p><strong>Personas:</strong> {searchedReserva.numper}</p>
                  <p><strong>Mesa:</strong> {searchedReserva.idmesa || "Automática"}</p>
                  <p>
                    <strong>Estado actual:</strong>{" "}
                    <span
                      className={`inline-block ml-2 px-3 md:px-4 py-1 rounded-full text-xs md:text-sm font-semibold ${
                        searchedReserva.estado === 0
                          ? "bg-yellow-100 text-yellow-800"
                          : searchedReserva.estado === 1
                          ? "bg-green-100 text-green-800"
                          : searchedReserva.estado === 3
                          ? "bg-blue-100 text-blue-800"
                          : "bg-orange-100 text-orange-800"
                      }`}
                    >
                      {searchedReserva.estado === 0
                        ? "Pendiente"
                        : searchedReserva.estado === 1
                        ? "Confirmada"
                        : searchedReserva.estado === 3
                        ? "Check-in"
                        : "No-show"}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 md:p-6">
          <h2 className="font-bold text-slate-700 mb-4 md:mb-5 flex items-center gap-2 text-base md:text-lg">
            <Users size={20} className="text-indigo-500" />
            Top Clientes
          </h2>
          <div className="space-y-3 md:space-y-4">
            {topClientes.length > 0 ? (
              topClientes.map((cliente) => (
                <div
                  key={cliente.id}
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-indigo-200 transition-all gap-3"
                >
                  <div>
                    <p className="font-bold text-sm md:text-base text-slate-700">
                      {cliente.nombre}
                    </p>
                    <p className="text-xs md:text-sm text-slate-400 font-medium">
                      {cliente.ruc_cc || "Sin ID"}
                    </p>
                  </div>
                  <div className="flex flex-col items-start sm:items-end">
                    <span className="text-indigo-600 font-black text-lg md:text-xl">
                      {cliente.total_reservas}
                    </span>
                    <span className="text-[10px] md:text-xs text-slate-400 uppercase font-bold">
                      Reservas
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-slate-500 py-6 md:py-8">
                No hay datos de top clientes.
              </p>
            )}
          </div>
        </div>


        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 md:p-6">
          <h2 className="font-bold text-slate-700 mb-4 md:mb-5 flex items-center gap-2 text-base md:text-lg">
            <Table size={20} className="text-indigo-500" />
            Uso de Mesas
          </h2>
          <div className="space-y-3 md:space-y-4">
            {usoMesas.length > 0 ? (
              usoMesas.map((mesa: any) => (
                <div
                  key={mesa.id}
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-indigo-200 transition-all gap-3"
                >
                  <span className="font-bold text-sm md:text-base text-slate-600">
                    {mesa.numero || `Mesa ${mesa.id}`}
                  </span>
                  <span className="bg-indigo-100 text-indigo-700 px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-bold">
                    {mesa.total_reservas} reserv.
                  </span>
                </div>
              ))
            ) : (
              <p className="text-center text-slate-500 py-6 md:py-8">
                No hay datos de uso de mesas.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}