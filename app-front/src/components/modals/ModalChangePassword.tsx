"use client";

import { useState } from "react";
import { X, KeyRound } from "lucide-react";
import { changePassword } from "@/services/recovery.service";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ModalChangePassword({
  open,
  onClose,
  onSuccess,
}: Props) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async () => {
    setError("");

    const usr_id = localStorage.getItem("usr_id");

    if (!usr_id) {
      setError("Usuario no identificado");
      return;
    }

    try {
      setLoading(true);

      const res = await changePassword({
        usr_id: Number(usr_id),
        old_password: oldPassword,
        new_password: newPassword,
      });

      if (!res.result) {
        setError(res.message);
        return;
      }

      
      onSuccess();
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      console.error(err);
      setError("Error inesperado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2 font-semibold text-gray-800">
            <KeyRound size={18} />
            Cambiar contraseña
          </div>
          <button onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <input
          type="password"
          placeholder="Contraseña actual"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          className="w-full mb-3 border rounded-lg px-3 py-2"
        />

        <input
          type="password"
          placeholder="Nueva contraseña"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full mb-3 border rounded-lg px-3 py-2"
        />

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-lg">
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg disabled:opacity-60"
          >
            {loading ? "Actualizando..." : "Actualizar"}
          </button>
        </div>
      </div>
    </div>
  );
}
