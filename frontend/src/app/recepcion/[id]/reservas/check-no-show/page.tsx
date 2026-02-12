"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, LogIn, AlertTriangle, Loader2, List } from "lucide-react";

import { checkInReserva, marcarNoShow } from "@/services/reserva.service";
import { ReservaDetalle } from "@/interface/reserva.interface";

import ConfirmarCheckNoshow from "@/components/modals/ConfirmarCheckNoshow";
import InformarAnticipoRequeridoModal from "@/components/modals/InformarAnticipoRequeridoModal";

export default function CheckNoShowBuscarPage() {
  const params = useParams();
  const localId = Number(params?.id); 

  const router = useRouter();

  const [reservaId, setReservaId] = useState("");
  const [reserva, setReserva] = useState<ReservaDetalle | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [todasReservas, setTodasReservas] = useState<ReservaDetalle[]>([]);
  const [loadingTodas, setLoadingTodas] = useState(false);

  const [showConfirmCheckIn, setShowConfirmCheckIn] = useState(false);
  const [showConfirmNoShow, setShowConfirmNoShow] = useState(false);
  const [showAnticipoRequerido, setShowAnticipoRequerido] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    if (localId) {
      cargarTodasLasReservas();
    }
  }, [localId]);

  const cargarTodasLasReservas = async () => {
    setLoadingTodas(true);
    try {
      const response = await fetch(`http://localhost/api/reservas/list/all?idlocal=${localId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          tokenapp: localStorage.getItem("token") || "",
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}`);
      }

      const data = await response.json();
      const reservasList = data.data || data || [];
      setTodasReservas(reservasList);
    } catch (err: any) {
      console.error("Error al cargar todas las reservas:", err);
    } finally {
      setLoadingTodas(false);
    }
  };

  const buscarReserva = async () => {
    if (!reservaId.trim() || isNaN(Number(reservaId))) {
      setError("Ingresa un ID numérico válido");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    setReserva(null);

    try {
      const response = await fetch(`http://localhost/api/reservas/${reservaId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          tokenapp: localStorage.getItem("token") || "",
        },
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || `Error ${response.status}`);
      }

      const data = await response.json();
      const reservaData = data.data || data;
      setReserva(reservaData);
    } catch (err: any) {
      setError(err.message || "No se pudo encontrar la reserva");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    if (!reserva) return;
    setShowConfirmCheckIn(true);
    setError(null);
    setSuccessMessage(null);
  };

  const procesarCheckIn = async () => {
    if (!reserva) return;

    setModalLoading(true);

    try {
      await checkInReserva(reserva.id);
      setSuccessMessage("¡Check-in realizado correctamente!");
      setShowConfirmCheckIn(false);
      buscarReserva();
      cargarTodasLasReservas();
    } catch (err: any) {
      const mensajeBackend = err.message || "Error al realizar check-in";

      if (
        mensajeBackend.toLowerCase().includes("anticipo") ||
        mensajeBackend.includes("No hay datos")
      ) {
        setShowConfirmCheckIn(false);
        setShowAnticipoRequerido(true);
      } else {
        setError(mensajeBackend);
      }
    } finally {
      setModalLoading(false);
    }
  };

  const handleNoShow = async () => {
    if (!reserva) return;
    setShowConfirmNoShow(true);
    setError(null);
    setSuccessMessage(null);
  };

  const procesarNoShow = async () => {
    if (!reserva) return;

    setModalLoading(true);

    try {
      await marcarNoShow(reserva.id);
      setSuccessMessage("Reserva marcada como no-show");
      setShowConfirmNoShow(false);
      buscarReserva();
      cargarTodasLasReservas();
    } catch (err: any) {
      setError(err.message || "Error al marcar no-show");
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
        {/* Cabecera */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800 flex items-center gap-3">
            <LogIn size={32} className="text-blue-600" />
            Buscar o marcar Check-in / No-show
          </h1>

          <div className="flex gap-3">
            <button
              onClick={() => router.back()}
              className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 font-medium text-slate-600 shadow-sm transition-all"
            >
              Volver
            </button>
          </div>
        </div>

        {/* Buscador por ID */}
        <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
            <input
              type="text"
              value={reservaId}
              onChange={(e) => setReservaId(e.target.value)}
              placeholder="Ingresa el ID de la reserva"
              className="flex-1 px-4 py-3 border border-slate-300 rounded-xl text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            <button
              onClick={buscarReserva}
              disabled={loading || !reservaId.trim()}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:bg-indigo-400 disabled:text-white/70 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium min-w-[140px] shadow-md transition-all"
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin text-white" />
              ) : (
                <Search size={20} className="text-white" />
              )}
              Buscar
            </button>
          </div>

          {error && (
            <p className="mt-4 text-red-600 font-medium text-center text-sm md:text-base">
              {error}
            </p>
          )}

          {successMessage && (
            <p className="mt-4 text-green-600 font-medium text-center text-sm md:text-base">
              {successMessage}
            </p>
          )}
        </div>

        {/* Resultado de Busqueda */}
        {reserva && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-5 md:p-6 bg-slate-50 border-b font-semibold text-slate-700 text-base md:text-lg">
              Reserva encontrada - ID: {reserva.id}
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Cliente</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Fecha</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Franja</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Personas</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Mesa</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Estado</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-4 font-medium">{reserva.id}</td>
                    <td className="px-4 py-4">
                      {reserva.idcliente} {reserva.nombreCliente ? `(${reserva.nombreCliente})` : ""}
                    </td>
                    <td className="px-4 py-4">{reserva.fecha}</td>
                    <td className="px-4 py-4">{reserva.franja_id}</td>
                    <td className="px-4 py-4">{reserva.numper}</td>
                    <td className="px-4 py-4">{reserva.idmesa || "Automática"}</td>
                    <td className="px-4 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          reserva.estado === 0 ? "bg-yellow-100 text-yellow-800" :
                          reserva.estado === 1 ? "bg-green-100 text-green-800" :
                          reserva.estado === 3 ? "bg-blue-100 text-blue-800" :
                          reserva.estado === 4 ? "bg-orange-100 text-orange-800" :
                          "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {reserva.estado === 0 ? "Pendiente" :
                         reserva.estado === 1 ? "Confirmada" :
                         reserva.estado === 3 ? "Check-in" :
                         reserva.estado === 4 ? "No-show" : "Eliminada"}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-4">
                        {(reserva.estado === 0 || reserva.estado === 1) && (
                          <>
                            <button
                              onClick={handleCheckIn}
                              className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                            >
                              <LogIn size={18} /> Check-in
                            </button>
                            <button
                              onClick={handleNoShow}
                              className="text-orange-600 hover:text-orange-800 font-medium flex items-center gap-1"
                            >
                              <AlertTriangle size={18} /> No-show
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tabla de TODAS las reservas */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-5 md:p-6 bg-slate-50 border-b font-semibold text-slate-700 text-base md:text-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <List size={24} className="text-indigo-600" />
              Todas las Reservas
            </div>
            <button
              onClick={cargarTodasLasReservas}
              disabled={loadingTodas}
              className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 flex items-center gap-2"
            >
              {loadingTodas ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                "Actualizar"
              )}
            </button>
          </div>

          {loadingTodas ? (
            <div className="p-10 text-center text-slate-500">
              Cargando reservas...
            </div>
          ) : todasReservas.length === 0 ? (
            <div className="p-10 text-center text-slate-500">
              No hay reservas registradas
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Cliente</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Fecha</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Franja</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Personas</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Mesa</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {todasReservas.map((res) => (
                    <tr key={res.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-medium">{res.id}</td>
                      <td className="px-4 py-3">
                        {res.idcliente} {res.nombreCliente ? `(${res.nombreCliente})` : ""}
                      </td>
                      <td className="px-4 py-3">{res.fecha}</td>
                      <td className="px-4 py-3">{res.franja_id}</td>
                      <td className="px-4 py-3">{res.numper}</td>
                      <td className="px-4 py-3">{res.idmesa || "Automática"}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            res.estado === 0 ? "bg-yellow-100 text-yellow-800" :
                            res.estado === 1 ? "bg-green-100 text-green-800" :
                            res.estado === 3 ? "bg-blue-100 text-blue-800" :
                            res.estado === 4 ? "bg-orange-100 text-orange-800" :
                            "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {res.estado === 0 ? "Pendiente" :
                           res.estado === 1 ? "Confirmada" :
                           res.estado === 3 ? "Check-in" :
                           res.estado === 4 ? "No-show" : "Eliminada"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modales */}
        <ConfirmarCheckNoshow
          isOpen={showConfirmCheckIn}
          onClose={() => setShowConfirmCheckIn(false)}
          onConfirm={procesarCheckIn}
          title="Realizar Check-in"
          message="¿Desea realizar el check-in de esta reserva?"
          confirmText="Sí, Check-in"
          confirmColor="bg-blue-600 hover:bg-blue-700"
          loading={modalLoading}
        />

        <ConfirmarCheckNoshow
          isOpen={showConfirmNoShow}
          onClose={() => setShowConfirmNoShow(false)}
          onConfirm={procesarNoShow}
          title="Marcar No-show"
          message="¿Está seguro de marcar esta reserva como no-show? Esta acción es irreversible."
          confirmText="Sí, No-show"
          confirmColor="bg-orange-600 hover:bg-orange-700"
          loading={modalLoading}
        />

        <InformarAnticipoRequeridoModal
          isOpen={showAnticipoRequerido}
          onClose={() => setShowAnticipoRequerido(false)}
        />
      </div>
    </div>
  );
}