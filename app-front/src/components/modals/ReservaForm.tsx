"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { getMesasByLocal } from "@/services/mesa.service";
import { getFranjasByLocal } from "@/services/sucursal.service";
import api from "@/lib/api";
import { Franja } from "@/interface/admin.interface";

interface Props {
  idlocal: number;
  idcliente: number | null;
}

export default function ReservaForm({ idlocal, idcliente }: Props) {
  const [mesas, setMesas] = useState<any[]>([]);
  const [franjas, setFranjas] = useState<Franja[]>([]);
  const [cargandoMesas, setCargandoMesas] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [franjaId, setFranjaId] = useState("");
  const [formData, setFormData] = useState({
    fecha: "",
    personas: 2,
    idmesa: "",
  });

  // ======================
  // CARGAR MESAS
  // ======================
  useEffect(() => {
    if (!idlocal) return;

    setCargandoMesas(true);
    getMesasByLocal(idlocal)
      .then(setMesas)
      .catch(() => setMesas([]))
      .finally(() => setCargandoMesas(false));
  }, [idlocal]);

  // ======================
  // CARGAR FRANJAS
  // ======================
  useEffect(() => {
    if (!idlocal) return;

    getFranjasByLocal(String(idlocal))
      .then(setFranjas)
      .catch(() => setFranjas([]));
  }, [idlocal]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ======================
  // CREAR RESERVA
  // ======================
  const crearReserva = async () => {
    if (!idcliente) {
      setError("Debe seleccionar un cliente");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        idlocal,
        idmesa: formData.idmesa ? Number(formData.idmesa) : null,
        idcliente,
        fecha: formData.fecha,
        franja_id: Number(franjaId),
        numper: Number(formData.personas),
      };

      console.log("📤 Payload reserva:", payload);

      await api.post("/reservas", payload);

      alert("✅ Reserva creada correctamente");

      setFormData({
        fecha: "",
        personas: 2,
        idmesa: "",
      });
      setFranjaId("");
    } catch (err) {
      console.error(err);
      setError("Error al crear la reserva");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
      <h3 className="font-bold text-slate-700 text-lg">Crear Reserva</h3>

      {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded-xl text-sm">
          {error}
        </div>
      )}

      <div className="space-y-3">
        {/* FECHA */}
        <div>
          <label className="text-sm text-slate-600">Fecha</label>
          <input
            type="date"
            name="fecha"
            value={formData.fecha}
            min={new Date().toISOString().split("T")[0]}
            onChange={handleChange}
            className="w-full border p-2 rounded-xl"
          />
        </div>

        {/* FRANJA */}
        <div>
          <label className="text-sm text-slate-600">Franja horaria</label>
          <select
            value={franjaId}
            onChange={(e) => setFranjaId(e.target.value)}
            className="w-full border p-2 rounded-xl"
          >
            <option value="">Seleccione una franja</option>
            {franjas.map((f) => (
              <option key={f.id} value={f.id}>
                {f.horini} - {f.horfin}
              </option>
            ))}
          </select>
        </div>

        {/* PERSONAS */}
        <div>
          <label className="text-sm text-slate-600">Personas</label>
          <input
            type="number"
            min={1}
            name="personas"
            value={formData.personas}
            onChange={handleChange}
            className="w-full border p-2 rounded-xl"
          />
        </div>

        {/* MESA */}
        <div>
          <label className="text-sm text-slate-600">Mesa</label>
          {cargandoMesas ? (
            <p className="text-sm text-slate-400">Cargando mesas...</p>
          ) : (
            <select
              name="idmesa"
              value={formData.idmesa}
              onChange={handleChange}
              className="w-full border p-2 rounded-xl"
            >
              <option value="">Asignación automática</option>
              {mesas.map((m) => (
                <option key={m.id} value={m.id}>
                  Mesa {m.numero} ({m.maxper})
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      <button
        onClick={crearReserva}
        disabled={loading || !formData.fecha || !franjaId || !idcliente}
        className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
      >
        <Check size={18} />
        {loading ? "Creando..." : "Crear Reserva"}
      </button>
    </div>
  );
}
