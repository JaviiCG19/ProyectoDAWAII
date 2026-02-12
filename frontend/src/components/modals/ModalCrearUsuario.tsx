"use client";
import { Save, CheckSquare, Square, X, ShieldQuestion, Lock } from "lucide-react";
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
  const isOperativo = ![1, 2, ""].includes(rolPrincipal);

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

  const getFieldStyle = (disabled: boolean) => 
    `w-full p-3 border rounded-xl outline-none transition-all ${
      disabled 
        ? "bg-gray-200 border-gray-300 text-gray-500 cursor-not-allowed opacity-70" 
        : "bg-gray-50 border-gray-100 focus:ring-2 focus:ring-orange-400"
    }`;

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
          Registrar Nuevo Integrante
        </h2>

        <form onSubmit={handleSave} className="space-y-10">

          <div className="space-y-6 bg-orange-50/40 p-7 rounded-2xl border border-orange-100">
            <h3 className="font-black text-orange-700 text-base uppercase tracking-wide">
              1. Selecciona Rol Principal y Permisos
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {rolesDisponibles.map((rol: any) => (
                <div
                  key={rol.id}
                  onClick={() => toggleRol(rol.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                    formData.usr_roles.includes(rol.id)
                      ? "bg-white border-orange-500 shadow-md scale-[1.02]"
                      : "bg-white/60 border-gray-200 hover:border-orange-300"
                  }`}
                >
                  {formData.usr_roles.includes(rol.id) ? <CheckSquare className="text-orange-500" /> : <Square className="text-gray-300" />}
                  <span className="font-bold text-sm">{rol.nombre}</span>
                </div>
              ))}
            </div>

            <div className="max-w-sm">
              <label className="text-xs font-bold text-gray-600 uppercase block mb-2 ml-1">
                Rol Principal (define nivel de acceso)
              </label>
              <select
                className="w-full p-3.5 bg-white border-2 border-orange-300 rounded-xl outline-none focus:ring-2 focus:ring-orange-400 font-medium"
                value={formData.usr_rolp}
                onChange={e => setFormData({ ...formData, usr_rolp: e.target.value })}
                required
              >
                <option value="">— Seleccione rol principal —</option>
                {rolesDisponibles
                  .filter((r: any) => formData.usr_roles.includes(r.id))
                  .map((r: any) => (
                    <option key={r.id} value={r.id}>{r.nombre}</option>
                  ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-5">
              <h3 className="font-bold text-yellow-700 border-b border-yellow-200 pb-2 text-sm uppercase">
                2. Datos de Identidad
              </h3>

              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase ml-2 block mb-1">Nombre Completo</label>
                <input
                  className={getFieldStyle(false)}
                  value={formData.usr_detalle}
                  onChange={e => setFormData({ ...formData, usr_detalle: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase ml-2 block mb-1">Usuario</label>
                <input
                  className={getFieldStyle(false)}
                  value={formData.usr_nombre}
                  onChange={e => setFormData({ ...formData, usr_nombre: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase ml-2 block mb-1">Contraseña</label>
                <input
                  type="password"
                  className={getFieldStyle(false)}
                  value={formData.usr_clave}
                  onChange={e => setFormData({ ...formData, usr_clave: e.target.value })}
                  required
                />
              </div>
            </div>

    
            <div className="space-y-5">
              <h3 className="font-bold text-yellow-700 border-b border-yellow-200 pb-2 text-sm uppercase">
                3. Asignación de Sede
              </h3>

              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase ml-2 flex justify-between">
                  Empresa / Restaurante
                  {isAdmin && <span className="text-orange-600 flex items-center gap-1 text-xs"><Lock size={12}/> Global</span>}
                </label>
                <select
                  className={getFieldStyle(isAdmin)}
                  value={formData.usr_id_res}
                  onChange={e => setFormData({ ...formData, usr_id_res: e.target.value, usr_id_local: "" })}
                  disabled={isAdmin}
                  required={isGerente || isOperativo}
                >
                  <option value="">Seleccione restaurante...</option>
                  {empresas.map((emp: any) => (
                    <option key={emp.id} value={emp.id}>{emp.nomfan}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase ml-2 flex justify-between">
                  Sucursal Específica
                  {(isAdmin || isGerente) && <span className="text-orange-600 flex items-center gap-1 text-xs"><Lock size={12}/> No aplica</span>}
                </label>
                <select
                  className={getFieldStyle(isAdmin || isGerente)}
                  value={formData.usr_id_local}
                  onChange={e => setFormData({ ...formData, usr_id_local: e.target.value })}
                  disabled={isAdmin || isGerente}
                  required={isOperativo}
                >
                  <option value="">
                    {loadingLocales ? "Cargando..." : "Seleccione sucursal..."}
                  </option>
                  {locales.map((loc: any) => (
                    <option key={loc.id} value={loc.id}>{loc.detalle}</option>
                  ))}
                </select>
                {isGerente && (
                  <p className="text-[9px] text-gray-500 mt-1.5 ml-2 italic">
                    * Los gerentes supervisan todas las sucursales del restaurante seleccionado.
                  </p>
                )}
              </div>
            </div>
          </div>


          <div className="space-y-4 bg-orange-50/60 p-6 rounded-2xl border border-orange-100">
            <h3 className="font-bold text-orange-700 border-b border-orange-200 pb-2 text-sm uppercase">
              4. Seguridad de Cuenta
            </h3>
            <div>
              <label className="text-xs font-bold text-orange-700 uppercase flex items-center gap-2 mb-2">
                <ShieldQuestion size={16} /> Respuesta de Seguridad
              </label>
              <input
                placeholder="Ejemplo: nombre de tu primera mascota"
                className="w-full p-3.5 bg-white border border-orange-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500"
                value={formData.usr_respuesta}
                onChange={e => setFormData({ ...formData, usr_respuesta: e.target.value.toLowerCase().trim() })}
                required
              />
              <p className="text-[10px] text-orange-700/80 mt-2 italic">
                Usa algo que solo tú recuerdes. Se usará para recuperación de cuenta.
              </p>
            </div>
          </div>

   
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
              className="px-12 py-3 bg-orange-600 hover:bg-orange-700 text-white font-black rounded-xl shadow-lg active:scale-95 flex items-center gap-2 transition-all"
            >
              <Save size={20} /> REGISTRAR USUARIO
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}