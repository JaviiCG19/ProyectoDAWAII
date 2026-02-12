"use client";
import { useState, useEffect } from "react";
import { Franja } from "@/interface/admin.interface";
import { saveFranja } from "@/services/admin-sucursal.service";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  idLocal: number;
  selectedData?: Franja | null;
}

export default function ModalFranja({ isOpen, onClose, onSuccess, idLocal, selectedData }: Props) {
  const [formData, setFormData] = useState({
    diasem: 1, // Valor por defecto
    horini: "09:00",
    horfin: "18:00",
    tipres: 0
  });

  useEffect(() => {
    if (selectedData) setFormData({ ...selectedData });
    else setFormData({ diasem: 1, horini: "09:00", horfin: "18:00", tipres: 0 });
  }, [selectedData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await saveFranja({ ...formData, idlocal: idLocal, id: selectedData?.id });
      if (res.data.result) {
        onSuccess();
        onClose();
      }
    } catch (error: any) {
      alert(error.response?.data?.message || "Error al guardar");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-8 rounded-[2.5rem] w-full max-w-md shadow-2xl">
        <h2 className="text-2xl font-black text-gray-800 mb-2">{selectedData ? 'Editar' : 'Configurar'} Horario</h2>
        <p className="text-gray-500 text-sm mb-6">Define la hora de apertura y cierre del local.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-black uppercase text-gray-400 ml-1">Hora Apertura</label>
              <input
                type="time"
                className="w-full border-2 border-gray-100 p-3 rounded-2xl focus:border-orange-500 outline-none transition-all font-bold text-gray-700"
                value={formData.horini}
                onChange={(e) => setFormData({...formData, horini: e.target.value})}
              />
            </div>
            <div>
              <label className="text-xs font-black uppercase text-gray-400 ml-1">Hora Cierre</label>
              <input
                type="time"
                className="w-full border-2 border-gray-100 p-3 rounded-2xl focus:border-orange-500 outline-none transition-all font-bold text-gray-700"
                value={formData.horfin}
                onChange={(e) => setFormData({...formData, horfin: e.target.value})}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-400 font-bold hover:text-gray-600 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-orange-500 text-white rounded-2xl font-bold shadow-lg shadow-orange-200 hover:bg-orange-600 transition-all"
            >
              Guardar Configuración
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}