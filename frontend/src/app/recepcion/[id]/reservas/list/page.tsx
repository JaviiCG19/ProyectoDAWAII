"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle, LogIn, AlertTriangle, Search } from "lucide-react";
import {
  listarReservasActivas,
  confirmarReserva,
  cancelarReserva
} from "@/services/reserva.service";
import { Reserva } from "@/interface/reserva.interface";

import { agregarAnticipo } from "@/services/anticipo.service"; 

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
      alert("¡Reserva confirmada correctamente!");
      cargarReservas();
    } catch (err: any) {
      const mensaje = err.message?.toLowerCase() || "";

      if (
        mensaje.includes("anticipo")
      ) {
        const deseaAgregar = confirm(
          "La reserva no tiene anticipo registrado.\n\n" +
          "¿Desea agregar un anticipo ahora para poder confirmar?"
        );

        if (deseaAgregar) {
          const montoStr = prompt(
            "Ingresa el monto del anticipo (ej. 20.00):",
            "0.00"
          );

          if (!montoStr || isNaN(Number(montoStr)) || Number(montoStr) <= 0) {
            alert("Monto inválido. La reserva sigue pendiente.");
            return;
          }

          const monto = Number(montoStr);

          try {
            await agregarAnticipo({
              reservaId: id,
              monto,
            });

            alert("¡Anticipo agregado correctamente!");

            await confirmarReserva(id);
            alert("Reserva confirmada con éxito tras agregar anticipo.");
            cargarReservas();
          } catch (anticipoErr: any) {
            alert(
              "Error al agregar anticipo: " +
              (anticipoErr.message || "Intenta de nuevo.")
            );
          }
        } else {
          alert("La reserva sigue pendiente. Agrega anticipo cuando desees.");
        }
      } else {
        alert("Error al confirmar: " + (err.message || "Intenta de nuevo."));
      }
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


  if (loading) return <div className="p-6">Cargando reservas...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-800">
          Listado de Reservas pendientes
        </h1>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => router.push(`/recepcion/}/reservas/check-no-show`)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium shadow-md transition-all min-w-[240px]"
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

      {reservas.length === 0 ? (
        <p className="text-slate-500 text-center py-10">
          No hay reservas activas en este momento.
        </p>
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
                        : "Desconocido"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex gap-3 flex-wrap">
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