"use client";
import { Save, CheckSquare, Square, X, ShieldAlert } from "lucide-react";

export default function ModalEditarUsuario({ 
  isOpen,
  onClose,
  formData,
  setFormData,
  empresas,
  locales,
  loadingLocales,
  toggleRol,
  rolesDisponibles,
  handleSave
}: any) {
  if (!isOpen) return null;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSave(e); 
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[2.5rem] w-full max-w-4xl max-h-[95vh] overflow-y-auto shadow-2xl relative p-8">
        
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={24} className="text-gray-400" />
        </button>

        <h2 className="text-2xl font-black text-gray-800 mb-8 tracking-tight uppercase">
          Actualizar Datos de Usuario
        </h2>

        <form onSubmit={onSubmit} className="space-y-10">

          {/* 1. ROLES Y PERMISOS – primero */}
          <div className="space-y-6 bg-gray-50/70 p-7 rounded-2xl border border-gray-200">
            <h3 className="font-black text-gray-700 text-base uppercase tracking-wide">
              1. Permisos y Rol Principal
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {rolesDisponibles.map((rol: any) => (
                <div
                  key={rol.id}
                  onClick={() => toggleRol(rol.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                    formData.usr_roles.includes(rol.id)
                      ? "bg-white border-blue-500 shadow-md"
                      : "bg-white/60 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {formData.usr_roles.includes(rol.id) ? (
                    <CheckSquare className="text-blue-500" />
                  ) : (
                    <Square className="text-gray-300" />
                  )}
                  <span className="font-bold text-sm">{rol.nombre}</span>
                </div>
              ))}
            </div>

            <div className="max-w-sm">
              <label className="text-xs font-bold text-gray-600 uppercase block mb-2 ml-1">
                Rol Principal (nivel de acceso actual)
              </label>
              <select
                className="w-full p-3.5 bg-gray-100 border-2 border-gray-300 rounded-xl outline-none opacity-70 cursor-not-allowed font-medium"
                value={formData.usr_rolp}
                disabled
              >
                <option value="">— Sin rol principal —</option>
                {rolesDisponibles
                  .filter((r: any) => formData.usr_roles.includes(r.id))
                  .map((r: any) => (
                    <option key={r.id} value={r.id}>{r.nombre}</option>
                  ))}
              </select>
            </div>
          </div>

          {/* 2. DATOS DE IDENTIDAD */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-5">
              <h3 className="font-bold text-gray-700 border-b border-gray-200 pb-2 text-sm uppercase">
                2. Datos de Identidad
              </h3>

              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase ml-2 block mb-1">
                  Usuario
                </label>
                <input
                  className="w-full p-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed"
                  value={formData.usr_nombre}
                  disabled
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase ml-2 block mb-1">
                  Nombre Completo
                </label>
                <input
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-400"
                  value={formData.usr_detalle}
                  onChange={e => setFormData({ ...formData, usr_detalle: e.target.value })}
                />
              </div>
            </div>

            {/* 3. ASIGNACIÓN DE SEDE */}
            <div className="space-y-5">
              <h3 className="font-bold text-gray-700 border-b border-gray-200 pb-2 text-sm uppercase">
                3. Asignación de Sede
              </h3>

              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase ml-2 block mb-1">
                  Empresa / Restaurante
                </label>
                <select
                  className="w-full p-3 bg-gray-100 border border-gray-200 rounded-xl opacity-60 cursor-not-allowed"
                  value={formData.usr_id_res ?? ""}
                  disabled
                >
                  <option value="">— No disponible —</option>
                  {empresas.map((emp: any) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.nomfan}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase ml-2 block mb-1">
                  Sucursal Específica
                </label>
                <select
                  className="w-full p-3 bg-gray-100 border border-gray-200 rounded-xl opacity-60 cursor-not-allowed"
                  value={formData.usr_id_local ?? ""}
                  disabled
                >
                  <option value="">— No disponible —</option>
                  {locales.map((loc: any) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.detalle}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 4. SEGURIDAD – al final */}
          <div className="space-y-4 bg-gray-50/80 p-6 rounded-2xl border border-gray-200">
            <h3 className="font-bold text-gray-700 border-b border-gray-200 pb-2 text-sm uppercase">
              4. Seguridad de Cuenta
            </h3>
            <div>
              <label className="text-xs font-bold text-gray-700 uppercase flex items-center gap-2 mb-2">
                <ShieldAlert size={16} /> Nueva Respuesta de Seguridad (opcional)
              </label>
              <input
                placeholder="Llenar solo si desea cambiarla"
                className="w-full p-3.5 bg-white border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-400"
                value={formData.usr_respuesta ?? ""}
                onChange={e =>
                  setFormData({
                    ...formData,
                    usr_respuesta: e.target.value.toLowerCase().trim()
                  })
                }
              />
              <p className="text-[10px] text-gray-600 mt-2 italic">
                Si se deja vacío, la respuesta actual se mantiene sin cambios.
              </p>
            </div>
          </div>

          {/* Botones finales */}
          <div className="flex justify-end gap-4 pt-8 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-10 py-3 font-bold text-gray-500 hover:text-gray-700 transition-colors"
            >
              CANCELAR
            </button>

            <button
              type="submit"
              className="px-12 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl shadow-lg active:scale-95 flex items-center gap-2 transition-all"
            >
              <Save size={20} /> ACTUALIZAR DATOS
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}