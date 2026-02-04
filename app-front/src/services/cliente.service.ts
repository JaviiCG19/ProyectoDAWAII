
import api from "@/lib/api";

export async function getClientes(skip = 0, limit = 50) {
  const res = await api.get("/clientes/list", {
    params: { skip, limit },
  });

  return res.data?.data || [];
}
