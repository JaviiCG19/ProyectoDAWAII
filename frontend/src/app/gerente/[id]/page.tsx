"use client";

import { useAuth } from "@/services/useAuth";
import { useState, useEffect } from "react";
import { Users, Calendar, AlertCircle, Table, BarChart3, Layers, ChevronRight, Gift } from "lucide-react";
import { useRouter } from "next/navigation";

import api from "@/services/api";
import { getClientes } from "@/services/cliente.service";

// Importamos los modals
import MesasModal from "@/components/modals/MesasModal";
import ReporteConsolidadoModal from "@/components/modals/ReporteConsolidadoModal";
import PromocionesActivasModal from "@/components/modals/PromocionesActivasModal";

export default function GerenteDashboardPage() {
  const checking = useAuth(["2"]);
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [locales, setLocales] = useState<any[]>([]);
  const [totalClientes, setTotalClientes] = useState(0);
  const [promocionesEliminadasCount, setPromocionesEliminadasCount] = useState(0);

  const [selectedLocal, setSelectedLocal] = useState<any>(null);
  const [mesas, setMesas] = useState<any[]>([]);
  const [mesasLoading, setMesasLoading] = useState(false);
  const [mesasError, setMesasError] = useState<string | null>(null);

  const [showReporteModal, setShowReporteModal] = useState(false);

  // Estados para el modal de promociones
  const [showPromocionesModal, setShowPromocionesModal] = useState(false);
  const [promocionesActivas, setPromocionesActivas] = useState<any[]>([]);
  const [promocionesLoading, setPromocionesLoading] = useState(false);
  const [selectedLocalPromo, setSelectedLocalPromo] = useState<any>(null);

  const idcia = Number(localStorage.getItem("id_res")) || 0;

  useEffect(() => {
    const fetchDashboardAndLocales = async () => {
      try {
        setLoading(true);
        setError(null);

        const resDashboard = await api.get("/admin/dashboard");
        if (!resDashboard.data?.result) {
          throw new Error(resDashboard.data?.message || "Error en dashboard");
        }
        setDashboardData(resDashboard.data.data || {});

        if (!idcia || isNaN(idcia)) {
          throw new Error("No se encontró la empresa asociada al gerente");
        }

        const resLocales = await api.get("/admin/locales", { params: { idcia } });
        if (!resLocales.data?.result) {
          throw new Error(resLocales.data?.message || "Error al cargar sucursales");
        }
        const localesData = resLocales.data.data || [];
        setLocales(localesData);

        // ← CAMBIO IMPORTANTE: Total de clientes de TODOS los locales de la empresa
        let totalClientesEmpresa = 0;
        for (const local of localesData) {
          try {
            const clientesLocal = await getClientes(local.id, 0, 1000); // límite alto por si hay muchos
            totalClientesEmpresa += clientesLocal.length;
          } catch (err) {
            console.warn(`Error al cargar clientes del local ${local.id}`, err);
            // No fallamos todo el dashboard por un local
          }
        }
        setTotalClientes(totalClientesEmpresa);

        let totalEliminadas = 0;

        for (const local of localesData) {
          try {
            const resEliminadas = await api.get("/admin/promociones/eliminadas", {
              params: { idlocal: local.id },
            });

            if (resEliminadas.data?.data && Array.isArray(resEliminadas.data.data)) {
              totalEliminadas += resEliminadas.data.data.length;
            }
          } catch (promoErr) {
            console.warn(`Error al cargar promociones eliminadas del local ${local.id}`, promoErr);
          }
        }

        setPromocionesEliminadasCount(totalEliminadas);

      } catch (err: any) {
        console.error("Error:", err);
        setError(err.message || err.response?.data?.message || "Error al cargar datos");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardAndLocales();
  }, []);

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
      console.error("Error mesas:", err);
      setMesasError(err.message || "Error al cargar mesas");
    } finally {
      setMesasLoading(false);
    }
  };

  // Función para abrir el modal de promociones
  const openPromocionesModal = async (local: any) => {
    setSelectedLocalPromo(local);
    setPromocionesActivas([]);
    setPromocionesLoading(true);
    setShowPromocionesModal(true);

    try {
      const res = await api.get("/admin/promociones", {
        params: { idlocal: local.id },
      });

      if (res.data?.result && Array.isArray(res.data.data)) {
        const ahora = new Date();
        const activas = res.data.data.filter((p: any) => {
          const inicio = new Date(p.fec_inicio);
          const fin = new Date(p.fec_fin);
          return inicio <= ahora && fin >= ahora;
        });
        setPromocionesActivas(activas);
      }
    } catch (err) {
      console.error("Error al cargar promociones activas:", err);
      setPromocionesActivas([]);
    } finally {
      setPromocionesLoading(false);
    }
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
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 group hover:scale-[1.02] transition-transform">
          <div className="bg-emerald-50 text-emerald-600 w-14 h-14 rounded-2xl flex items-center justify-center mb-4">
            <Calendar size={28} />
          </div>
          <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">Reservas Confirmadas Hoy</p>
          <h3 className="text-4xl font-black text-gray-900 mt-2">{reservasHoy.toLocaleString()}</h3>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 group hover:scale-[1.02] transition-transform">
          <div className="bg-indigo-50 text-indigo-600 w-14 h-14 rounded-2xl flex items-center justify-center mb-4">
            <Users size={28} />
          </div>
          <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">Total de Clientes</p>
          <h3 className="text-4xl font-black text-gray-900 mt-2">{totalClientes.toLocaleString()}</h3>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 group hover:scale-[1.02] transition-transform">
          <div className="bg-red-50 text-red-600 w-14 h-14 rounded-2xl flex items-center justify-center mb-4">
            <Gift size={28} />
          </div>
          <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">Promociones Inactivas</p>
          <h3 className="text-4xl font-black text-gray-900 mt-2">{promocionesEliminadasCount.toLocaleString()}</h3>
        </div>
      </div>

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
          </div>

          <div className="grid gap-4">
            {locales.length === 0 ? (
              <p className="text-center text-gray-500 py-10">
                No hay sucursales registradas para esta empresa
              </p>
            ) : (
              locales.map((loc: any) => (
                <div
                  key={loc.id}
                  className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-gray-50/50 rounded-3xl border border-gray-100 group hover:bg-white hover:shadow-xl hover:shadow-gray-200/40 transition-all"
                >
                  <div className="flex items-center gap-5 flex-1">
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

                  <div className="flex items-center gap-3 mt-4 md:mt-0 flex-wrap">
                    {/* Botón nuevo: Promociones */}
                    <button
                      onClick={() => openPromocionesModal(loc)}
                      className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
                    >
                      <Gift size={18} className="text-orange-600" />
                      Promociones
                    </button>

                    <button
                      onClick={() => openMesasModal(loc)}
                      className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
                    >
                      <Table size={18} className="text-blue-600" />
                      Ver Mesas
                    </button>
                    <button
                      onClick={() => router.push(`/gerente/${loc.id}/reporte`)}
                      className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
                    >
                      <BarChart3 size={18} className="text-indigo-600" />
                      Ver Reporte
                    </button>
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

      {/* Modales */}
      <MesasModal
        isOpen={!!selectedLocal}
        onClose={() => {
          setSelectedLocal(null);
          setMesas([]);
          setMesasError(null);
        }}
        local={selectedLocal}
        mesas={mesas}
        mesasLoading={mesasLoading}
        mesasError={mesasError}
      />

      <ReporteConsolidadoModal
        isOpen={showReporteModal}
        onClose={() => setShowReporteModal(false)}
        idcia={idcia}
      />

      {/* Nuevo modal de promociones activas */}
      <PromocionesActivasModal
        isOpen={showPromocionesModal}
        onClose={() => {
          setShowPromocionesModal(false);
          setSelectedLocalPromo(null);
          setPromocionesActivas([]);
        }}
        local={selectedLocalPromo}
        promociones={promocionesActivas}
        loading={promocionesLoading}
      />
    </div>
  );
}