"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle, LogIn, AlertTriangle } from "lucide-react";
import { listarReservasActivas, confirmarReserva, cancelarReserva, checkInReserva, marcarNoShow} from "@/services/reserva.service";
import {Reserva} from "@/interface/reserva.interface";



export default function ReservasListPage() {
  const router = useRouter();
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargarReservas = async () => {
    try {
      const data = await listarReservasActivas();
      setReservas(data);
    } catch (err: any) {
      setError(err.message || "Error al cargar las reservas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarReservas();
  }, []);

  const handleConfirmar = async (id: number) => {
    if (!confirm("¿Confirmar esta reserva?")) return;
    try {
      await confirmarReserva(id);
      alert("Reserva confirmada correctamente");
      cargarReservas(); 
    } catch (err: any) {
      alert(err.message || "Error al confirmar");
    }
  };

  const handleCancelar = async (id: number) => {
    if (!confirm("¿Cancelar esta reserva?")) return;
    try {
      await cancelarReserva(id);
      alert("Reserva cancelada correctamente");
      cargarReservas();
    } catch (err: any) {
      alert(err.message || "Error al cancelar");
    }
  };

  const handleCheckIn = async (id: number) => {
    if (!confirm("¿Realizar check-in del cliente?")) return;
    try {
      await checkInReserva(id);
      alert("Check-in realizado correctamente");
      cargarReservas();
    } catch (err: any) {
      alert(err.message || "Error al hacer check-in");
    }
  };

  const handleNoShow = async (id: number) => {
    if (!confirm("¿Marcar como no-show? Esta acción es irreversible.")) return;
    try {
      await marcarNoShow(id);
      alert("Reserva marcada como no-show");
      cargarReservas();
    } catch (err: any) {
      alert(err.message || "Error al marcar no-show");
    }
  };

  if (loading) return <div className="p-6">Cargando reservas...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">
          Listado de Reservas pen
        </h1>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          Volver
        </button>
      </div>

      {reservas.length === 0 ? (
        <p className="text-slate-500">No hay reservas activas en este momento.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-sm border">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                  Franja
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                  Personas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                  Mesa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {reservas.map((reserva) => (
                <tr key={reserva.id}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{reserva.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{reserva.idcliente}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{reserva.fecha}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{reserva.franja_id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{reserva.numper}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{reserva.idmesa || "Automática"}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        reserva.estado === 0
                          ? "bg-yellow-100 text-yellow-800"
                          : reserva.estado === 1
                          ? "bg-green-100 text-green-800"
                          : reserva.estado === 2
                          ? "bg-red-100 text-red-800"
                          : reserva.estado === 3
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {reserva.estado === 0
                        ? "Pendiente"
                        : reserva.estado === 1
                        ? "Confirmada"
                        : reserva.estado === 2
                        ? "Cancelada"
                        : reserva.estado === 3
                        ? "Check-in"
                        : reserva.estado === 4
                        ? "No-show"
                        : "Desconocido"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex gap-3">
                      {reserva.estado === 0 && (
                        <>
                          <button
                            onClick={() => handleConfirmar(reserva.id)}
                            className="text-green-600 hover:text-green-800 flex items-center gap-1"
                          >
                            <CheckCircle size={16} /> Confirmar
                          </button>
                          <button
                            onClick={() => handleCancelar(reserva.id)}
                            className="text-red-600 hover:text-red-800 flex items-center gap-1"
                          >
                            <XCircle size={16} /> Cancelar
                          </button>
                        </>
                      )}

                      {reserva.estado === 1 && (
                        <>
                          <button
                            onClick={() => handleCheckIn(reserva.id)}
                            className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                          >
                            <LogIn size={16} /> Check-in
                          </button>
                          <button
                            onClick={() => handleNoShow(reserva.id)}
                            className="text-orange-600 hover:text-orange-800 flex items-center gap-1"
                          >
                            <AlertTriangle size={16} /> No-show
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}