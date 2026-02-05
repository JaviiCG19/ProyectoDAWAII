"use client";

import { useAuth } from "@/services/useAuth";
import { useState, useEffect } from "react";
import { Users, Store,  TrendingUp, FileText,  ChevronRight, Calendar,  Layers,
         Settings,  AlertCircle, X} from "lucide-react";
         
import Link from "next/link";

import api from "@/services/api"; // Ruta del segundo backend 10100

import { getClientes } from "@/services/cliente.service";

const contarNuevosClientesHoy = (clientes: any[]): number => {
  if (!clientes?.length) return 0;
  const hoy = new Date().toISOString().split("T")[0];
  return clientes.filter((c) => c.fecing?.split("T")?.[0] === hoy).length;
};

export default function GerenteDashboardPage() {
  const checking = useAuth(["2"]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [locales, setLocales] = useState<any[]>([]);
  const [nuevosClientesHoy, setNuevosClientesHoy] = useState(0);

  const [empresas, setEmpresas] = useState<any[]>([]);
  const [selectedIdCia, setSelectedIdCia] = useState<number | null>(null);

  // Estados para el modal de mesas
  const [selectedLocal, setSelectedLocal] = useState<any>(null);
  const [mesas, setMesas] = useState<any[]>([]);
  const [mesasLoading, setMesasLoading] = useState(false);
  const [mesasError, setMesasError] = useState<string | null>(null);

  // Cargar empresas al montar el componente
  useEffect(() => {
    const fetchEmpresas = async () => {
      try {
        setLoading(true);
        setError(null);

        const resEmpresas = await api.get("/admin/empresas");
        if (resEmpresas.data?.result && Array.isArray(resEmpresas.data.data)) {
          const empresasList = resEmpresas.data.data;
          setEmpresas(empresasList);

          if (empresasList.length > 0) {
            setSelectedIdCia(empresasList[0].id);
          } else {
            setError("No hay empresas registradas");
          }
        } else {
          throw new Error("Error al cargar lista de empresas");
        }
      } catch (err: any) {
        console.error("Error cargando empresas:", err);
        setError(err.message || "No se pudieron cargar las empresas");
      } finally {
        setLoading(false);
      }
    };

    fetchEmpresas();
  }, []);

  // Cargar dashboard y locales cuando cambie la empresa
  useEffect(() => {
    if (!selectedIdCia) return;

    const fetchDashboardAndLocales = async () => {
      try {
        setLoading(true);
        setError(null);

        // Dashboard
        const resDashboard = await api.get("/admin/dashboard", {
          params: { idcia: selectedIdCia },
        });

        if (!resDashboard.data?.result) {
          throw new Error(resDashboard.data?.message || "Error en dashboard");
        }
        setDashboardData(resDashboard.data.data || {});

        // Sucursales
        const resLocales = await api.get("/admin/locales", {
          params: { idcia: selectedIdCia },
        });

        if (!resLocales.data?.result) {
          throw new Error(resLocales.data?.message || "Error al cargar locales");
        }
        setLocales(resLocales.data.data || []);

        const clientes = await getClientes(0, 500);
        setNuevosClientesHoy(contarNuevosClientesHoy(clientes));
      } catch (err: any) {
        console.error("Error:", err);
        setError(err.message || "No se pudieron cargar los datos");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardAndLocales();
  }, [selectedIdCia]);


    const openMesasModal = async (local: any) => {
      setSelectedLocal(local);
      setMesas([]);
      setMesasError(null);
      setMesasLoading(true);

    try {
      const resMesas = await api.get("/admin/mesas", {
        params: { idlocal: local.id },
      });

      if (resMesas.data?.result && Array.isArray(resMesas.data.data)) {
        setMesas(resMesas.data.data);
      } else {
        setMesasError("No se pudieron cargar las mesas");
      }
    } catch (err: any) {
      console.error("Error cargando mesas:", err);
      setMesasError(err.message || "Error al cargar mesas");
    } finally {
      setMesasLoading(false);
    }
  };

     const closeMesasModal = () => {
       setSelectedLocal(null);
       setMesas([]);
       setMesasError(null);
    };

  if (checking || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Cargando Dashboard Corporativo...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="bg-white p-10 rounded-3xl shadow-lg text-center max-w-md">
          <AlertCircle size={64} className="mx-auto text-red-500 mb-6" />
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700"
          >
            Intentar de nuevo
          </button>
        </div>
      </div>
    );
  }

  const reservasHoy = dashboardData?.reservas_hoy ?? 0;
  const localesCount = locales.length;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-blue-600 font-bold text-xs uppercase tracking-widest">
            Administración Corporativa
          </span>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            Panel de Gerencia Corporativo
          </h1>
          <p className="text-gray-500 flex items-center gap-2 mt-1">
            <Calendar size={16} /> Vista Corporativa
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

     
      <div className="mb-8 max-w-xs">
        <label className="block text-sm font-bold text-gray-700 mb-2">
          Seleccionar empresa:
        </label>
        <select
          value={selectedIdCia ?? ""}
          onChange={(e) => setSelectedIdCia(Number(e.target.value))}
          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="" disabled>
            Selecciona una empresa
          </option>
          {empresas.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.nomfan || `Empresa ${emp.id}`}
            </option>
          ))}
        </select>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {[
          { label: "Ventas Totales", val: "$0.00", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Reservas Hoy", val: reservasHoy.toString(), icon: Store, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Nuevos Clientes", val: nuevosClientesHoy.toString(), icon: Users, color: "text-indigo-600", bg: "bg-indigo-50" },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-4xl shadow-sm border border-gray-100 group hover:scale-[1.02] transition-transform"
          >
            <div className={`${item.bg} ${item.color} w-12 h-12 rounded-2xl flex items-center justify-center mb-4`}>
              <item.icon size={24} />
            </div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-tight">{item.label}</p>
            <h3 className="text-2xl font-black text-gray-900 mt-1">{item.val}</h3>
          </div>
        ))}
      </div>

      {/* Sucursales */}
      <div className="grid grid-cols-1 gap-8">
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gray-100 rounded-2xl">
                <Layers size={22} className="text-gray-600" />
              </div>
              <h2 className="text-xl font-black text-gray-800">
                Sucursales ({localesCount})
              </h2>
            </div>
            <Link
              href="/gerente/locales"
              className="text-sm font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-100 transition-colors"
            >
              Gestionar Locales
            </Link>
          </div>

          <div className="grid gap-4">
            {locales.length === 0 ? (
              <p className="text-center text-gray-500 py-10">
                No hay sucursales para esta empresa
              </p>
            ) : (
              locales.map((loc: any) => (
                <div
                  key={loc.id}
                  onClick={() => openMesasModal(loc)}
                  className="flex items-center justify-between p-6 bg-gray-50/50 rounded-3xl border border-gray-100 group hover:bg-white hover:shadow-xl hover:shadow-gray-200/40 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-50 group-hover:border-blue-100 transition-colors">
                      <span className="font-black text-gray-300 group-hover:text-blue-500 text-lg">
                        {String(loc.id).padStart(2, "0")}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 text-lg">
                        {loc.detalle || "Sin nombre"}
                      </h4>
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                        Activo
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-10">
                    <div className="text-right hidden md:block">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Ingresos Hoy
                      </p>
                      <p className="font-black text-gray-900 text-xl">$0.00</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-gray-100 group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <ChevronRight size={20} />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal de mesas (sencillo, solo mesas) */}
      {selectedLocal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center p-5 md:p-6 border-b">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                Mesas - {selectedLocal.detalle || "Sin nombre"}
              </h2>
              <button
                onClick={closeMesasModal}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X size={28} className="text-gray-600" />
              </button>
            </div>

            {/* Contenido */}
            <div className="p-5 md:p-6">
              {mesasLoading ? (
                <div className="flex justify-center py-12">
                  <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : mesasError ? (
                <p className="text-center text-red-600 py-10">{mesasError}</p>
              ) : mesas.length === 0 ? (
                <p className="text-center text-gray-600 py-10 text-lg">
                  No hay mesas registradas en esta sucursal
                </p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
                  {mesas.map((mesa: any) => (
                    <div
                      key={mesa.id}
                      className={`p-4 rounded-2xl border text-center ${
                        mesa.estado === 1
                          ? "bg-green-50 border-green-200"
                          : "bg-red-50 border-red-200"
                      }`}
                    >
                      <div className="font-bold text-lg">
                        {mesa.numero || `Mesa ${mesa.id}`}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        Capacidad: {mesa.maxper || "?"} pers.
                      </div>
                      <div className="mt-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            mesa.estado === 1
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {mesa.estado === 1 ? "Disponible" : "No disponible"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Botón cerrar */}
            <div className="p-5 md:p-6 border-t flex justify-end">
              <button
                onClick={closeMesasModal}
                className="bg-gray-200 text-gray-800 px-6 py-3 rounded-xl font-bold hover:bg-gray-300 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}