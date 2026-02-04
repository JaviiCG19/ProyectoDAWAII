"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, LogIn, AlertTriangle, Loader2 } from "lucide-react";
import { checkInReserva, marcarNoShow } from "@/services/reserva.service";

import { ReservaDetalle } from "@/interface/reserva.interface";


export default function CheckNoShowBuscarPage() {
  const router = useRouter();

  const [reservaId, setReservaId] = useState("");
  const [reserva, setReserva] = useState<ReservaDetalle | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const buscarReserva = async () => {
    if (!reservaId.trim() || isNaN(Number(reservaId))) {
      setError("Ingresa un ID numérico válido");
      return;
    }

    setLoading(true);
    setError(null);
    setReserva(null);

    try {
     
      const response = await fetch(`http://localhost:5000/reservas/${reservaId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          tokenapp: localStorage.getItem("token") || "",
        },
      });

      if (!response.ok) {
        const errData = await response.json();
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
  if (!confirm("¿Realizar check-in de esta reserva?")) return;

  try {
    await checkInReserva(reserva.id);
    alert("¡Check-in realizado correctamente!");
    buscarReserva(); 
  } catch (err: any) {
    const mensajeBackend = err.message || "Error al realizar check-in";

    if (
      mensajeBackend.toLowerCase().includes("anticipo") ||
      mensajeBackend.includes("No hay datos") 
    ) {
      alert(
        "No se puede hacer check-in: la reserva no tiene anticipo pagado.\n\n" +
        "Debes agregar un anticipo primero para hacer un check-in."
      );
    } else {
      alert(mensajeBackend);
    }
  }
};

  const handleNoShow = async () => {
    if (!reserva) return;
    if (!confirm("¿Marcar como no-show? Esta acción es irreversible.")) return;

    try {
      await marcarNoShow(reserva.id);
      alert("Reserva marcada como no-show");
      // Recarga
      buscarReserva();
    } catch (err: any) {
      alert(err.message || "Error al marcar no-show");
    }
  };

  return (
    <div className="p-6 space-y-8 max-w-5xl mx-auto">
      {/* Cabecera */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
          <LogIn size={32} className="text-blue-600" />
          Check-in / No-show por ID
        </h1>
        <button
          onClick={() => router.back()}
          className="px-5 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 font-medium"
        >
          Volver
        </button>
      </div>

      {/* Buscador */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={reservaId}
            onChange={(e) => setReservaId(e.target.value)}
            placeholder="Ingresa el ID de la reserva"
            className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          />
         <button
             onClick={buscarReserva}
                 disabled={loading || !reservaId.trim()}
                 className="px-8 py-3 bg-indigo-600 !text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium min-w-[140px] shadow-md"
         >
         {loading ? (
            <Loader2 size={20} className="animate-spin text-white" />  
         ) : (
          <Search size={20} className="text-white" />
       )}
         <span className="text-white font-bold">Buscar</span>BUSCAR
    </button>
        </div>

        {error && (
          <p className="mt-4 text-red-600 font-medium text-center">{error}</p>
        )}
      </div>

      {/* Tabla de resultado */}
      {reserva ? (
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <div className="p-4 bg-slate-50 border-b font-semibold text-slate-700">
            Reserva encontrada - ID: {reserva.id}
          </div>
          <div className="overflow-x-auto">
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
              <tbody>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium">{reserva.id}</td>
                  <td className="px-6 py-4">{reserva.idcliente} {reserva.nombreCliente ? `(${reserva.nombreCliente})` : ""}</td>
                  <td className="px-6 py-4">{reserva.fecha}</td>
                  <td className="px-6 py-4">{reserva.franja_id}</td>
                  <td className="px-6 py-4">{reserva.numper}</td>
                  <td className="px-6 py-4">{reserva.idmesa || "Automática"}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        reserva.estado === 0
                          ? "bg-yellow-100 text-yellow-800"
                          : reserva.estado === 1
                          ? "bg-green-100 text-green-800"
                          : reserva.estado === 3
                          ? "bg-blue-100 text-blue-800"
                          : reserva.estado === 4
                          ? "bg-orange-100 text-orange-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {reserva.estado === 0 ? "Pendiente" :
                       reserva.estado === 1 ? "Confirmada" :
                       reserva.estado === 3 ? "Check-in" :
                       reserva.estado === 4 ? "No-show" : "Eliminadaa"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-4">
                      {(reserva.estado === 0 || reserva.estado === 1) && (
                        <button
                          onClick={handleCheckIn}
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium"
                        >
                          <LogIn size={16} />
                          Check-in
                        </button>
                      )}
                      {(reserva.estado === 0 || reserva.estado === 1) && (
                        <button
                          onClick={handleNoShow}
                          className="flex items-center gap-1 text-orange-600 hover:text-orange-800 font-medium"
                        >
                          <AlertTriangle size={16} />
                          No-show
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        !loading && !error && (
          <div className="text-center py-10 text-slate-500">
            Ingresa un ID y haz clic en Buscar para ver detalles y acciones.
          </div>
        )
      )}
    </div>
  );
}