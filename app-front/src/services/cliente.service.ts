
import api from "@/lib/api";

export async function getClientes(skip = 0, limit = 50) {
  const res = await api.get("/clientes/list", {
    params: { skip, limit },
  });

  return res.data?.data || [];
}


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
