import api from "@/lib/api";
import { ReportePorPeriodo, TopCliente, UsoMesa, TasasAsistencia, ReporteFranja
          } from "@/interface/reporte.interface";


// 1. Reporte de reservas por período 
export const getReportePorPeriodo = async (
    fecha_inicio: string,
    fecha_fin: string
): Promise<ReportePorPeriodo[]> => {
  try {
    const res = await api.get("/reservas/reportes/periodo", {
      params: {
        inicio: fecha_inicio,
        fin: fecha_fin,
      },
    });
    const data = res.data.data;
    return Array.isArray(data) ? data : data ? [data] : [];
  } catch (error: any) {
    const status = error.response?.status;
    const msg = error.response?.data?.message || "Error al obtener reporte por período";
    console.error("Detalle error en reporte por período:", status, msg, error.response?.data);
    throw new Error(msg);
  }
};


// 2. Top clientes con más reservas
export const getTopClientes = async (limit: number = 10): Promise<TopCliente[]> => {
   try {
        const res = await api.get("/reservas/reportes/top-clientes", {
         params: { limit },
      });
      return res.data.data || [];
   } catch (error: any) {
       const msg = error.response?.data?.message || "Error al obtener top clientes";
      console.error("Detalle error:", error.response?.status, msg);
     throw new Error(msg);
   }
};

// 3. Uso y ocupación de mesas
export const getUsoMesas = async (): Promise<UsoMesa[]> => {
  try {
    const res = await api.get("/reservas/reportes/uso-mesas");
    return res.data.data || [];
  } catch (error: any) {
    const msg = error.response?.data?.message || "Error al obtener uso de mesas";
    console.error("Detalle error:", error.response?.status, msg);
    throw new Error(msg);
  }
};


// 4 Reporte por Tasa de Asistencia
export const getTasasAsistencia = async (
  fecha_inicio: string,
  fecha_fin: string
): Promise<TasasAsistencia> => {
  try {
    const res = await api.get("/reservas/reportes/tasas", {
      params: {
        inicio: fecha_inicio,
        fin: fecha_fin,
      },
    });
    return res.data.data;
  } catch (error: any) {
    const status = error.response?.status;
    const msg = error.response?.data?.message || "Error al obtener tasas";
    console.error("Detalle error en tasas:", status, msg, error.response?.data);
    throw new Error(msg);
  }
};

// 5. Reservas por franja horaria
export const getReservasPorFranja = async (): Promise<ReporteFranja[]> => {
  try {
    const res = await api.get("/reportes/franjas");
    return res.data.data || [];
  } catch (error: any) {
    const msg = error.response?.data?.message || "Error al obtener reservas por franja";
    console.error("Detalle error:", error.response?.status, msg);
    throw new Error(msg);
  }
};

