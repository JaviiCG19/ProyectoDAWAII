'use client';

import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { getSucursalesByEmpresa } from '@/services/local.service';
import { getMesasByLocal } from '@/services/mesa.service';
import api from '@/lib/api';

export default function CrearReservaPage() {
  const router = useRouter();

  // ⚠️ luego esto vendrá del login
  const ID_EMPRESA = 1;
  const ID_CLIENTE = 12;

  const [paso, setPaso] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ============================
  // DATA REAL
  // ============================
  const [sucursales, setSucursales] = useState<any[]>([]);
  const [mesas, setMesas] = useState<any[]>([]);
  const [cargandoMesas, setCargandoMesas] = useState(false);

  const [formData, setFormData] = useState({
    idlocal: '',
    fecha: '',
    hora: '',
    personas: 2,
    idmesa: ''
  });

  // ============================
  // CARGAR SUCURSALES
  // ============================
  useEffect(() => {
    getSucursalesByEmpresa(ID_EMPRESA)
      .then(setSucursales)
      .catch(() => setError('Error cargando sucursales'));
  }, []);

  // ============================
  // CARGAR MESAS POR LOCAL
  // ============================
  useEffect(() => {
    if (!formData.idlocal) return;

    setCargandoMesas(true);
    getMesasByLocal(formData.idlocal)
      .then(setMesas)
      .catch(() => setMesas([]))
      .finally(() => setCargandoMesas(false));
  }, [formData.idlocal]);

  // ============================
  // HANDLERS
  // ============================
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const siguiente = () => setPaso(paso + 1);
  const anterior = () => setPaso(paso - 1);

  // ============================
  // CREAR RESERVA
  // ============================
  const confirmarReserva = async () => {
    setLoading(true);
    setError(null);

    try {
      const payload = {
        idlocal: Number(formData.idlocal),
        idmesa: formData.idmesa ? Number(formData.idmesa) : null,
        idcliente: ID_CLIENTE,
        fecha: formData.fecha,
        franja_id: 1, // luego dinámico
        numper: Number(formData.personas)
      };

      console.log('📤 Payload reserva:', payload);

      const res = await api.post('/reservas', payload);

      const reservaId = res.data?.data;

      if (!reservaId) {
        throw new Error('No se recibió ID de reserva');
      }

      alert('✅ Reserva creada correctamente');
      router.push(`/reservas/${reservaId}`);

    } catch (err: any) {
      console.error(err);
      setError('Error al crear la reserva');
    } finally {
      setLoading(false);
    }
  };

  // ============================
  // UI
  // ============================
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center text-[#F2B847]">
        Nueva Reserva
      </h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-xl">
          {error}
        </div>
      )}

      {/* PASO 1 - SUCURSAL */}
      {paso === 1 && (
        <div className="bg-white p-6 rounded-2xl shadow space-y-4">
          <h2 className="font-bold text-lg">1. Selecciona la sucursal</h2>

          <select
            name="idlocal"
            value={formData.idlocal}
            onChange={handleChange}
            className="w-full border p-3 rounded-xl"
          >
            <option value="">Seleccione una sucursal</option>
            {sucursales.map((s) => (
              <option key={s.id} value={s.id}>
                {s.detalle}
              </option>
            ))}
          </select>

          <div className="flex justify-end">
            <button
              disabled={!formData.idlocal}
              onClick={siguiente}
              className="bg-[#F2B847] text-white px-6 py-2 rounded-xl disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}

      {/* PASO 2 - FECHA */}
      {paso === 2 && (
        <div className="bg-white p-6 rounded-2xl shadow space-y-4">
          <h2 className="font-bold text-lg">2. Fecha</h2>

          <input
            type="date"
            name="fecha"
            value={formData.fecha}
            min={new Date().toISOString().split('T')[0]}
            onChange={handleChange}
            className="w-full border p-3 rounded-xl"
          />

          <div className="flex justify-between">
            <button onClick={anterior}>Anterior</button>
            <button
              disabled={!formData.fecha}
              onClick={siguiente}
              className="bg-[#F2B847] text-white px-6 py-2 rounded-xl"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}

      {/* PASO 3 - PERSONAS Y MESA */}
      {paso === 3 && (
        <div className="bg-white p-6 rounded-2xl shadow space-y-4">
          <h2 className="font-bold text-lg">3. Personas y mesa</h2>

          <input
            type="number"
            name="personas"
            min={1}
            value={formData.personas}
            onChange={handleChange}
            className="w-full border p-3 rounded-xl"
          />

          {cargandoMesas ? (
            <p>Cargando mesas...</p>
          ) : (
            <select
              name="idmesa"
              value={formData.idmesa}
              onChange={handleChange}
              className="w-full border p-3 rounded-xl"
            >
              <option value="">Mesa automática</option>
              {mesas.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.numero} ({m.maxper} personas)
                </option>
              ))}
            </select>
          )}

          <div className="flex justify-between">
            <button onClick={anterior}>Anterior</button>
            <button onClick={siguiente} className="bg-[#F2B847] text-white px-6 py-2 rounded-xl">
              Siguiente
            </button>
          </div>
        </div>
      )}

      {/* PASO 4 - CONFIRMAR */}
      {paso === 4 && (
        <div className="bg-white p-6 rounded-2xl shadow space-y-4">
          <h2 className="font-bold text-lg">4. Confirmar</h2>

          <button
            onClick={confirmarReserva}
            disabled={loading}
            className="w-full bg-[#F2B847] text-white py-3 rounded-xl font-bold"
          >
            <Check className="inline mr-2" />
            {loading ? 'Creando...' : 'Confirmar Reserva'}
          </button>
        </div>
      )}
    </div>
  );
}
