"use client";

import { useEffect, useState } from "react";
import { Check, ClipboardList, BarChart3 } from "lucide-react";
import { useRouter } from "next/navigation";
import { getMesasByLocal } from "@/services/mesa.service";
import { getFranjasByLocal } from "@/services/sucursal.service";
import { 
  crearReserva as crearReservaService, 
  buscarUltimaReservaCreada 
} from "@/services/reserva.service";
import { registrarAnticipo } from "@/services/anticipo.service";

interface Props {
  idlocal: number;
  idcliente: number | null;
}

export default function ReservaForm({ idlocal, idcliente }: Props) {
  const router = useRouter();
  const [mesas, setMesas] = useState<any[]>([]);
  const [franjas, setFranjas] = useState<any[]>([]);
  const [cargandoMesas, setCargandoMesas] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [franjaId, setFranjaId] = useState<string>("");
  const [formData, setFormData] = useState({
    fecha: "",
    personas: 2,
    idmesa: "",
  });

  // Cargar mesas
  useEffect(() => {
    if (!idlocal) return;
    setCargandoMesas(true);
    getMesasByLocal(idlocal)
      .then((data) => {
        console.log("Mesas recibidas:", data);
        setMesas(data || []);
      })
      .catch(() => setMesas([]))
      .finally(() => setCargandoMesas(false));
  }, [idlocal]);

  // Cargar franjas
  useEffect(() => {
    if (!idlocal) return;
    console.log("Cargando franjas para local:", idlocal);
    getFranjasByLocal(idlocal)
      .then((data) => {
        console.log("Franjas recibidas:", data);
        setFranjas(data || []);
        if (data.length === 0) {
          setError("No hay franjas horarias configuradas para esta sucursal");
        } else {
          setError(null);
        }
      })
      .catch((err) => {
        console.error("Error franjas:", err);
        setFranjas([]);
        setError("Error al cargar franjas");
      });
  }, [idlocal]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCrearReserva = async () => {
    if (!idcliente) {
      setError("Selecciona un cliente primero");
      return;
    }
    if (!formData.fecha) {
      setError("Selecciona una fecha");
      return;
    }
    if (!franjaId) {
      setError("Selecciona una franja horaria");
      return;
    }

    const franjaSeleccionada = franjas.find((f) => f.id === Number(franjaId));
    if (!franjaSeleccionada) {
      setError("La franja seleccionada no es válida");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        idlocal: Number(idlocal),
        idmesa: formData.idmesa ? Number(formData.idmesa) : null,
        idcliente: Number(idcliente),
        fecha: formData.fecha,
        franja_id: Number(franjaId),
        numper: Number(formData.personas),
      };

      await crearReservaService(payload);
      alert("¡Reserva creada correctamente!");

      let reservaId: number | null = null;
      try {
        const reservaCreada = await buscarUltimaReservaCreada(
          payload.idlocal,
          payload.idcliente,
          payload.fecha,
          payload.franja_id,
          payload.numper
        );
        if (reservaCreada?.id) reservaId = reservaCreada.id;
      } catch (searchError) {
        console.error("Error al buscar reserva:", searchError);
      }

      if (reservaId) {
        const quiereAnticipo = confirm("¿Desea registrar un anticipo?");
        if (quiereAnticipo) {
          const montoStr = prompt("Monto del anticipo ($):");
          if (montoStr && !isNaN(Number(montoStr)) && Number(montoStr) > 0) {
            await registrarAnticipo({ idreserva: reservaId, monto: Number(montoStr) });
            alert("Anticipo registrado");
          }
        }
      }

      setFormData({ fecha: "", personas: 2, idmesa: "" });
      setFranjaId("");
    } catch (err: any) {
      setError(err.message || "Error al crear la reserva");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* FORMULARIO */}
      <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-5">
        <h3 className="font-bold text-slate-700 text-xl">Nueva Reserva</h3>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm font-medium">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="text-sm text-slate-600 font-medium block mb-1">Fecha</label>
            <input
              type="date"
              name="fecha"
              value={formData.fecha}
              min={new Date().toISOString().split("T")[0]}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none"
            />
          </div>

          <div>
            <label className="text-sm text-slate-600 font-medium block mb-1">Franja horaria</label>
            <select
              value={franjaId}
              onChange={(e) => setFranjaId(e.target.value)}
              disabled={franjas.length === 0}
              className={`w-full border rounded-xl p-3 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none ${
                franjas.length === 0 ? "bg-slate-100 cursor-not-allowed" : "border-slate-300"
              }`}
            >
              <option value="">Seleccione una franja</option>
              {franjas.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.hora_inicio} - {f.hora_fin}  {/* ¡Esto es lo correcto! */}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-slate-600 font-medium block mb-1">N° Personas</label>
            <input
              type="number"
              min={1}
              name="personas"
              value={formData.personas}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none"
            />
          </div>

          <div>
            <label className="text-sm text-slate-600 font-medium block mb-1">Mesa (Opcional)</label>
            <select
              name="idmesa"
              value={formData.idmesa}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none"
            >
              <option value="">Asignación automática</option>
              {mesas.map((m) => (
                <option key={m.id} value={m.id}>
                  Mesa {m.numero} (Cap: {m.maxper})
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleCrearReserva}
          disabled={loading || !formData.fecha || !franjaId || !idcliente}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 transition-all shadow-lg shadow-blue-100"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Check size={20} />
          )}
          {loading ? "Procesando..." : "Confirmar Reserva"}
        </button>
      </div>

      {/* BOTONES LATERALES */}
      <div className="flex flex-col gap-4">
        <div
          onClick={() => router.push("/recepcion/reservas/list")}
          className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 cursor-pointer hover:border-blue-400 hover:shadow-md transition-all group"
        >
          <div className="bg-blue-50 w-10 h-10 rounded-lg flex items-center justify-center mb-3 group-hover:bg-blue-600 transition-colors">
            <ClipboardList size={20} className="text-blue-600 group-hover:text-white" />
          </div>
          <h3 className="text-slate-700 text-sm font-bold">Listado Reservas</h3>
          <p className="text-slate-400 text-xs mt-1">Gestionar ingresos y estados</p>
        </div>

        <div
          onClick={() => router.push("/recepcion/reportes")}
          className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 cursor-pointer hover:border-indigo-400 hover:shadow-md transition-all group"
        >
          <div className="bg-indigo-50 w-10 h-10 rounded-lg flex items-center justify-center mb-3 group-hover:bg-indigo-600 transition-colors">
            <BarChart3 size={20} className="text-indigo-600 group-hover:text-white" />
          </div>
          <h3 className="text-slate-700 text-sm font-bold">Reportes</h3>
          <p className="text-slate-400 text-xs mt-1">Análisis de ocupación</p>
        </div>
      </div>
    </div>
  );
}