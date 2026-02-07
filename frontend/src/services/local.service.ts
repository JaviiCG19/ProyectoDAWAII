import api from "./api";
import { Sucursal } from "@/interface/Sucursal";


export async function getSucursalesByEmpresa(idcia: number): Promise<Sucursal[]> {
  const res = await api.get(`/admin/locales`, { params: { idcia } });
  return res.data.result ? res.data.data : [];
}


export async function crearSucursal(data: Sucursal) {
  const res = await api.post("/admin/locales", data);
  return res.data;
}

export async function actualizarSucursal(id: number, data: Partial<Sucursal>) {
  const res = await api.put(`/admin/locales/${id}`, data);
  return res.data;
}

export async function eliminarSucursal(id: number) {
  const res = await api.delete(`/admin/locales/${id}`);
  return res.data;
}

export async function getSucursalesEliminadas(idcia: number) {
  const res = await api.get(`/admin/locales`, { params: { idcia, eliminados: true } });
  return res.data;
}

export async function restaurarSucursal(id: number) {
  const res = await api.post(`/admin/locales/restaurar/${id}`);
  return res.data;
}