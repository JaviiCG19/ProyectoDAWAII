'use client';

import { useState } from 'react';
import { User, Mail, Phone, Save } from 'lucide-react';

export default function PerfilPage() {
  // Datos simulados (en la vida real vendrían de una API o contexto de usuario)
  const [formData, setFormData] = useState({
    nombre: 'Juan Pérez',
    email: 'juan.perez@email.com',
    telefono: '0991234567',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Perfil actualizado correctamente (simulado)');
    // Aquí iría la llamada a la API real
  };

  return (
    <div className="flex justify-center items-center min-h-[70vh] px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-extrabold text-[#F2B847]">
            Editar Perfil
          </h1>
          <p className="text-sm text-gray-600">
            Actualiza tus datos personales
          </p>
        </div>

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
                className="w-full pl-10 pr-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F2B847]"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Correo electrónico</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F2B847]"
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
                pattern="[0-9]*"
                inputMode="numeric"
                className="w-full pl-10 pr-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F2B847]"
              />
            </div>
          </div>

          {/* Botón */}
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