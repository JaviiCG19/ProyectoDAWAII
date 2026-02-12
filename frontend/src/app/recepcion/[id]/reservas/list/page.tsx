"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle, LogIn, AlertTriangle, Search } from "lucide-react";
import {
  listarReservasActivas,
  confirmarReserva,
  cancelarReserva
} from "@/services/reserva.service";
import { agregarAnticipo } from "@/services/anticipo.service";
import { Reserva } from "@/interface/reserva.interface";

// Modales
import ConfirmarAccionModal from "@/components/modals/ConfirmarAccionModal";
import RegistrarAnticipoModal from "@/components/modals/RegistrarAnticipoModal";

export default function ReservasListPage() {
  const params = useParams();
  const localId = Number(params?.id); // ← obtenemos el ID de la sucursal

  const router = useRouter();
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [modalType, setModalType] = useState<"none" | "confirmar" | "cancelar" | "anticipo">("none");
  const [reservaSeleccionada, setReservaSeleccionada] = useState<Reserva | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  const MONTO_ANTICIPO_FIJO = 10;

  const cargarReservas = async () => {
    try {
      const data = await listarReservasActivas(localId); 
      setReservas(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Error al cargar las reservas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (localId) {
      cargarReservas();
    }
  }, [localId]);

  const abrirModalConfirmar = (reserva: Reserva) => {
    setReservaSeleccionada(reserva);
    setModalType("confirmar");
    setError(null);
    setSuccessMessage(null);
  };

  const abrirModalCancelar = (reserva: Reserva) => {
    setReservaSeleccionada(reserva);
    setModalType("cancelar");
    setError(null);
    setSuccessMessage(null);
  };

  const procesarConfirmar = async () => {
    if (!reservaSeleccionada) return;

    setModalLoading(true);
    setError(null);

    try {
      await confirmarReserva(reservaSeleccionada.id);

      setSuccessMessage("¡Reserva confirmada correctamente!");
      cargarReservas();
      cerrarModal();
    } catch (err: any) {
      const mensaje = (err.message || "").toLowerCase();
      if (mensaje.includes("anticipo") || err.status === 409 || err.statusCode === 409) {
        setModalType("anticipo");
      } else {
        setError("Error al confirmar la reserva: " + (err.message || "Intenta nuevamente"));
        setModalLoading(false);
      }
    } finally {
      if (modalType !== "anticipo") {
        setModalLoading(false);
      }
    }
  };

  const procesarAnticipo = async () => {
    if (!reservaSeleccionada) return;

    setModalLoading(true);
    setError(null);

    try {
      await agregarAnticipo({
        reservaId: reservaSeleccionada.id,
        monto: MONTO_ANTICIPO_FIJO,
      });

      await confirmarReserva(reservaSeleccionada.id);

      setSuccessMessage(
        `Anticipo de $${MONTO_ANTICIPO_FIJO} registrado y reserva confirmada exitosamente`
      );
      cargarReservas();
      cerrarModal();
    } catch (err: any) {
      setError(
        "Error al registrar anticipo o confirmar reserva: " +
          (err.message || "Por favor intenta de nuevo")
      );
    } finally {
      setModalLoading(false);
    }
  };

  const procesarCancelar = async () => {
    if (!reservaSeleccionada) return;

    setModalLoading(true);

    try {
      await cancelarReserva(reservaSeleccionada.id);
      setSuccessMessage("Reserva cancelada correctamente");
      cargarReservas();
      cerrarModal();
    } catch (err: any) {
      setError("Error al cancelar: " + (err.message || "Intenta de nuevo"));
    } finally {
      setModalLoading(false);
    }
  };

  const cerrarModal = () => {
    setModalType("none");
    setReservaSeleccionada(null);
    setModalLoading(false);
    setError(null);
  };

  if (loading) return <div className="p-6 text-center">Cargando reservas...</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-800">
          Listado de Reservas Pendientes
        </h1>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => router.push(`/recepcion/${localId}/reservas/check-no-show`)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium shadow-md transition-all"
          >
            <Search size={20} />
            Buscar por ID (Check-in / No-show)
          </button>

          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-gray-200 text-slate-700 rounded-xl hover:bg-gray-300 font-medium shadow-sm transition-all"
          >
            Volver
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl flex items-center justify-between">
          <span>{successMessage}</span>
          <button onClick={() => setSuccessMessage(null)} className="text-green-700 hover:text-green-900">
            ×
          </button>
        </div>
      )}

      {reservas.length === 0 ? (
        <p className="text-slate-500 text-center py-10">
          No hay reservas pendientes en este momento.
        </p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-sm border">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Franja</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Personas</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Mesa</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {reservas.map((reserva) => (
                <tr key={reserva.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{reserva.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{reserva.idcliente}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{reserva.fecha}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{reserva.franja_id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{reserva.numper}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{reserva.idmesa || "Automática"}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        reserva.estado === 0 ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      Pendiente
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex gap-4">
                      <button
                        onClick={() => abrirModalConfirmar(reserva)}
                        className="text-green-600 hover:text-green-800 flex items-center gap-1 font-medium"
                      >
                        <CheckCircle size={16} /> Confirmar
                      </button>
                      <button
                        onClick={() => abrirModalCancelar(reserva)}
                        className="text-red-600 hover:text-red-800 flex items-center gap-1 font-medium"
                      >
                        <XCircle size={16} /> Cancelar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal genérico para confirmar / cancelar */}
      <ConfirmarAccionModal
        isOpen={modalType === "confirmar" || modalType === "cancelar"}
        onClose={cerrarModal}
        onConfirm={modalType === "confirmar" ? procesarConfirmar : procesarCancelar}
        title={modalType === "confirmar" ? "Confirmar Reserva" : "Cancelar Reserva"}
        message={
          modalType === "confirmar"
            ? "¿Desea confirmar esta reserva?"
            : "¿Está seguro de cancelar esta reserva? Esta acción no se puede deshacer."
        }
        confirmText={modalType === "confirmar" ? "Confirmar" : "Sí, Cancelar"}
        confirmColor={modalType === "confirmar" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}
        loading={modalLoading}
      />

      {/* Modal de anticipo */}
      <RegistrarAnticipoModal
        isOpen={modalType === "anticipo"}
        onClose={cerrarModal}
        onConfirm={procesarAnticipo}
        loading={modalLoading}
      />
    </div>
  );
}