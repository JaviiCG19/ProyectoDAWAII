"use client";

import { useState } from "react";

import { X, User, HelpCircle, Key, Save, Loader2, Check } from "lucide-react";
import { resetPassword } from "@/services/recovery.service";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalResetPassword({ isOpen, onClose }: Props) {
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false); 
  const [form, setForm] = useState({
    usr_nombre: "",
    usr_respuesta: "",
    new_password: "",
    confirm_password: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.new_password !== form.confirm_password) {
      return alert("Las contraseñas no coinciden");
    }

    if (form.new_password.length < 4) {
      return alert("La contraseña debe tener al menos 4 caracteres");
    }

    setLoading(true);
    
    const res = await resetPassword({
      usr_nombre: form.usr_nombre,
      usr_respuesta: form.usr_respuesta,
      new_password: form.new_password
    });

    if (res.result) {
    
      setShowSuccess(true);
      setForm({ usr_nombre: "", usr_respuesta: "", new_password: "", confirm_password: "" });
      
   
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 3000);
      
    } else {
      alert(res.message || "No se pudo restablecer la contraseña");
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-100 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl border border-gray-100 animate-in fade-in zoom-in duration-200">
          <div className="p-6 border-b flex justify-between items-center bg-gray-50/50 rounded-t-[2.5rem]">
            <h2 className="text-lg font-black text-gray-800 uppercase tracking-tighter">Recuperar Acceso</h2>
            <button onClick={onClose} className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full transition-all">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-2">Usuario del sistema</label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400" />
                <input
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-orange-400 transition-all"
                  placeholder="Nombre de usuario"
                  value={form.usr_nombre}
                  onChange={(e) => setForm({ ...form, usr_nombre: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-2">Respuesta Secreta</label>
              <div className="relative">
                <HelpCircle size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400" />
                <input
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-orange-400 transition-all"
                  placeholder="¿Cuál es tu respuesta?"
                  value={form.usr_respuesta}
                  onChange={(e) => setForm({ ...form, usr_respuesta: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="py-2"><div className="h-px bg-gray-100 w-full" /></div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-2">Nueva Contraseña</label>
              <div className="relative">
                <Key size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400" />
                <input
                  type="password"
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="••••••••"
                  value={form.new_password}
                  onChange={(e) => setForm({ ...form, new_password: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-2">Confirmar Nueva Contraseña</label>
              <input
                type="password"
                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="Repetir contraseña"
                value={form.confirm_password}
                onChange={(e) => setForm({ ...form, confirm_password: e.target.value })}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || showSuccess}
              className="w-full mt-4 py-4 bg-orange-400 text-white font-black rounded-2xl shadow-lg shadow-orange-100 hover:bg-orange-500 disabled:bg-gray-200 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Save size={18} />}
              {loading ? "VERIFICANDO..." : "CAMBIAR CONTRASEÑA"}
            </button>
          </form>
        </div>
      </div>

     
      {showSuccess && (
        <div className="fixed bottom-6 right-6 bg-green-600 text-white px-6 py-4 rounded-2xl shadow-2xl z-[200] flex items-center gap-3 font-bold animate-bounce">
          <Check size={20} /> 
          Contraseña actualizada
        </div>
      )}
    </>
  );
}