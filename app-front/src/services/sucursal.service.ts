
import api from "@/lib/api";

export const getFranjasByLocal = async (idlocal: number): Promise<any[]> => {
  try {
    const response = await api.get(`/admin/franjas/local/${idlocal}`);
    
   
    if (response.data?.result === true) {
      return response.data.data || [];
    } else {
      console.warn("Respuesta no exitosa:", response.data?.message);
      return [];
    }
  } catch (error: any) {
    console.error("Error al cargar franjas por local:", error);
  
    return [];
  }
};