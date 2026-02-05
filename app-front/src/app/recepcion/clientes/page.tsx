"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Phone, UserPlus, CreditCard } from "lucide-react";
import api from "@/lib/api";

export default function NuevoClientePage() {
  const router = useRouter();

  const [form, setForm] = useState({
    nombre: "",
    ruc_cc: "",
    telefono: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validaciones
    if (!form.nombre.trim()) {
      setError("El nombre es obligatorio");
      setLoading(false);
      return;
    }
    if (!form.ruc_cc.trim()) {
      setError("RUC/Cédula es obligatorio");
      setLoading(false);
      return;
    }
    if (!form.telefono.match(/^\d{9,10}$/)) {
      setError("Teléfono debe tener 9 o 10 dígitos");
      setLoading(false);
      return;
    }

    try {
      await api.post("/clientes", form);
      alert("Cliente registrado correctamente");
      router.back();
    } catch (err: any) {
      setError("Error al registrar cliente. Intenta nuevamente.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl bg-white rounded-2xl md:rounded-3xl shadow-lg p-6 sm:p-8 md:p-10 space-y-6 md:space-y-8 border border-gray-100">
        {/* Header */}
        <div className="text-center space-y-2 md:space-y-3">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#F2B847]">
            Registrar Cliente
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Ingresa los datos para registrar un nuevo cliente en el sistema
          </p>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm md:text-base" role="alert">
            {error}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
          {/* Nombre */}
          <div className="space-y-2">
            <label className="block text-sm md:text-base font-medium text-gray-700">
              Nombre completo
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                placeholder="Juan Pérez"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-[#F2B847] focus:border-[#F2B847] transition-all"
                required
              />
            </div>
          </div>

          {/* RUC / Cédula */}
          <div className="space-y-2">
            <label className="block text-sm md:text-base font-medium text-gray-700">
              RUC / Cédula
            </label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                name="ruc_cc"
                value={form.ruc_cc}
                onChange={handleChange}
                placeholder="1723456789"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-[#F2B847] focus:border-[#F2B847] transition-all"
                required
              />
            </div>
          </div>

          {/* Teléfono */}
          <div className="space-y-2">
            <label className="block text-sm md:text-base font-medium text-gray-700">
              Teléfono
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="tel"
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
                placeholder="0991234567"
                pattern="[0-9]{9,10}"
                inputMode="numeric"
                maxLength={10}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-[#F2B847] focus:border-[#F2B847] transition-all"
                required
              />
            </div>
          </div>

          {/* Botón */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center gap-3 bg-[#F2B847] text-white py-3.5 md:py-4 rounded-xl text-base md:text-lg font-semibold transition-all shadow-md ${
              loading ? "opacity-70 cursor-not-allowed" : "hover:bg-[#e0a836] active:scale-[0.98]"
            }`}
          >
            <UserPlus size={20} />
            {loading ? "Registrando..." : "Guardar Cliente"}
          </button>
        </form>
      </div>
    </div>
  );
}