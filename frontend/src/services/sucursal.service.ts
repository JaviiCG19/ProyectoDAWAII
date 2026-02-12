import api from "./api";


/*
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
};*/



export const getFranjasByLocal = async (idlocal: number): Promise<any[]> => {
  try {
    const response = await api.get(`/reservas/franjas/local/${idlocal}`);

    const resData = response.data;

   
    if (resData?.success === true || resData?.result === true) {
      return resData.data || [];
    }

    if (Array.isArray(resData)) {
      return resData;
    }

    console.warn("Respuesta no exitosa al cargar franjas:", resData?.message || resData);
    return [];

  } catch (error: any) {
    console.error(`Error al obtener franjas del local ${idlocal}:`, error);

    if (error.response) {
      console.warn("Respuesta del servidor:", error.response.data);
      if (error.response.status === 404) {
        return [];
      }
    }

    return [];
  }
};