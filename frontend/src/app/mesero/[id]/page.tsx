"use client";

import { useParams } from "next/navigation";
import { useAuth } from "@/services/useAuth";
import { useEffect, useState } from "react";
import { getUsoMesas } from "@/services/reporte.service";
import { Mesa } from "@/interface/mesa.interface";
import { Users, Lock, Unlock, Coffee, RefreshCw } from "lucide-react";

import LiberarMesaModal from "@/components/modals/LiberarMesaModal";
import api from "@/services/api";

// Definimos la interfaz para los datos que vienen del reporte de Python
interface MesaReporte extends Mesa {
  checkin: number;
  total_reservas: number;
  ocupada_ahora?: boolean; 
}

export default function MeseroPage() {
  const params = useParams();
  const localId = params?.id as string;

  const checking = useAuth(["5"]); // Rol Mesero

  const [mesas, setMesas] = useState<MesaReporte[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Estados para el modal
  const [modalOpen, setModalOpen] = useState(false);
  const [mesaSeleccionada, setMesaSeleccionada] = useState<MesaReporte | null>(null);
  const [isLiberando, setIsLiberando] = useState(false);

  const cargarMesasOcupadas = async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setIsRefreshing(true);
    }

    try {
      // Obtenemos el reporte de uso que ya trae los contadores de estados
      const usoMesas = await getUsoMesas(Number(localId));

      // FILTRADO LÓGICO: Solo mostramos mesas que tengan al menos 1 reserva en "Check-in" (estado 3)
      const soloOcupadas = usoMesas
        .filter((item: any) => item.checkin > 0)
        .map((item: any) => ({
          ...item,
          ocupada: true,
        }));

      setMesas(soloOcupadas);
    } catch (err) {
      console.error("Error al cargar mesas ocupadas:", err);
    } finally {
      if (isManualRefresh) {
        setIsRefreshing(false);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    if (checking || !localId || localId === "undefined") return;

    // Carga inicial
    cargarMesasOcupadas();

    // Polling automático cada 10 segundos
    const interval = setInterval(() => {
      cargarMesasOcupadas();
    }, 10000); // 10 segundos

    // Limpieza al desmontar el componente
    return () => clearInterval(interval);
  }, [checking, localId]);

  const handleLiberarMesa = (mesa: MesaReporte) => {
    setMesaSeleccionada(mesa);
    setModalOpen(true);
  };

  const confirmarLiberar = async () => {
    if (!mesaSeleccionada) return;

    setIsLiberando(true);

    try {
      // 1. Llamada al API para restaurar la mesa
      await api.post(`/admin/mesas/restaurar/${mesaSeleccionada.id}`);

      // 2. OPTIMIZACIÓN: Filtramos el estado local para que la mesa desaparezca al instante
      setMesas((prev) => prev.filter((m) => m.id !== mesaSeleccionada.id));
      
      console.log(`Mesa ${mesaSeleccionada.numero} liberada correctamente`);
    } catch (err: any) {
      console.error("Error al liberar la mesa:", err);
      alert("No se pudo liberar la mesa. Intenta nuevamente.");
    } finally {
      setIsLiberando(false);
      setModalOpen(false);
      setMesaSeleccionada(null);
    }
  };

  if (checking || loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
        <p className="mt-4 text-gray-600 font-medium">Buscando mesas en servicio...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="max-w-7xl mx-auto mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-2">
            <Coffee className="text-red-500" size={32} />
            Mesas en Servicio (Check-in)
          </h1>
          <p className="text-gray-500 mt-1">Sucursal #{localId} - Solo mesas ocupadas</p>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-red-100">
            <span className="text-sm font-bold text-gray-400 uppercase tracking-tight">Activas</span>
            <p className="text-2xl font-black text-red-600">{mesas.length}</p>
          </div>

          <button
            onClick={() => cargarMesasOcupadas(true)}
            disabled={isRefreshing || loading}
            className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 
                     disabled:opacity-50 disabled:cursor-not-allowed font-medium text-slate-700 
                     shadow-sm transition-all flex items-center gap-2"
          >
            <RefreshCw size={18} className={isRefreshing ? "animate-spin" : ""} />
            {isRefreshing ? "Actualizando..." : "Actualizar ahora"}
          </button>
        </div>
      </header>

      {mesas.length === 0 ? (
        <div className="max-w-7xl mx-auto text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
          <Unlock className="mx-auto text-gray-300 mb-4" size={64} />
          <p className="text-xl text-gray-600 font-bold">
            No hay mesas ocupadas por ahora
          </p>
          <p className="text-gray-400 mt-2">
            Las mesas aparecerán aquí cuando Recepción marque el "Check-in".
          </p>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mesas.map((mesa) => (
            <div
              key={mesa.id}
              className="bg-white rounded-3xl shadow-md border-2 border-red-500 p-6 relative overflow-hidden transition-all hover:shadow-xl"
            >
              {/* Badge de estado */}
              <div className="absolute top-0 right-0 bg-red-500 text-white px-4 py-1 rounded-bl-xl text-[10px] font-black uppercase tracking-widest">
                En Servicio
              </div>

              <div className="flex justify-between items-start mb-6">
                <div className="p-4 rounded-2xl bg-red-50 text-red-600">
                  <Lock size={28} />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-3xl font-black text-gray-800 tracking-tighter">
                  Mesa {mesa.numero.toUpperCase().replace("MS-", "")}
                </h3>
                <div className="flex items-center gap-2 text-gray-500 font-medium">
                  <Users size={18} className="text-gray-400" />
                  <span>Capacidad: {mesa.maxper} pers.</span>
                </div>
              </div>

              <div className="mt-8">
                <button
                  onClick={() => handleLiberarMesa(mesa)}
                  disabled={isLiberando}
                  className="w-full py-4 bg-red-600 hover:bg-red-700 active:scale-95 disabled:bg-gray-300 text-white rounded-2xl font-bold text-sm transition-all shadow-lg shadow-red-200 flex items-center justify-center gap-2"
                >
                  <Unlock size={20} />
                  {isLiberando ? "Procesando..." : "LIBERAR MESA"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de confirmación */}
      <LiberarMesaModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setMesaSeleccionada(null);
        }}
        onConfirm={confirmarLiberar}
        mesaNumero={mesaSeleccionada?.numero || ""}
        isLoading={isLiberando}
      />
    </div>
  );
}