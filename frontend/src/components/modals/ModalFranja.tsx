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
    diasem: 1,
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-3xl w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{selectedData ? 'Editar' : 'Nueva'} Franja Horaria</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-bold">Día de la semana</label>
            <select 
              className="w-full border p-2 rounded-xl"
              value={formData.diasem}
              onChange={(e) => setFormData({...formData, diasem: parseInt(e.target.value)})}
            >
              {["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"].map((d, i) => (
                <option key={i} value={i}>{d}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-bold">Hora Inicio</label>
              <input type="time" className="w-full border p-2 rounded-xl" value={formData.horini} onChange={(e) => setFormData({...formData, horini: e.target.value})} />
            </div>
            <div>
              <label className="text-sm font-bold">Hora Fin</label>
              <input type="time" className="w-full border p-2 rounded-xl" value={formData.horfin} onChange={(e) => setFormData({...formData, horfin: e.target.value})} />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-500">Cancelar</button>
            <button type="submit" className="px-6 py-2 bg-orange-500 text-white rounded-xl font-bold">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
}