'use client';

import { useParams } from 'next/navigation';
import { Calendar, Clock, Users, DollarSign, CheckCircle, XCircle, Store, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function DetalleReservaPage() {
  const { id } = useParams();

  // Datos simulados para la reserva con ese ID
  const reserva = {
    id: Number(id),
    restaurante: 'La Parrilla Dorada',
    sucursal: 'Samborondón',
    fecha: '2026-02-05',
    hora: '20:00',
    personas: 4,
    mesa: 'Mesa 12 (4 personas)',
    estado: 'Confirmada',
    anticipo: true,
    montoAnticipo: 20,
    notas: 'Cumpleaños sorpresa - mesa cerca de la ventana',
  };

  const cancelarReserva = () => {
    if (confirm('¿Estás seguro de cancelar esta reserva?')) {
      alert('Reserva cancelada (simulada)');
      // Llamada real al backend aquí
    }
  };

  const checkIn = () => {
    alert('Check-in registrado (simulado)');
    // Llamada al backend
  };

  const marcarNoShow = () => {
    if (confirm('¿Marcar como no-show? Esta acción no se puede deshacer.')) {
      alert('Marcado como no-show (simulado)');
      // Llamada al backend
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Botón volver */}
      <div className="mb-6">
        <Link href="/cliente/reservas/misReservas" className="flex items-center text-gray-600 hover:text-[#F2B847]">
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
                <p className="font-semibold">{reserva.restaurante} ({reserva.sucursal})</p>
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
                <p className="font-semibold">{reserva.personas}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6" /> {/* Espacio para alinear */}
              <div>
                <p className="text-sm text-gray-600">Mesa</p>
                <p className="font-semibold">{reserva.mesa}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <DollarSign size={24} className="text-[#F2B847] mt-1" />
              <div>
                <p className="text-sm text-gray-600">Anticipo</p>
                <p className="font-semibold">{reserva.anticipo ? `Sí ($${reserva.montoAnticipo})` : 'No'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Notas */}
        {reserva.notas && (
          <div className="bg-gray-50 p-4 rounded-xl">
            <p className="text-sm font-medium text-gray-700">Notas:</p>
            <p className="mt-1">{reserva.notas}</p>
          </div>
        )}

        {/* Estado */}
        <div className="flex justify-center">
          <span className={`px-6 py-2 rounded-full text-lg font-semibold ${
            reserva.estado === 'Confirmada' ? 'bg-green-100 text-green-800' :
            reserva.estado === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' :
            reserva.estado === 'Cancelada' ? 'bg-red-100 text-red-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            Estado: {reserva.estado}
          </span>
        </div>

        {/* Acciones según estado */}
        <div className="pt-6 border-t">
          {reserva.estado === 'Confirmada' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => alert('Check-in registrado (simulado)')}
                className="flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition"
              >
                <CheckCircle size={20} />
                Check-in (Llegué)
              </button>

              <button
                onClick={() => confirm('¿Cancelar reserva?') && alert('Cancelada (simulada)')}
                className="flex items-center justify-center gap-2 bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition"
              >
                <XCircle size={20} />
                Cancelar Reserva
              </button>
            </div>
          )}

          {reserva.estado === 'Pendiente' && (
            <button
              onClick={() => confirm('¿Cancelar reserva?') && alert('Cancelada (simulada)')}
              className="w-full flex items-center justify-center gap-2 bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition"
            >
              <XCircle size={20} />
              Cancelar Reserva
            </button>
          )}
        </div>
      </div>
    </div>
  );
}