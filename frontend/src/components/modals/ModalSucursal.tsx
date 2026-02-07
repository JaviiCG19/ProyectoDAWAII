"use client";

import { useState, useEffect } from "react";
import { crearSucursal, actualizarSucursal } from "@/services/local.service";
import { Sucursal } from "@/interface/Sucursal";
import { Loader2, X } from "lucide-react";

interface Props {
  idEmpresa: number;
  onClose: () => void;
  onSaved: () => void;
  sucursalEdit?: Sucursal | null; 
}

export default function ModalSucursal({ idEmpresa, onClose, onSaved, sucursalEdit }: Props) {
  const [detalle, setDetalle] = useState("");
  const [direccion, setDireccion] = useState("");
  const [totmesas, setTotmesas] = useState(1);
  const [loading, setLoading] = useState(false);

  
  useEffect(() => {
    if (sucursalEdit) {
      setDetalle(sucursalEdit.detalle);
      setDireccion(sucursalEdit.direccion);
      setTotmesas(sucursalEdit.totmesas);
    }
  }, [sucursalEdit]);

  const guardarSucursal = async () => {
    if (!detalle.trim() || !direccion.trim() || totmesas <= 0) {
      alert("Complete todos los campos correctamente.");
      return;
    }

    setLoading(true);
    const payload = {
      idcia: idEmpresa,
      detalle: detalle.trim(),
      direccion: direccion.trim(),
      totmesas,
    };

    try {
      if (sucursalEdit?.id) {
        //Lógica de Edición
        await actualizarSucursal(sucursalEdit.id, payload);
      } else {
        //Lógica de Creación
        await crearSucursal(payload);
      }
      onSaved();
      onClose();
    } catch (error) {
      console.error(error);
      alert("Error al procesar la sucursal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl p-6 space-y-4">
        <div className="flex justify-between items-center border-b pb-3">
          <h2 className="text-xl font-bold text-gray-800">
            {sucursalEdit ? "Editar Sucursal" : "Nueva Sucursal"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase ml-1">Nombre / Detalle</label>
            <input
              className="w-full px-4 py-2 border rounded-xl mt-1 focus:ring-2 focus:ring-[#dc902b] outline-none"
              value={detalle}
              onChange={(e) => setDetalle(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-400 uppercase ml-1">Dirección</label>
            <input
              className="w-full px-4 py-2 border rounded-xl mt-1 focus:ring-2 focus:ring-[#dc902b] outline-none"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-400 uppercase ml-1">Total de Mesas</label>
            <input
              type="number"
              className="w-full px-4 py-2 border rounded-xl mt-1 focus:ring-2 focus:ring-[#dc902b] outline-none"
              value={totmesas}
              onChange={(e) => setTotmesas(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button onClick={onClose} className="flex-1 px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-xl">
            Cancelar
          </button>
          <button
            onClick={guardarSucursal}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-[#dc902b] text-white rounded-xl font-bold flex justify-center items-center disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : "Guardar Cambios"}
          </button>
        </div>
      </div>
    </div>
  );
}