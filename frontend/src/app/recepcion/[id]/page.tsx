"use client";

import { useAuth } from "@/services/useAuth";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ConciergeBell, Users, UserPlus } from "lucide-react";

// Servicios
import { getMesasByLocal } from "@/services/mesa.service";
import { getClientes } from "@/services/cliente.service";

// Interfaces
import { Mesa } from "@/interface/mesa.interface";
import { Cliente } from "@/interface/cliente.interface";

// Componentes
import ReservaForm from "@/components/modals/ReservaForm";


export default function RecepcionPage() {
  const params = useParams();
  const router = useRouter();

  const localId = Number(params?.id);
  const checking = useAuth(["4"]); 

  const [loading, setLoading] = useState(true);

  const [mesas, setMesas] = useState<Mesa[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState<number | null>(null);

  useEffect(() => {

    console.log("useEffect iniciado", { checking, localId });
    const cargarDatos = async () => {
      if (!checking && localId) {

        console.log("Entrando a cargar datos → localId:", localId);
        setLoading(true);

        try {
          console.log("Intentando getMesasByLocal...");
          const mesasData = await getMesasByLocal(localId);
          console.log("Mesas OK:", mesasData?.length);

          console.log("Intentando getClientes...");
          const clientesData = await getClientes(localId, 0, 50);
          console.log("Clientes OK:", clientesData?.length);

          setMesas(mesasData);
          setClientes(clientesData);
        } catch (error) {
          console.error("ERROR GRAVE en carga de datos:", error);
        } finally {
          console.log("Finally → seteando loading false")
          setLoading(false);          
        }
      } else {
        console.log("No se cargan datos porque:", { checking, localId });
      }
    };

    cargarDatos();
  }, [checking, localId]);

  
  if (checking || loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-50">
        <p className="animate-pulse font-medium text-slate-600">
          Cargando Gestión de Recepción...
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 md:space-y-8 bg-slate-50 min-h-screen">
      {/* Cabecera */}
      <header className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-800 flex items-center gap-3">
          <ConciergeBell className="text-blue-500" size={32} />
          Panel de Recepción
        </h1>
        <p className="text-slate-500 text-sm md:text-base">
          Sucursal ID: {localId}
        </p>
      </header>

      {/* Tarjetas de acciones rápidas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border hover:shadow-md transition-shadow">
          <h3 className="text-slate-400 text-xs md:text-sm font-bold uppercase">
            Mesas Totales
          </h3>
          <p className="text-3xl md:text-4xl font-black text-slate-800 mt-2">
            {mesas.length}
          </p>
        </div>

        <div
          onClick={() => router.push(`/recepcion/${localId}/clientes`)}
          className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border cursor-pointer hover:shadow-md transition-all hover:scale-[1.02]"
        >
          <h3 className="text-slate-700 text-sm md:text-base font-bold flex items-center gap-2">
            <UserPlus size={20} />
            Registrar Cliente
          </h3>
        </div>

        <div
          onClick={() => router.push(`/recepcion/${localId}/clientes/list`)}
          className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border cursor-pointer hover:shadow-md transition-all hover:scale-[1.02]"
        >
          <h3 className="text-slate-700 text-sm md:text-base font-bold flex items-center gap-2">
            <Users size={20} />
            Listado Clientes
          </h3>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Seleccionar Cliente */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <h3 className="font-bold text-lg md:text-xl mb-4 text-slate-800">
            Seleccionar Cliente
          </h3>

          <select
            value={clienteSeleccionado ?? ""}
            onChange={(e) => setClienteSeleccionado(e.target.value ? Number(e.target.value) : null)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
          >
            <option value="">Seleccione un cliente</option>
            {clientes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre} — {c.ruc_cc}
              </option>
            ))}
          </select>
        </div>

        {/* Formulario de Reserva */}
        <ReservaForm
          idlocal={localId}
          idcliente={clienteSeleccionado}
        />
      </div>
    </div>
  );
}