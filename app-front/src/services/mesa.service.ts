import api from "./api";
import { Mesa } from "@/interface/Mesa.interface";

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