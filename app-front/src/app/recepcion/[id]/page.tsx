"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ConciergeBell, Users, UserPlus } from "lucide-react";

// Auth
import { useAuth } from "@/services/useAuth";

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
  const [clienteSeleccionado, setClienteSeleccionado] = useState<number | null>(
    null
  );

  useEffect(() => {
    const cargarDatos = async () => {
      if (!checking && localId) {
        setLoading(true);
        try {
          setMesas(await getMesasByLocal(localId));
          setClientes(await getClientes(0, 50));
        } catch (error) {
          console.error("Error cargando datos:", error);
        } finally {
          setLoading(false);
        }
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
    <div className="p-6 space-y-6">
      {/* CABECERA */}
      <header>
        <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
          <ConciergeBell className="text-blue-500" size={28} />
          Panel de Recepción
        </h1>
        <p className="text-slate-500 text-sm">Sucursal ID: {localId}</p>
      </header>

      {/* TARJETAS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <h3 className="text-slate-400 text-sm font-bold uppercase">
            Mesas Totales
          </h3>
          <p className="text-3xl font-black text-slate-800">
            {mesas.length}
          </p>
        </div>

        <div
          onClick={() => router.push("/recepcion/clientes")}
          className="bg-white p-6 rounded-2xl shadow-sm border cursor-pointer hover:shadow-md"
        >
          <h3 className="text-slate-400 text-sm font-bold uppercase flex gap-2">
            <UserPlus size={16} /> Registrar Cliente
          </h3>
        </div>

        <div
          onClick={() => router.push("/recepcion/clientes/list")}
          className="bg-white p-6 rounded-2xl shadow-sm border cursor-pointer hover:shadow-md"
        >
          <h3 className="text-slate-400 text-sm font-bold uppercase flex gap-2">
            <Users size={16} /> Listado Clientes
          </h3>
        </div>
      </div>

      {/* CONTENIDO */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CLIENTE */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <h3 className="font-bold text-lg mb-4">Seleccionar Cliente</h3>

          <select
            value={clienteSeleccionado ?? ""}
            onChange={(e) => setClienteSeleccionado(Number(e.target.value))}
            className="w-full px-4 py-3 border rounded-xl"
          >
            <option value="">Seleccione un cliente</option>
            {clientes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre} — {c.ruc_cc}
              </option>
            ))}
          </select>
        </div>

        {/* RESERVA */}
        <ReservaForm 
           idlocal={localId} 
           idcliente={clienteSeleccionado} />
      </div>
    </div>
  );
}
