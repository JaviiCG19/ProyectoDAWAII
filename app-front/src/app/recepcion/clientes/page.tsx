"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Phone, UserPlus, CreditCard } from "lucide-react";

// Tu instancia de API personalizada
import api from "@/lib/api";

export default function NuevoClientePage() {
  const router = useRouter();

  // Estados para controlar el formulario
  const [form, setForm] = useState({
    nombre: "",
    ruc_cc: "",
    telefono: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Manejador de cambios en inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Función para guardar (Lógica original con diseño nuevo)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validaciones básicas de tu nuevo diseño
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
      alert(" Cliente registrado");
      router.push("/recepcion/clientes");
    } catch (err: any) {
      setError("Error al registrar cliente");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[70vh] px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-6 space-y-6 border border-slate-100">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-extrabold text-[#F2B847]">
            Registrar Cliente
          </h1>
          <p className="text-sm text-gray-600">
            Ingresa los datos para registrar un nuevo cliente en el sistema
          </p>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm" role="alert">
            {error}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Nombre completo</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                placeholder="Juan Pérez"
                className="w-full pl-10 pr-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F2B847] transition-all"
                required
              />
            </div>
          </div>

          {/* RUC / Cédula */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">RUC / Cédula</label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                name="ruc_cc"
                value={form.ruc_cc}
                onChange={handleChange}
                placeholder="1723456789"
                className="w-full pl-10 pr-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F2B847] transition-all"
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
                value={form.telefono}
                onChange={handleChange}
                placeholder="0991234567"
                pattern="[0-9]{9,10}"
                inputMode="numeric"
                className="w-full pl-10 pr-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F2B847] transition-all"
                required
                maxLength={10}
              />
            </div>
          </div>

          {/* Botón de Acción */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 bg-[#F2B847] text-white py-3 rounded-xl text-sm font-semibold transition-all shadow-md ${
              loading ? "opacity-70 cursor-not-allowed" : "hover:bg-[#e0a836] active:scale-[0.98]"
            }`}
          >
            <UserPlus size={18} />
            {loading ? "Registrando..." : "Guardar Cliente"}
          </button>
        </form>
      </div>
    </div>
  );
}