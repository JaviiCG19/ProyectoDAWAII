"use client";
import { Save, CheckSquare, Square, X, ShieldQuestion } from "lucide-react";
import { useEffect } from "react";

export default function ModalCrearUsuario({ 
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


  const rolPrincipal = Number(formData.usr_rolp);

  const isAdmin = rolPrincipal === 1;
  const isGerente = rolPrincipal === 2;
  const isSucursal = [3, 4, 5].includes(rolPrincipal);

  useEffect(() => {
    if (!isOpen) return;

    if (isAdmin) {
      setFormData((prev: any) => ({
        ...prev,
        usr_id_res: "",
        usr_id_local: ""
      }));
    }

    if (isGerente) {
      setFormData((prev: any) => ({
        ...prev,
        usr_id_local: ""
      }));
    }
  }, [rolPrincipal, isOpen, isAdmin, isGerente, setFormData]);


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[2.5rem] w-full max-w-4xl max-h-[95vh] overflow-y-auto shadow-2xl relative p-8">
        
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={24} className="text-gray-400" />
        </button>

        <h2 className="text-2xl font-black text-gray-800 mb-6 tracking-tight">
          REGISTRAR NUEVO INTEGRANTE
        </h2>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          
            <div className="space-y-4">
              <h3 className="font-bold text-orange-600 border-b pb-2 text-sm uppercase">
                Datos de Acceso
              </h3>

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase ml-2">
                  Usuario
                </label>
                <input
                  className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-orange-400"
                  value={formData.usr_nombre}
                  onChange={e =>
                    setFormData({ ...formData, usr_nombre: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase ml-2">
                  Contraseña
                </label>
                <input
                  type="password"
                  className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-orange-400"
                  value={formData.usr_clave}
                  onChange={e =>
                    setFormData({ ...formData, usr_clave: e.target.value })
                  }
                  required
                />
              </div>

              <div className="p-4 bg-orange-50 border border-orange-100 rounded-2xl shadow-inner">
                <label className="text-[10px] font-bold text-orange-700 uppercase flex items-center gap-2 mb-2">
                  <ShieldQuestion size={14} /> Respuesta de Seguridad
                </label>
                <input
                  placeholder="Ej: mi mascota"
                  className="w-full p-3 bg-white border border-orange-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500"
                  value={formData.usr_respuesta}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      usr_respuesta: e.target.value.toLowerCase().trim()
                    })
                  }
                  required
                />
                <p className="text-[9px] text-orange-400 mt-2 font-medium uppercase">
                  * Se guarda automáticamente sin espacios y en minúsculas
                </p>
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase ml-2">
                  Nombre Completo
                </label>
                <input
                  className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-orange-400"
                  value={formData.usr_detalle}
                  onChange={e =>
                    setFormData({ ...formData, usr_detalle: e.target.value })
                  }
                />
              </div>
            </div>

          
            <div className="space-y-4">
              <h3 className="font-bold text-orange-600 border-b pb-2 text-sm uppercase">
                Ubicación y Sede
              </h3>

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase ml-2">
                  Empresa / Restaurante
                </label>
                <select
                  className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-orange-400"
                  value={formData.usr_id_res}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      usr_id_res: e.target.value,
                      usr_id_local: ""
                    })
                  }
                  disabled={isAdmin || isSucursal}
                  required={isGerente}
                >
                  <option value="">Seleccione...</option>
                  {empresas.map((emp: any) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.nomfan}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase ml-2">
                  Sucursal Asignada
                </label>
                <select
                  className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-orange-400"
                  value={formData.usr_id_local}
                  onChange={e =>
                    setFormData({ ...formData, usr_id_local: e.target.value })
                  }
                  disabled={isAdmin || isGerente}
                  required={isSucursal}
                >
                  <option value="">
                    {loadingLocales ? "Cargando..." : "Seleccione..."}
                  </option>
                  {locales.map((loc: any) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.detalle}
                    </option>
                  ))}
                </select>
              </div>
            </div>

          
            <div className="md:col-span-2 space-y-4 bg-orange-50/30 p-6 rounded-2xl border border-orange-100">
              <h3 className="font-bold text-orange-600 text-sm uppercase">
                Permisos y Roles
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {rolesDisponibles.map((rol: any) => (
                  <div
                    key={rol.id}
                    onClick={() => toggleRol(rol.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                      formData.usr_roles.includes(rol.id)
                        ? "bg-white border-orange-500 shadow-md scale-[1.02]"
                        : "bg-transparent border-gray-200 opacity-60 hover:opacity-100"
                    }`}
                  >
                    {formData.usr_roles.includes(rol.id)
                      ? <CheckSquare className="text-orange-500" />
                      : <Square className="text-gray-300" />}
                    <span className="font-bold text-xs">{rol.nombre}</span>
                  </div>
                ))}
              </div>

              <div className="max-w-xs mt-4">
                <label className="text-[10px] font-bold text-gray-500 uppercase block mb-2 ml-2">
                  Rol Principal (Prioridad)
                </label>
                <select
                  className="w-full p-3 bg-white border border-orange-200 rounded-xl outline-none"
                  value={formData.usr_rolp}
                  onChange={e =>
                    setFormData({ ...formData, usr_rolp: e.target.value })
                  }
                  required
                >
                  <option value="">Seleccione prioridad...</option>
                  {rolesDisponibles
                    .filter((r: any) => formData.usr_roles.includes(r.id))
                    .map((r: any) => (
                      <option key={r.id} value={r.id}>
                        {r.nombre}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-3 font-bold text-gray-400 hover:text-gray-600 transition-colors"
            >
              CANCELAR
            </button>
            <button
              type="submit"
              className="px-10 py-3 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-xl shadow-lg shadow-orange-100 transition-all active:scale-95 flex items-center gap-2"
            >
              <Save size={20} /> REGISTRAR PERSONAL
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
