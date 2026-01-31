import { User, Mail, Phone, UserPlus } from 'lucide-react';

export default function RegistroPage() {
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

        {/* Form simple (sin validación por ahora) */}
        <form className="space-y-4">
          {/* Nombre */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Nombre completo</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Juan Pérez"
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
                placeholder="ejemplo@email.com"
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
                placeholder="0991234567"
                className="w-full pl-10 pr-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F2B847]"
              />
            </div>
          </div>

          {/* Botón */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-[#F2B847] text-white py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition"
          >
            <UserPlus size={18} />
            Registrarme
          </button>
        </form>
      </div>
    </div>
  );
}