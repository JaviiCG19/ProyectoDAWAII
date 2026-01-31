"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import {
  Plus,
  Trash2,
  Edit,
  ArrowLeft,
  UserCog,
} from "lucide-react";
import { Personal } from "@/interface/Personal";

export default function PersonalPage() {
  const { id, sucursalId } = useParams();
  const router = useRouter();

  const [personal, setPersonal] = useState<Personal[]>([
    {
      id: 1,
      nombre: "Juan Pérez",
      usuario: "jperez",
      rol: "ADMIN_SUCURSAL",
      activo: true,
    },
    {
      id: 2,
      nombre: "María López",
      usuario: "mlopez",
      rol: "RECEPCIONISTA",
      activo: true,
    },
    {
      id: 3,
      nombre: "Carlos Ruiz",
      usuario: "cruiz",
      rol: "MESERO",
      activo: false,
    },
  ]);

  const eliminar = (id: number) => {
    setPersonal((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, activo: false } : p
      )
    );
  };

  const restaurar = (id: number) => {
    setPersonal((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, activo: true } : p
      )
    );
  };

  return (
    <div className="space-y-8">

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-lg border"
          >
            <ArrowLeft size={18} />
          </button>

          <h1 className="text-2xl font-bold text-[#dc902b]">
            Personal – Sucursal #{sucursalId}
          </h1>
        </div>

        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#dc902b] text-white">
          <Plus size={18} />
          Añadir personal
        </button>
      </div>

      {/* LISTADO */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {personal.map((p) => (
          <div
            key={p.id}
            className={`bg-white rounded-2xl shadow-md p-5 space-y-3 ${
              !p.activo && "opacity-50"
            }`}
          >
            <div>
              <h3 className="font-semibold">{p.nombre}</h3>
              <p className="text-sm text-gray-600">
                Usuario: {p.usuario}
              </p>
              <p className="text-sm text-gray-500">
                Rol: {p.rol}
              </p>
            </div>

            <div className="flex gap-2">
              <button className="p-2 border rounded-lg">
                <Edit size={18} />
              </button>

              {p.activo ? (
                <button
                  onClick={() => eliminar(p.id)}
                  className="p-2 border rounded-lg"
                >
                  <Trash2 size={18} />
                </button>
              ) : (
                <button
                  onClick={() => restaurar(p.id)}
                  className="p-2 border rounded-lg bg-green-600 text-white"
                >
                  Restaurar
                </button>
              )}

              <button
                className="p-2 border rounded-lg"
                title="Cambiar rol"
              >
                <UserCog size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
