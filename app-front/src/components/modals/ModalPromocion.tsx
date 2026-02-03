"use client";
import { useState, useEffect } from "react";
import { Promocion } from "@/interface/admin.interface";
import { savePromocion } from "@/services/admin-sucursal.service";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  idLocal: number;
  selectedData?: Promocion | null;
}

export default function ModalPromocion({ isOpen, onClose, onSuccess, idLocal, selectedData }: Props) {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    descuento: 5,
    fec_inicio: new Date().toISOString().split('T')[0],
    fec_fin: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (selectedData) setFormData({ ...selectedData });
  }, [selectedData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await savePromocion({ ...formData, idlocal: idLocal, id: selectedData?.id });
      if (res.data.result) {
        onSuccess();
        onClose();
      }
    } catch (error: any) {
      alert(JSON.stringify(error.response?.data?.message) || "Error al guardar");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-3xl w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">{selectedData ? 'Editar' : 'Nueva'} Promoción</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input placeholder="Nombre de la promo" className="w-full border p-2 rounded-xl" value={formData.nombre} onChange={(e) => setFormData({...formData, nombre: e.target.value})} required />
          <textarea placeholder="Descripción" className="w-full border p-2 rounded-xl" value={formData.descripcion} onChange={(e) => setFormData({...formData, descripcion: e.target.value})} />
          <div>
            <label className="text-sm font-bold">Descuento (%)</label>
            <input type="number" step="0.01" className="w-full border p-2 rounded-xl" value={formData.descuento} onChange={(e) => setFormData({...formData, descuento: parseFloat(e.target.value)})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-bold">Inicia</label>
              <input type="date" className="w-full border p-2 rounded-xl" value={formData.fec_inicio} onChange={(e) => setFormData({...formData, fec_inicio: e.target.value})} />
            </div>
            <div>
              <label className="text-sm font-bold">Termina</label>
              <input type="date" className="w-full border p-2 rounded-xl" value={formData.fec_fin} onChange={(e) => setFormData({...formData, fec_fin: e.target.value})} />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-500">Cancelar</button>
            <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold">Crear Promo</button>
          </div>
        </form>
      </div>
    </div>
  );
}