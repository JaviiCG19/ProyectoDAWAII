'use client';

import { useState } from 'react';
import { User, Phone, UserPlus } from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function RegistroPage() {
  const router = useRouter();

  // Estados para controlar el formulario
  const [formData, setFormData] = useState({
    nombre: '',
    ruc_cc: '',
    telefono: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Validación básica antes de enviar
    if (!formData.nombre.trim()) {
      setError('El nombre es obligatorio');
      setLoading(false);
      return;
    }
    if (!formData.ruc_cc.trim()) {
      setError('RUC/Cédula es obligatorio');
      setLoading(false);
      return;
    }
    if (!formData.telefono.match(/^\d{9,10}$/)) {
      setError('Teléfono debe tener 9 o 10 dígitos');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/clientes', {
        nombre: formData.nombre.trim(),
        ruc_cc: formData.ruc_cc.trim(),
        telefono: formData.telefono.trim(),
      });

      alert('Cliente registrado con éxito! ID: ' + response.data.id);
      router.push('/login'); // o a donde quieras redirigir después de registro
    } catch (err: any) {
      const mensajeError = err.response?.data?.detail || 'No se pudo registrar el cliente';
      setError(mensajeError);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[70vh] px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-extrabold text-[#F2B847]">
            Registro de Cliente
          </h1>
          <p className="text-sm text-gray-600">
            Crea tu cuenta para reservar mesas en nuestros restaurantes
          </p>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Nombre completo</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Juan Pérez"
                className="w-full pl-10 pr-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F2B847]"
                required
              />
            </div>
          </div>

          {/* RUC / Cédula */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">RUC / Cédula</label>
            <div className="relative">
              <input
                type="text"
                name="ruc_cc"
                value={formData.ruc_cc}
                onChange={handleChange}
                placeholder="1723456789"
                className="w-full pl-10 pr-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F2B847]"
                required
              />
            </div>
          </div>

          {/* Teléfono */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Teléfono</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                placeholder="0991234567"
                pattern="[0-9]{9,10}"
                inputMode="numeric"
                className="w-full pl-10 pr-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F2B847]"
                required
                maxLength={10}
              />
            </div>
          </div>

          {/* Botón */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 bg-[#F2B847] text-white py-2.5 rounded-xl text-sm font-semibold transition ${
              loading ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90'
            }`}
          >
            <UserPlus size={18} />
            {loading ? 'Registrando...' : 'Registrarme'}
          </button>
        </form>
      </div>
    </div>
  );
}