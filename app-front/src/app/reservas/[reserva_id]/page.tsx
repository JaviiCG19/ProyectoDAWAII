'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function DetalleReservaPage() {
  const { reserva_id } = useParams();
  const router = useRouter();
  const [reserva, setReserva] = useState<any>(null);
  const [anticipo, setAnticipo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const estadoTexto = (e: number) =>
    e === 0 ? 'Pendiente' :
    e === 1 ? 'Confirmada' :
    e === 2 ? 'Cancelada' :
    e === 3 ? 'Check-in' :
    e === 4 ? 'No-show' : 'Desconocido';

  const estadoColor = (e: number) =>
    e === 0 ? 'bg-yellow-100 text-yellow-800' :
    e === 1 ? 'bg-green-100 text-green-800' :
    e === 2 ? 'bg-red-100 text-red-800' :
    e === 3 ? 'bg-blue-100 text-blue-800' :
    e === 4 ? 'bg-gray-100 text-gray-800' :
    'bg-gray-100 text-gray-800';

  // Calcula si ya pasó el tiempo de tolerancia SOLO cuando reserva esté cargada
  const yaPasoTolerancia = reserva && reserva.estado === 1 && (() => {
    // Si no tienes 'hora' en la respuesta del backend, usa un fallback
    const hora = reserva.hora || '00:00'; 
    const fechaHoraStr = `${reserva.fecha}T${hora}:00`;
    const horaReserva = new Date(fechaHoraStr);
    
    if (isNaN(horaReserva.getTime())) {
      console.warn('Fecha/hora inválida en reserva:', reserva);
      return false; 
    }

    const horaLimite = new Date(horaReserva);
    horaLimite.setMinutes(horaLimite.getMinutes() + 15);

    return horaLimite < new Date();
  })();

  useEffect(() => {
    const cargar = async () => {
      try {
        const r = await api.get(`/reservas/${reserva_id}`);
        const reservaData = r.data?.data || r.data || {};
        setReserva(reservaData);

        try {
          const a = await api.get(`/anticipos/reserva/${reserva_id}`);
          setAnticipo(a.data?.data || null);
        } catch {
          setAnticipo(null);
        }
      } catch (err) {
        console.error('Error al cargar reserva:', err);
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, [reserva_id]);

  const registrarAnticipo = async () => {
    try {
      await api.post('/anticipos', {
        idreserva: Number(reserva_id),
        monto: 20,
      });
      alert('Anticipo registrado ($20)');
      const a = await api.get(`/anticipos/reserva/${reserva_id}`);
      setAnticipo(a.data?.data || null);
    } catch (err: any) {
      alert('Error al registrar anticipo: ' + (err.response?.data?.message || 'Intenta de nuevo'));
    }
  };

  const confirmar = async () => {
    if (!anticipo) {
      alert('Debes registrar un anticipo primero');
      return;
    }
    try {
      await api.put(`/reservas/${reserva_id}/confirmar`);
      alert('Reserva confirmada');
      location.reload();
    } catch (err: any) {
      alert('Error al confirmar: ' + (err.response?.data?.message || 'Intenta de nuevo'));
    }
  };

  const checkin = async () => {
    try {
      await api.put(`/reservas/${reserva_id}/checkin`);
      alert('Check-in realizado');
      location.reload();
    } catch (err) {
      alert('Error al hacer check-in');
    }
  };

  const noshow = async () => {
    try {
      await api.put(`/reservas/${reserva_id}/noshow`);
      alert('No-show marcado');
      location.reload();
    } catch (err) {
      alert('Error al marcar no-show');
    }
  };

  if (loading) return <div className="text-center py-20">Cargando…</div>;
  if (!reserva) return <div>Error al cargar la reserva</div>;

  return (
    <div className="flex justify-center items-center min-h-[80vh] px-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-6">
        <h1 className="text-2xl font-extrabold text-center text-[#F2B847]">
          Reserva #{reserva.id}
        </h1>

        <div className="space-y-2 text-gray-700">
          <p><strong>Fecha:</strong> {reserva.fecha || 'Sin fecha'}</p>
          <p><strong>Personas:</strong> {reserva.numper || '?'}</p>
          <p>
            <strong>Estado:</strong>{' '}
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${estadoColor(reserva.estado)}`}>
              {estadoTexto(reserva.estado)}
            </span>
          </p>
          <p>
            <strong>Anticipo:</strong>{' '}
            {anticipo ? `Sí ($${anticipo.monto})` : 'No'}
          </p>
        </div>


        {/* Alerta de no-show automático si ya pasó el tiempo */}
        {reserva.estado === 1 && yaPasoTolerancia && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mt-4 rounded-r-xl">
            <p className="text-red-700 font-semibold">
               La hora de la reserva ya pasó (+15 min de tolerancia)
            </p>
            <p className="text-red-600 mt-2">
              El cliente no hizo check-in. ¿Marcar como No-show automáticamente?
            </p>
            <button
              onClick={noshow}
              className="mt-3 bg-red-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-red-700 transition"
            >
              Marcar No-show ahora
            </button>
          </div>
        )}

        {/* Botón para registrar anticipo si no existe */}
        {!anticipo && reserva.estado === 0 && (
          <button
            onClick={registrarAnticipo}
            className="w-full bg-yellow-600 text-white py-3 rounded-xl font-semibold hover:bg-yellow-700 mt-4"
          >
            Registrar Anticipo ($20)
          </button>
        )}

        {/* Botones según estado */}
        <div className="space-y-3 pt-4">
          {reserva.estado === 0 && anticipo && (
            <button
              onClick={confirmar}
              className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700"
            >
              Confirmar Reserva
            </button>
          )}

          {reserva.estado === 1 && (
            <>
              <button
                onClick={checkin}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700"
              >
                Check-in
              </button>

              <button
                onClick={noshow}
                className="w-full bg-gray-600 text-white py-3 rounded-xl font-semibold hover:bg-gray-700"
              >
                Marcar No-show
              </button>
            </>
          )}

          <button
            onClick={() => router.push('/reservas/list')}
            className="w-full border border-gray-300 py-3 rounded-xl font-semibold hover:bg-gray-100"
          >
            Volver al listado
          </button>
        </div>
      </div>
    </div>
  );
}