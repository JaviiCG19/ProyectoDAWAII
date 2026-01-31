'use client';

import { useState, useEffect } from 'react';
import { User, Phone, Save } from 'lucide-react';
import api from '@/lib/api';
import { useRouter, useParams } from 'next/navigation';

export default function EditarClientePage() {
  const router = useRouter();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id || isNaN(Number(id))) {
      setError('ID de cliente inválido');
      setLoading(false);
      return;
    }

    const cargarCliente = async () => {
      try {
        const response = await api.get(`/clientes/${id}`);
        const cliente = response.data;
        setFormData({
          nombre: cliente.nombre || '',
          telefono: cliente.telefono || '',
        });
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Cliente no encontrado');
      } finally {
        setLoading(false);
      }
    };

    cargarCliente();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await api.put(`/clientes/${id}`, {
        nombre: formData.nombre.trim(),
        telefono: formData.telefono.trim(),
      });

      alert('Cliente actualizado con éxito!');
      router.push('/clientes/list');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'No se pudo actualizar');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-[70vh]">Cargando cliente...</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-[70vh] px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-6 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-extrabold text-[#F2B847]">
            Editar Cliente #{id}
          </h1>
          <p className="text-sm text-gray-600">Actualiza los datos del cliente</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Nombre completo</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F2B847]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Teléfono</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F2B847]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-[#F2B847] text-white py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition"
          >
            <Save size={18} />
            Guardar Cambios
          </button>
        </form>
      </div>
    </div>
  );
}