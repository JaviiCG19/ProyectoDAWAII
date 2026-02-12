"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/services/useAuth";
import {
  Trash2, Edit, Plus, ArrowLeft, Loader2, 
  UserCircle, Building2, MapPin
} from "lucide-react";
import { Sucursal } from "@/interface/Sucursal";
import { Restaurante } from "@/interface/Restaurante";
import { Usuario } from "@/interface/Usuario";
import { 
  getUsuarios, crearUsuario, actualizarUsuario, eliminarUsuario 
} from "@/services/user.service";
import { getEmpresas } from "@/services/empresa.service";
import { getSucursalesByEmpresa } from "@/services/local.service";

// Modales
import ModalCrearUsuario from "@/components/modals/ModalCrearUsuario";
import ModalEditarUsuario from "@/components/modals/ModalEditarUsuario";
import ModalEliminarUsuario from "@/components/modals/ModalEliminarUsuario";

export default function UsuariosPage() {
  const router = useRouter();
  const checkingAuth = useAuth(["1"]);

  // Estados de Datos
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [empresas, setEmpresas] = useState<Restaurante[]>([]);
  const [locales, setLocales] = useState<Sucursal[]>([]);

  // Estados de UI/Carga 
  const [loading, setLoading] = useState(true);
  const [loadingLocales, setLoadingLocales] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  // ESTADOS PARA ELIMINACIÓN
  const [showDelete, setShowDelete] = useState(false);
  const [userToDelete, setUserToDelete] = useState<Usuario | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Formulario 
  const [formData, setFormData] = useState({
    usr_id: null as number | null,
    usr_nombre: "",
    usr_clave: "",
    usr_detalle: "",
    usr_roles: [] as string[],
    usr_rolp: "",
    usr_id_res: "",
    usr_id_local: "",
    usr_respuesta: "" 
  });

  const rolesDisponibles = [
    { id: "1", nombre: "Administrador" },
    { id: "2", nombre: "Gerente" },
    { id: "3", nombre: "Administrador Sucursal" },
    { id: "4", nombre: "Recepción" },
    { id: "5", nombre: "Mesero" },
  ];

  useEffect(() => {
    if (!checkingAuth) fetchData();
  }, [checkingAuth]);

  useEffect(() => {
    const empresaId = Number(formData.usr_id_res);
    if (empresaId && empresaId > 0) {
      setLoadingLocales(true);
      getSucursalesByEmpresa(empresaId)
        .then(setLocales)
        .catch(err => console.error("Error al cargar locales:", err)) 
        .finally(() => setLoadingLocales(false));
    } else {
      setLocales([]);
    }
  }, [formData.usr_id_res]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [uRes, eRes] = await Promise.all([getUsuarios(), getEmpresas()]);
      setUsuarios(uRes);
      setEmpresas(eRes);
    } catch (error) {
      console.error("Error cargando datos:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleRol = (rolId: string) => {
    setFormData(prev => {
      const nuevosRoles = prev.usr_roles.includes(rolId)
        ? prev.usr_roles.filter(r => r !== rolId)
        : [...prev.usr_roles, rolId];
      return { ...prev, usr_roles: nuevosRoles };
    });
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      const payload = {
        ...formData,
        usr_id: Number(formData.usr_id), 
        usr_roles: formData.usr_roles.join(";"), 
        usr_id_res: Number(formData.usr_id_res),
        usr_id_local: Number(formData.usr_id_local),
      };

      if (!payload.usr_respuesta || payload.usr_respuesta.trim() === "") {
        delete (payload as any).usr_respuesta;
      }

      const res = isEditing 
        ? await actualizarUsuario(payload) 
        : await crearUsuario(payload);
      
      if (res.result) {
        setShowCreate(false);
        setShowEdit(false);
        resetForm();
        fetchData();
      } else {
        alert("Error del servidor: " + res.message);
      }
    } catch (error) {
      console.error("Error en la petición:", error);
      alert("Hubo un error en la conexión.");
    }
  };

  const handleEditClick = (u: Usuario) => {
    setIsEditing(true);
    setFormData({
      usr_id: u.id,
      usr_nombre: u.nombre,
      usr_clave: "",
      usr_detalle: u.detalle || "",
      usr_roles: u.roles ? u.roles.split(";").filter(r => r !== "") : [],
      usr_rolp: String(u.rol_prioritario),
      usr_id_res: String(u.id_res),
      usr_id_local: String(u.id_local),
      usr_respuesta: "" 
    });
    setShowEdit(true);
  };

  // Función para abrir el modal de borrado
  const handleDeleteClick = (u: Usuario) => {
    setUserToDelete(u);
    setShowDelete(true);
  };

  // Función para ejecutar el borrado
  const confirmDelete = async () => {
    if (!userToDelete) return;
    try {
      setIsDeleting(true);
      const res = await eliminarUsuario(userToDelete.id);
      if (res.result) {
        setShowDelete(false);
        setUserToDelete(null);
        fetchData();
      } else {
        alert("Error al eliminar: " + res.message);
      }
    } catch (error) {
      console.error(error);
      alert("Error de conexión al eliminar.");
    } finally {
      setIsDeleting(false);
    }
  };

  const resetForm = () => {
    setFormData({ 
      usr_id: null, usr_nombre: "", usr_clave: "", usr_detalle: "", 
      usr_roles: [], usr_rolp: "", usr_id_res: "", usr_id_local: "", 
      usr_respuesta: "" 
    });
    setIsEditing(false);
  };

  if (checkingAuth) return null;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push("/admin")} 
            className="p-2 hover:bg-gray-100 rounded-full transition-all"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Gestión de Personal</h1>
        </div>
        
        <button 
          onClick={() => { resetForm(); setShowCreate(true); }} 
          className="bg-[#dc902b] text-white px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-sm hover:bg-[#c57d23]"
        >
          <Plus size={20} /> Nuevo Integrante
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center py-20">
            <Loader2 className="animate-spin text-orange-500" size={40} />
          </div>
        ) : usuarios.length === 0 ? (
          <div className="col-span-full text-center py-20 text-gray-400">
            No hay personal registrado aún.
          </div>
        ) : (
          usuarios.map(u => {
            const empresaAsignada = empresas.find(e => e.id === u.id_res);
            return (
              <div 
                key={u.id} 
                className="bg-white p-6 rounded-4xl border border-gray-100 shadow-sm group hover:shadow-md transition-all relative overflow-hidden"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-4">
                    <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl">
                      <UserCircle size={28} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg leading-tight">{u.nombre}</h3>
                      <p className="text-sm text-gray-500 font-medium">{u.detalle || 'Colaborador'}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEditClick(u)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg">
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => handleDeleteClick(u)} 
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 mb-4 bg-gray-50 p-3 rounded-2xl">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Building2 size={14} className="text-orange-400" />
                    <span className="text-xs font-bold truncate">
                      {empresaAsignada?.nomfan || `ID Empresa: ${u.id_res}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin size={14} className="text-orange-400" />
                    <span className="text-xs truncate">Sucursal ID: {u.id_local}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-gray-50">
                  {u.roles.split(";").filter(r => r).map(r => (
                    <span 
                      key={r} 
                      className={`text-[9px] px-2.5 py-1 rounded-full font-bold uppercase ${
                        Number(r) === u.rol_prioritario 
                        ? 'bg-orange-600 text-white' 
                        : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {rolesDisponibles.find(rd => rd.id === r)?.nombre}
                    </span>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>

      <ModalCrearUsuario
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        formData={formData} 
        setFormData={setFormData}
        empresas={empresas} 
        locales={locales} 
        loadingLocales={loadingLocales}
        toggleRol={toggleRol} 
        rolesDisponibles={rolesDisponibles} 
        handleSave={handleSave}
      />

      <ModalEditarUsuario
        isOpen={showEdit}
        onClose={() => setShowEdit(false)}
        formData={formData} 
        setFormData={setFormData}
        empresas={empresas} 
        locales={locales} 
        loadingLocales={loadingLocales}
        toggleRol={toggleRol} 
        rolesDisponibles={rolesDisponibles} 
        handleSave={handleSave}
      />

      <ModalEliminarUsuario
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={confirmDelete}
        nombreUsuario={userToDelete?.nombre || ""}
        loading={isDeleting}
      />
    </div>
  );
}