"use client";

import { useState } from "react";
import { Restaurante } from "@/interface/Restaurante";
import { Sucursal } from "@/interface/Sucursal";

interface Props {
  onClose: () => void;
  onSave: (data: Restaurante) => void;
}

export default function AddRestaurantModal({ onClose, onSave }: Props) {
  const [nomleg, setNomleg] = useState("");
  const [nomfan, setNomfan] = useState("");
  const [ruc, setRuc] = useState("");

  const [sucursales, setSucursales] = useState<Sucursal[]>([
    { id: 1, detalle: "", direccion: "", totmesas: 0 },
  ]);

  const addSucursal = () => {
    setSucursales([
      ...sucursales,
      {
        id: Date.now(),
        detalle: "",
        direccion: "",
        totmesas: 0,
      },
    ]);
  };

  const updateSucursal = (
    id: number,
    field: keyof Sucursal,
    value: string | number
  ) => {
    setSucursales((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, [field]: value } : s
      )
    );
  };

  const handleSave = () => {
    const nuevo: Restaurante = {
      id: Date.now(),
      nomleg,
      nomfan,
      ruc,
      fecact: new Date().toISOString().split("T")[0],
      estado: 1,
      sucursales,
    };

    onSave(nuevo);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-3xl space-y-6">

        <h2 className="text-xl font-bold text-[#dc902b]">
          Añadir Restaurante
        </h2>

        
        <div className="grid grid-cols-2 gap-4">
          <input
            placeholder="Nombre legal"
            value={nomleg}
            onChange={(e) => setNomleg(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            placeholder="Nombre comercial"
            value={nomfan}
            onChange={(e) => setNomfan(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            placeholder="RUC"
            value={ruc}
            onChange={(e) => setRuc(e.target.value)}
            className="border p-2 rounded col-span-2"
          />
        </div>

       
        <div className="space-y-4">
          <h3 className="font-semibold">Sucursales</h3>

          {sucursales.map((s) => (
            <div key={s.id} className="grid grid-cols-3 gap-3">
              <input
                placeholder="Sucursal"
                value={s.detalle}
                onChange={(e) =>
                  updateSucursal(s.id, "detalle", e.target.value)
                }
                className="border p-2 rounded"
              />
              <input
                placeholder="Dirección"
                value={s.direccion}
                onChange={(e) =>
                  updateSucursal(s.id, "direccion", e.target.value)
                }
                className="border p-2 rounded"
              />
              <input
                type="number"
                placeholder="Mesas"
                value={s.totmesas}
                onChange={(e) =>
                  updateSucursal(s.id, "totmesas", Number(e.target.value))
                }
                className="border p-2 rounded"
              />
            </div>
          ))}

          <button
            onClick={addSucursal}
            className="text-sm text-[#dc902b] font-semibold"
          >
            + Añadir sucursal
          </button>
        </div>

        
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="border px-4 py-2 rounded">
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="bg-[#dc902b] text-white px-4 py-2 rounded"
          >
            Guardar
          </button>
        </div>

      </div>
    </div>
  );
}
