import api from "./api";
import { Restaurante } from "@/interface/Restaurante";

export async function getEmpresas(): Promise<Restaurante[]> {
  const res = await api.get("/admin/empresas");
  return res.data.result ? res.data.data : [];
}

export async function crearEmpresa(data: Partial<Restaurante>) {
  const res = await api.post("/admin/empresas", data);
  return res.data;
}

export async function actualizarEmpresa(id: number, data: Partial<Restaurante>) {
  const res = await api.put(`/admin/empresas/${id}`, data);
  return res.data;
}

export async function eliminarEmpresa(id: number) {
  const res = await api.delete(`/admin/empresas/${id}`);
  return res.data;
}

export async function getEmpresasEliminadas(): Promise<Restaurante[]> {
  const res = await api.get("/admin/empresas", {
    params: {
      eliminados: true
    }
  });
  return res.data.result ? res.data.data : [];
}


export async function restaurarEmpresa(id: number) {
  const res = await api.post(`/admin/empresas/restaurar/${id}`);
  return res.data;
}