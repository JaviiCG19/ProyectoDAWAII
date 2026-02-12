import api from "./api";
import { Mesa } from "@/interface/mesa.interface";

export const getMesasByLocal = async (idLocal: string | number | undefined): Promise<Mesa[]> => {
  if (!idLocal || idLocal === "undefined") return [];

  try {
    const res = await api.get(`/admin/mesas?idlocal=${idLocal}`);
    if (res.data && res.data.data) {
      return res.data.data; 
    }
    
    return res.data ? res.data : [];
  } catch (error) {
    return [];
  }
};




export const MesasByLocal = async (
  idLocal: string | number | undefined,
  inactivas: boolean = false 
): Promise<Mesa[]> => {
  if (!idLocal || idLocal === "undefined") return [];

  try {
    // Construimos la URL con query param si queremos inactivas
    let url = `/admin/mesas?idlocal=${idLocal}`;
    if (inactivas) {
      url += '&inactivas=true';
    }

    const res = await api.get(url);
    if (res.data && res.data.data) {
      return res.data.data; 
    }
    
    return res.data ? res.data : [];
  } catch (error) {
    console.error("Error al obtener mesas:", error);
    return [];
  }
};