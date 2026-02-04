import api from "@/lib/api";
import { DashboardStats, LocalResumen } from "@/interface/dashboard.interface";

export const getDashboardStats = async (
  idRestaurante: number
): Promise<DashboardStats> => {
  const res = await api.get(`/dashboard/gerente/${idRestaurante}`);
  return res.data.data;
};

export const getLocalesResumen = async (
  idRestaurante: number
): Promise<LocalResumen[]> => {
  const res = await api.get(`/dashboard/gerente/${idRestaurante}/locales`);
  return res.data.data;
};
