'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Calendar, Clock, Users, DollarSign, CheckCircle, AlertCircle, XCircle, Store, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';

export default function DetalleReservaPage() {
  const { id } = useParams();
  const router = useRouter();

  const [reserva, setReserva] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar detalle real de la reserva
  useEffect(() => {
    if (!id) return;

    const cargarReserva = async () => {
      try {
        const response = await api.get(`/reservas/${id}`);
        setReserva(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'No se pudo cargar la reserva');
        console.error('Error al cargar detalle:', err);
      } finally {
        setLoading(false);
      }
    };

    cargarReserva();
  }, [id]);

  // Acciones reales (PUT a los endpoints correspondientes)
  const confirmarReserva = async () => {
    if (!confirm('¿Confirmar esta reserva? (requiere anticipo si aplica)')) return;

    try {
      await api.put(`/reservas/${id}/confirmar`);
      alert('Reserva confirmada con éxito');
      // Recargar datos
      const response = await api.get(`/reservas/${id}`);
      setReserva(response.data);
    } catch (err: any) {
      alert('Error al confirmar: ' + (err.response?.data?.message || 'Intenta de nuevo'));
    }
  };

  const cancelarReserva = async () => {
    if (!confirm('¿Estás seguro de cancelar esta reserva?')) return;

    try {
      await api.put(`/reservas/${id}/cancelar`);
      alert('Reserva cancelada con éxito');
      // Recargar
      const response = await api.get(`/reservas/${id}`);
      setReserva(response.data);
    } catch (err: any) {
      alert('Error al cancelar: ' + (err.response?.data?.message || 'Intenta de nuevo'));
    }
  };

  const checkIn = async () => {
    if (!confirm('¿Realizar check-in?')) return;

    try {
      await api.put(`/reservas/${id}/checkin`);
      alert('Check-in registrado con éxito');
      const response = await api.get(`/reservas/${id}`);
      setReserva(response.data);
    } catch (err: any) {
      alert('Error al hacer check-in: ' + (err.response?.data?.message || 'Intenta de nuevo'));
    }
  };

  const marcarNoShow = async () => {
    if (!confirm('¿Marcar como no-show? Esta acción no se puede deshacer.')) return;

    try {
      await api.put(`/reservas/${id}/noshow`);
      alert('Reserva marcada como no-show');
      const response = await api.get(`/reservas/${id}`);
      setReserva(response.data);
    } catch (err: any) {
      alert('Error al marcar no-show: ' + (err.response?.data?.message || 'Intenta de nuevo'));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <p className="text-xl text-gray-600">Cargando detalle de la reserva...</p>
      </div>
    );
  }

  if (error || !reserva) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-xl max-w-lg">
          {error || 'Reserva no encontrada'}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Botón volver */}
      <div className="mb-6">
        <Link href="/reservas/list" className="flex items-center text-gray-600 hover:text-[#F2B847]">
          <ArrowLeft size={20} className="mr-2" />
          Volver a Mis Reservas
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
        <h1 className="text-3xl font-extrabold text-[#F2B847]">
          Detalle de Reserva #{reserva.id}
        </h1>

        {/* Resumen */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Store size={24} className="text-[#F2B847] mt-1" />
              <div>
                <p className="text-sm text-gray-600">Restaurante</p>
                <p className="font-semibold">{reserva.restaurante || 'No disponible'} ({reserva.sucursal || ''})</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar size={24} className="text-[#F2B847] mt-1" />
              <div>
                <p className="text-sm text-gray-600">Fecha</p>
                <p className="font-semibold">{reserva.fecha}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock size={24} className="text-[#F2B847] mt-1" />
              <div>
                <p className="text-sm text-gray-600">Hora</p>
                <p className="font-semibold">{reserva.hora}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Users size={24} className="text-[#F2B847] mt-1" />
              <div>
                <p className="text-sm text-gray-600">Personas</p>
                <p className="font-semibold">{reserva.numero || reserva.personas || '?'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6" /> {/* Espacio para alinear */}
              <div>
                <p className="text-sm text-gray-600">Mesa</p>
                <p className="font-semibold">{reserva.mesa || 'Automática'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <DollarSign size={24} className="text-[#F2B847] mt-1" />
              <div>
                <p className="text-sm text-gray-600">Anticipo</p>
                <p className="font-semibold">{reserva.anticipo ? 'Sí' : 'No'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Notas (si existen) */}
        {reserva.notas && (
          <div className="bg-gray-50 p-4 rounded-xl">
            <p className="text-sm font-medium text-gray-700">Notas:</p>
            <p className="mt-1">{reserva.notas}</p>
          </div>
        )}

        {/* Estado actual */}
        <div className="flex justify-center">
          <span className={`px-6 py-2 rounded-full text-lg font-semibold ${
            reserva.estado === 'Confirmada' ? 'bg-green-100 text-green-800' :
            reserva.estado === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' :
            reserva.estado === 'Cancelada' ? 'bg-red-100 text-red-800' :
            reserva.estado === 'No-show' ? 'bg-gray-100 text-gray-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            Estado: {reserva.estado || 'Pendiente'}
          </span>
        </div>

        {/* Acciones según estado */}
        <div className="pt-6 border-t">
          {reserva.estado === 'Pendiente' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={confirmarReserva}
                className="flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition"
              >
                <CheckCircle size={20} />
                Confirmar Reserva
              </button>

              <button
                onClick={cancelarReserva}
                className="flex items-center justify-center gap-2 bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition"
              >
                <XCircle size={20} />
                Cancelar Reserva
              </button>
            </div>
          )}

          {reserva.estado === 'Confirmada' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={checkIn}
                className="flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition"
              >
                <CheckCircle size={20} />
                Check-in (Llegué)
              </button>

              <button
                onClick={cancelarReserva}
                className="flex items-center justify-center gap-2 bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition"
              >
                <XCircle size={20} />
                Cancelar Reserva
              </button>

              <button
                onClick={marcarNoShow}
                className="flex items-center justify-center gap-2 bg-orange-600 text-white py-3 rounded-xl font-semibold hover:bg-orange-700 transition"
              >
                <AlertCircle size={20} />
                Marcar No-show
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}