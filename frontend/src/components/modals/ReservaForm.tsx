"use client";

import { useEffect, useState } from "react";
import { Check, ClipboardList } from "lucide-react";
import { useRouter } from "next/navigation";
import { getMesasByLocal } from "@/services/mesa.service";
import { getFranjasByLocal } from "@/services/sucursal.service";
import { 
  crearReserva as crearReservaService, 
  buscarUltimaReservaCreada 
} from "@/services/reserva.service";
import { registrarAnticipo } from "@/services/anticipo.service";

// Modales
import ConfirmarReservaModal from "@/components/modals/ConfirmarReservaModal";
import RegistrarAnticipoModal from "@/components/modals/RegistrarAnticipoModal";

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
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // ← nuevo estado para mensajes de éxito

  const [franjaId, setFranjaId] = useState<string>("");
  const [formData, setFormData] = useState({
    fecha: "",
    personas: 2,
    idmesa: "",
  });

  // Estados para modales
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showAnticipoModal, setShowAnticipoModal] = useState(false);
  const [reservaIdCreada, setReservaIdCreada] = useState<number | null>(null);

  const MONTO_ANTICIPO_FIJO = 10;

  // Cargar mesas
  useEffect(() => {
    if (!idlocal) return;
    setCargandoMesas(true);
    getMesasByLocal(idlocal)
      .then((data) => setMesas(data || []))
      .catch(() => setMesas([]))
      .finally(() => setCargandoMesas(false));
  }, [idlocal]);

  // Cargar franjas
  useEffect(() => {
    if (!idlocal) return;
    getFranjasByLocal(idlocal)
      .then((data) => {
        setFranjas(data || []);
        if (data.length === 0) {
          setError("No hay franjas horarias configuradas para esta sucursal");
        } else {
          setError(null);
        }
      })
      .catch(() => {
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

  const handleAbrirConfirmacion = () => {
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

    setError(null);
    setShowConfirmModal(true);
  };

  const confirmarReserva = async () => {
    setShowConfirmModal(false);
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

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

      const reservaCreada = await buscarUltimaReservaCreada(
        payload.idlocal,
        payload.idcliente,
        payload.fecha,
        payload.franja_id,
        payload.numper
      );

      const reservaId = reservaCreada?.id;
      if (reservaId) {
        setReservaIdCreada(reservaId);
        setShowAnticipoModal(true);
      }
      
      setSuccessMessage("¡Reserva creada correctamente!");

      // Limpiar formulario
      setFormData({ fecha: "", personas: 2, idmesa: "" });
      setFranjaId("");
    } catch (err: any) {
      setError(err.message || "Error al crear la reserva");
    } finally {
      setLoading(false);
    }
  };

  const confirmarAnticipo = async () => {
    if (!reservaIdCreada) return;

    setLoading(true);
    setSuccessMessage(null);

    try {
      await registrarAnticipo({
        idreserva: reservaIdCreada,
        monto: MONTO_ANTICIPO_FIJO,
      });

      setSuccessMessage(`Anticipo de $${MONTO_ANTICIPO_FIJO} registrado correctamente`);
    } catch (err: any) {
      setError("Error al registrar anticipo: " + (err.message || "Error desconocido"));
    } finally {
      setShowAnticipoModal(false);
      setReservaIdCreada(null);
      setLoading(false);
    }
  };

  const franjaSeleccionada = franjas.find(f => f.id === Number(franjaId));
  const franjaTexto = franjaSeleccionada 
    ? `${franjaSeleccionada.hora_inicio} - ${franjaSeleccionada.hora_fin}`
    : "";

  const mesaSeleccionada = mesas.find(m => m.id === Number(formData.idmesa));
  const mesaTexto = formData.idmesa && mesaSeleccionada 
    ? `Mesa ${mesaSeleccionada.numero} (Cap: ${mesaSeleccionada.maxper})`
    : "Asignación automática";

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* FORMULARIO */}
        <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-5">
          <h3 className="font-bold text-slate-700 text-xl">Nueva Reserva</h3>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl text-sm font-medium flex items-center justify-between">
              <span>{successMessage}</span>
              <button
                onClick={() => setSuccessMessage(null)}
                className="text-green-700 hover:text-green-900 font-bold"
              >
                ×
              </button>
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
                disabled={franjas.length === 0 || loading}
                className={`w-full border rounded-xl p-3 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none ${
                  franjas.length === 0 || loading ? "bg-slate-100 cursor-not-allowed" : "border-slate-300"
                }`}
              >
                <option value="">Seleccione una franja horaria</option>
                {franjas.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.hora_inicio} - {f.hora_fin}
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
            onClick={handleAbrirConfirmacion}
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

        {/* BOTÓN LATERAL */}
        <div className="flex flex-col gap-6">
          <div className="flex-1" />
          <div
            onClick={() => router.push(`/recepcion/${idlocal}/reservas/list`)}
            className="bg-white p-6 rounded-2xl shadow-md border border-slate-200 cursor-pointer hover:border-blue-500 hover:shadow-lg transition-all group flex flex-col items-center text-center"
          >
            <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
              <ClipboardList size={28} className="text-blue-600 group-hover:text-white" />
            </div>
            <h3 className="text-slate-800 text-base font-bold mb-2">Listado de Reservas</h3>
            <p className="text-slate-500 text-sm">Ver, editar y gestionar todas las reservas</p>
          </div>
          <div className="flex-1" />
        </div>
      </div>

      {/* MODALES */}
      <ConfirmarReservaModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={confirmarReserva}
        fecha={formData.fecha}
        franja={franjaTexto}
        personas={formData.personas}
        mesa={mesaTexto}
        loading={loading}
      />

      <RegistrarAnticipoModal
        isOpen={showAnticipoModal}
        onClose={() => {
          setShowAnticipoModal(false);
          setReservaIdCreada(null);
        }}
        onConfirm={confirmarAnticipo}
        loading={loading}
      />
    </>
  );
}