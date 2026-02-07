import api from "./api";

export const getFranjasByLocal = async (idlocal: number): Promise<any[]> => {
  try {
    const response = await api.get(`/admin/franjas`, {
      params: { 
        idlocal: idlocal 
      }
    });
    if (response.data?.result === true) {
      return response.data.data || []; 
    } else {
      console.warn("El backend respondió con error:", response.data?.message);
      return [];
    }
  } catch (error: any) {
    console.error("Error de conexión o 500 en el backend:", error);
    return [];
  }
};