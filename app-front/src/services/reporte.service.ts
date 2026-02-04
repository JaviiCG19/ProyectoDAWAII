import api from "@/lib/api";
import {
  ReportePorPeriodo,
  TopCliente,
  UsoMesa,
  TasasAsistencia,
  ReporteFranja,
} from "@/interface/reporte.interface";

// 1. Reporte de reservas por período (POST)
export const getReportePorPeriodo = async (
  fecha_inicio: string,
  fecha_fin: string
): Promise<ReportePorPeriodo[]> => {
  try {
    const res = await api.post("/reportes/periodo", { fecha_inicio, fecha_fin });
    const data = res.data.data;
    // Como tu Back devuelve un objeto único del periodo, lo convertimos a Array para el .map
    return Array.isArray(data) ? data : data ? [data] : [];
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error en reporte periodo");
  }
};

// 2. Top clientes (GET)
export const getTopClientes = async (limit: number = 10): Promise<TopCliente[]> => {
  try {
    const res = await api.get("/reportes/top-clientes", { params: { limite: limit } });
    return res.data.data || [];
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error en top clientes");
  }
};

// 3. Uso y ocupación de mesas (GET)
export const getUsoMesas = async (): Promise<UsoMesa[]> => {
  try {
    const res = await api.get("/reportes/uso-mesas");
    return res.data.data || [];
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error en uso mesas");
  }
};

// 4. Tasas de asistencia (POST)
export const getTasasAsistencia = async (
  fecha_inicio: string,
  fecha_fin: string
): Promise<TasasAsistencia> => {
  try {
    const res = await api.post("/reportes/tasas", { fecha_inicio, fecha_fin });
    return res.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error en tasas");
  }
};

// 5. Reservas por franja horaria (GET)
export const getReservasPorFranja = async (): Promise<ReporteFranja[]> => {
  try {
    const res = await api.get("/reportes/franjas");
    return res.data.data || [];
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error en franjas");
  }
};