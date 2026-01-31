"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import {
  Plus,
  Trash2,
  Edit,
  Users,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { Sucursal } from "@/interface/Sucursal";

export default function SucursalesPage() {
  const { id } = useParams();
  const router = useRouter();

  const [sucursales, setSucursales] = useState<Sucursal[]>([
    {
      id: 1,
      detalle: "Sucursal Centro",
      direccion: "Av. Principal 123",
      totmesas: 20,
    },
    {
      id: 2,
      detalle: "Sucursal Norte",
      direccion: "Calle 10 y Av. 5",
      totmesas: 15,
    },
  ]);

  const eliminarSucursal = (id: number) => {
    setSucursales((prev) =>
      prev.filter((s) => s.id !== id)
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
            Sucursales del Restaurante #{id}
          </h1>
        </div>

        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#dc902b] text-white">
          <Plus size={18} />
          Añadir sucursal
        </button>
      </div>

      {sucursales.length === 0 ? (
        <p className="text-gray-500">
          No hay sucursales registradas
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sucursales.map((s) => (
            <div
              key={s.id}
              className="bg-white rounded-2xl shadow-md p-5 space-y-4"
            >
              <div>
                <h3 className="text-lg font-semibold">
                  {s.detalle}
                </h3>
                <p className="text-sm text-gray-600">
                  {s.direccion}
                </p>
                <p className="text-sm text-gray-500">
                  Mesas: {s.totmesas}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  className="p-2 rounded-lg border hover:bg-gray-100"
                  title="Editar sucursal"
                >
                  <Edit size={18} />
                </button>

                <button
                  onClick={() => eliminarSucursal(s.id)}
                  className="p-2 rounded-lg border hover:bg-gray-100"
                  title="Eliminar sucursal"
                >
                  <Trash2 size={18} />
                </button>

                <Link
                href={`/admin/restaurantes/${id}/sucursales/${s.id}/personal`}
                className="p-2 rounded-lg border hover:bg-gray-100"
                title="Gestionar personal"
                >
                <Users size={18} />
                </Link>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
