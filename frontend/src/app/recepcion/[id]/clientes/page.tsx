"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { User, Phone, UserPlus, CreditCard } from "lucide-react";
import api from "@/lib/api";
import ModalClienteCreado from "@/components/modals/ModalClienteCreado";

export default function NuevoClientePage() {
  const router = useRouter();
  const params = useParams(); // ← para obtener el ID de la sucursal
  const localId = Number(params?.id); // ← id de la sucursal actual

  const [form, setForm] = useState({
    nombre: "",
    ruc_cc: "",
    telefono: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [nombreCreado, setNombreCreado] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "ruc_cc" || name === "telefono") {
      if (value === "" || /^[0-9]*$/.test(value)) {
        setForm((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validaciones (igual que antes)
    if (!form.nombre.trim()) {
      setError("El nombre completo es obligatorio");
      setLoading(false);
      return;
    }

    if (!form.ruc_cc) {
      setError("La cédula / RUC es obligatoria");
      setLoading(false);
      return;
    }

    if (!/^[0-9]{10}$/.test(form.ruc_cc)) {
      setError("La cédula / RUC debe tener **exactamente 10 dígitos numéricos**");
      setLoading(false);
      return;
    }

    if (!form.telefono) {
      setError("El teléfono es obligatorio");
      setLoading(false);
      return;
    }

    if (!/^[0-9]{9,10}$/.test(form.telefono)) {
      setError("El teléfono debe tener **9 o 10 dígitos numéricos**");
      setLoading(false);
      return;
    }

    try {
      await api.post("/reservas/clientes", {
        idlocal: localId,    
        nombre: form.nombre,
        ruc_cc: form.ruc_cc,
        telefono: form.telefono,
      });

      setNombreCreado(form.nombre);
      setSuccessModalOpen(true);

      setForm({ nombre: "", ruc_cc: "", telefono: "" });
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Error al registrar el cliente. Intenta nuevamente."
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSuccess = () => {
    setSuccessModalOpen(false);
    router.back(); 
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl bg-white rounded-2xl md:rounded-3xl shadow-lg p-6 sm:p-8 md:p-10 space-y-6 md:space-y-8 border border-gray-100">
        <div className="text-center space-y-2 md:space-y-3">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#F2B847]">
            Registrar Cliente
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Ingresa los datos para registrar un nuevo cliente en el sistema
          </p>
        </div>

        {error && (
          <div
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm md:text-base"
            role="alert"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
          {/* Nombre */}
          <div className="space-y-2">
            <label className="block text-sm md:text-base font-medium text-gray-700">
              Nombre completo
            </label>
            <div className="relative">
              <User
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
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

          {/* Cédula / RUC */}
          <div className="space-y-2">
            <label className="block text-sm md:text-base font-medium text-gray-700">
              Cédula / RUC
            </label>
            <div className="relative">
              <CreditCard
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                name="ruc_cc"
                value={form.ruc_cc}
                onChange={handleChange}
                placeholder="1723456789"
                maxLength={10}
                inputMode="numeric"        
                pattern="[0-9]*"          
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-[#F2B847] focus:border-[#F2B847] transition-all"
                required
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Solo números • exactamente 10 dígitos
            </p>
          </div>

          {/* Teléfono */}
          <div className="space-y-2">
            <label className="block text-sm md:text-base font-medium text-gray-700">
              Teléfono celular
            </label>
            <div className="relative">
              <Phone
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="tel"
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
                placeholder="0991234567"
                maxLength={10}
                inputMode="numeric"
                pattern="[0-9]*"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-[#F2B847] focus:border-[#F2B847] transition-all"
                required
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Solo números • 9 o 10 dígitos
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center gap-3 bg-[#F2B847] text-gray-900 py-3.5 md:py-4 rounded-xl text-base md:text-lg font-semibold transition-all shadow-md ${
              loading
                ? "opacity-70 cursor-not-allowed"
                : "hover:bg-[#e0a836] active:scale-[0.98]"
            }`}
          >
            <UserPlus size={20} />
            {loading ? "Registrando..." : "Guardar Cliente"}
          </button>
        </form>
      </div>

      <ModalClienteCreado
        isOpen={successModalOpen}
        onClose={handleCloseSuccess}
        nombreCliente={nombreCreado}
      />
    </div>
  );
}