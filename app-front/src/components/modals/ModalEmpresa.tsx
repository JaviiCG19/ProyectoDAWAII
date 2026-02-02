"use client";

import { useState, useEffect } from "react";
import { crearEmpresa, actualizarEmpresa } from "@/services/empresa.service";
import { Restaurante } from "@/interface/Restaurante";
import { X, Loader2 } from "lucide-react";

interface Props {
  alCerrar: () => void;
  alGuardar: () => void;
  empresaEdit?: Restaurante | null;
}

export default function ModalEmpresa({
  alCerrar,
  alGuardar,
  empresaEdit,
}: Props) {
  const [nomleg, setNomleg] = useState("");
  const [nomfan, setNomfan] = useState("");
  const [ruc, setRuc] = useState("");
  const [cargando, setCargando] = useState(false);


  useEffect(() => {
    if (empresaEdit) {
      setNomleg(empresaEdit.nomleg || "");
      setNomfan(empresaEdit.nomfan || "");
      setRuc(empresaEdit.ruc || "");
    } else {
      setNomleg("");
      setNomfan("");
      setRuc("");
    }
  }, [empresaEdit]);

  const manejarEnvio = async (e: React.FormEvent) => {
    e.preventDefault();

   
    const nombreLegal = nomleg.trim();
    const nombreFantasia = nomfan.trim();
    const rucLimpio = ruc.trim();

    
    if (nombreLegal.length < 3 || nombreFantasia.length < 3) {
      alert("Los nombres deben tener al menos 3 caracteres.");
      return;
    }

    if (rucLimpio.length !== 13) {
      alert("El RUC debe tener exactamente 13 dígitos");
      return;
    }

    setCargando(true);
    try {
      const payload = { 
        nomleg: nombreLegal, 
        nomfan: nombreFantasia, 
        ruc: rucLimpio 
      };

      let respuesta;
      if (empresaEdit?.id) {
        // Lógica de Actualización
        respuesta = await actualizarEmpresa(empresaEdit.id, payload);
      } else {
        // Lógica de Creación
        respuesta = await crearEmpresa(payload);
      }

   
      if (respuesta.result) {
        alGuardar();
        alCerrar();
      } else {
        alert("Error de validación: " + JSON.stringify(respuesta.message));
      }
    } catch (error) {
      console.error("Error en la petición:", error);
      alert("Ocurrió un error al conectar con el servidor.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-center border-b pb-3">
            <h2 className="text-xl font-bold text-gray-800">
              {empresaEdit ? "Editar Restaurante" : "Nuevo Restaurante"}
            </h2>
            <button 
              onClick={alCerrar} 
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={manejarEnvio} className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Razón Social (Nombre Legal)</label>
              <input
                className="w-full px-4 py-2 border rounded-xl mt-1 focus:ring-2 focus:ring-[#dc902b] outline-none"
                placeholder="Ej: Corporación Gastronómica S.A."
                value={nomleg}
                onChange={(e) => setNomleg(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Nombre Comercial (Fantasía)</label>
              <input
                className="w-full px-4 py-2 border rounded-xl mt-1 focus:ring-2 focus:ring-[#dc902b] outline-none"
                placeholder="Ej: El Buen Sabor"
                value={nomfan}
                onChange={(e) => setNomfan(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">RUC</label>
              <input
                className="w-full px-4 py-2 border rounded-xl mt-1 focus:ring-2 focus:ring-[#dc902b] outline-none font-mono"
                placeholder="13 dígitos numéricos"
                value={ruc}
                onChange={(e) => setRuc(e.target.value)}
                maxLength={13}
                required
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={alCerrar}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-gray-600 font-medium"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={cargando}
                className="flex-1 px-4 py-2 bg-[#dc902b] text-white rounded-xl font-bold flex justify-center items-center hover:bg-[#c57d23] transition-all disabled:opacity-50"
              >
                {cargando ? <Loader2 className="animate-spin" size={20} /> : "Guardar Cambios"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}