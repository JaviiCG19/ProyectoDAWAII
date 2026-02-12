import api from "@/lib/api";
import { Cliente } from "@/interface/cliente.interface";  

// cliente.service.ts (ajusta el nombre si es diferente)

export const getClientes = async (idLocal: number, skip = 0, limit = 50): Promise<Cliente[]> => {
  try {
    const url = `/reservas/clientes/list?idlocal=${idLocal}&skip=${skip}&limit=${limit}`;
    const res = await api.get(url);
    return res.data?.data || res.data || [];
  } catch (error: any) {
    console.error("Error al obtener clientes:", error);
    throw new Error(error.response?.data?.message || "No se pudieron cargar los clientes");
  }
}


/*
export async function getClientes(skip = 0, limit = 50) {
  const res = await api.get("/reservas/clientes/list", {
    params: { skip, limit },
  });

  return res.data?.data || [];
}
*/






// Nueva función: contar nuevos clientes del día actual
export function contarNuevosClientesHoy(clientes: any[]): number {
  if (!clientes || clientes.length === 0) return 0;

  // Obtenemos la fecha de hoy en formato YYYY-MM-DD
  const hoy = new Date().toISOString().split("T")[0];

  return clientes.filter((cliente) => {
    // fecing puede venir como "2026-02-05" o "2026-02-05T00:00:00"
    const fechaIngreso = cliente.fecing?.split("T")?.[0] || "";
    return fechaIngreso === hoy;
  }).length;
}
