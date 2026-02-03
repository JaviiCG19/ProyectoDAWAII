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
      <div className="bg-white rounded-[2.5rem] w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
        
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={24} className="text-gray-400" />
        </button>

        <div className="p-8">
          <h2 className="text-2xl font-black text-gray-800 mb-6 tracking-tight">
            ACTUALIZAR DATOS DE USUARIO
          </h2>

          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

      
              <div className="space-y-4">
                <h3 className="font-bold text-yellow-600 border-b pb-2 text-sm uppercase mb-3">
                  Datos de Acceso e Identidad
                </h3>

                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase ml-2">
                    Usuario
                  </label>
                  <input
                    className="w-full p-3 bg-gray-100 border border-gray-100 rounded-xl text-gray-400 cursor-not-allowed"
                    value={formData.usr_nombre}
                    disabled
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase ml-2">
                    Nombre Completo
                  </label>
                  <input
                    className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-orange-400"
                    value={formData.usr_detalle}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        usr_detalle: e.target.value
                      })
                    }
                  />
                </div>

       
                <div className="pt-2">
                  <h3 className="font-bold text-yellow-600 border-b pb-2 text-sm uppercase mb-3">
                    Seguridad de Cuenta
                  </h3>
                  <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-2xl shadow-inner">
                    <label className="text-[10px] font-bold text-yellow-700 uppercase flex items-center gap-2 mb-2">
                      <ShieldAlert size={14} />
                      Nueva Respuesta (Opcional)
                    </label>

                    <input
                      placeholder="Llenar solo si desea cambiarla"
                      className="w-full p-3 bg-white border border-yellow-200 rounded-xl outline-none focus:ring-2 focus:ring-yellow-400"
                      value={formData.usr_respuesta ?? ""}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          usr_respuesta: e.target.value
                            .toLowerCase()
                            .trim()
                        })
                      }
                    />

                    <p className="text-[9px] text-yellow-600 mt-2 italic font-medium">
                      Si se deja vacío, la respuesta actual no se modifica.
                    </p>
                  </div>
                </div>
              </div>

         
              <div className="space-y-4">
                <h3 className="font-bold text-yellow-600 border-b pb-2 text-sm uppercase mb-3">
                  Asignación de Sede
                </h3>

                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase ml-2">
                    Empresa / Restaurante
                  </label>
                  <select
                    className="w-full p-3 bg-gray-100 border border-gray-100 rounded-xl opacity-60 cursor-not-allowed"
                    value={formData.usr_id_res ?? ""}
                    disabled
                  >
                    {empresas.map((emp: any) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.nomfan}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase ml-2">
                    Sucursal
                  </label>
                  <select
                    className="w-full p-3 bg-gray-100 border border-gray-100 rounded-xl opacity-60 cursor-not-allowed"
                    value={formData.usr_id_local ?? ""}
                    disabled
                  >
                    {locales.map((loc: any) => (
                      <option key={loc.id} value={loc.id}>
                        {loc.detalle}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

            
              <div className="md:col-span-2 space-y-4 bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                <h3 className="font-bold text-gray-700 text-sm uppercase">
                  Permisos y Roles
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {rolesDisponibles.map((rol: any) => (
                    <div
                      key={rol.id}
                      onClick={() => toggleRol(rol.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                        formData.usr_roles.includes(rol.id)
                          ? "bg-white border-orange-500 shadow-md"
                          : "bg-transparent border-gray-200 opacity-60"
                      }`}
                    >
                      {formData.usr_roles.includes(rol.id) ? (
                        <CheckSquare className="text-orange-500" />
                      ) : (
                        <Square className="text-gray-300" />
                      )}
                      <span className="font-bold text-xs">
                        {rol.nombre}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="max-w-xs mt-4">
                  <label className="text-[10px] font-bold text-gray-500 uppercase block mb-2 ml-2">
                    Rol Principal
                  </label>
                  <select
                    className="w-full p-3 bg-gray-100 border border-orange-200 rounded-xl outline-none opacity-60 cursor-not-allowed"
                    value={formData.usr_rolp}
                    disabled
                    required
                  >
                    {rolesDisponibles
                      .filter((r: any) =>
                        formData.usr_roles.includes(r.id)
                      )
                      .map((r: any) => (
                        <option key={`edit-${r.id}`} value={r.id}>
                          {r.nombre}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t mt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-8 py-3 font-bold text-gray-400 hover:text-gray-600 transition-colors"
              >
                CANCELAR
              </button>

              <button
                type="submit"
                className="px-10 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl shadow-lg transition-all active:scale-95 flex items-center gap-2"
              >
                <Save size={20} /> ACTUALIZAR DATOS
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}