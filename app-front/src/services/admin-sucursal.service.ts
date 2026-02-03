import api from "./api";
import { Franja, Promocion } from "@/interface/admin.interface";

//FRANJAS

export const getFranjasByLocal = async (idLocal: string) => {
  const res = await api.get(`/admin/franjas?idlocal=${idLocal}`);
  return res.data?.data || [];
};

export const saveFranja = async (data: Partial<Franja>) => {
  return data.id 
    ? await api.put(`/admin/franjas/${data.id}`, data)
    : await api.post(`/admin/franjas`, data);
};

export const deleteFranja = async (id: number) => {
  return await api.delete(`/admin/franjas/${id}`);
};

export const getFranjasEliminadas = async (idLocal: string) => {
  const res = await api.get(`/admin/franjas/eliminadas?idlocal=${idLocal}`);
  return res.data?.data || [];
};

export const restaurarFranja = async (id: number) => {
  return await api.post(`/admin/franjas/restaurar/${id}`, {});
};


//PROMOCIONES

export const getPromocionesByLocal = async (idLocal: string) => {
  const res = await api.get(`/admin/promociones?idlocal=${idLocal}`);
  return res.data?.data || [];
};

export const savePromocion = async (data: Partial<Promocion>) => {
  return data.id 
    ? await api.put(`/admin/promociones/${data.id}`, data)
    : await api.post(`/admin/promociones`, data);
};

export const deletePromocion = async (id: number) => {
  return await api.delete(`/admin/promociones/${id}`);
};

export const getPromocionesEliminadas = async (idLocal: string) => {
  const res = await api.get(`/admin/promociones/eliminadas?idlocal=${idLocal}`);
  return res.data?.data || [];
};

export const restaurarPromocion = async (id: number) => {
  return await api.post(`/admin/promociones/restaurar/${id}`, {});
};