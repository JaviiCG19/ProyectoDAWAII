import api from "./api";

export const changePassword = async (data: { 
  usr_id: number; 
  old_password: string; 
  new_password: string; 
}) => {
  try {
    const res = await api.post("/security/change-password", data);
    return res.data;
  } catch (error: any) {
    return error.response?.data || { result: false, message: "Error al cambiar contraseña" };
  }
};


export const resetPassword = async (data: { 
  usr_nombre: string; 
  usr_respuesta: string; 
  new_password: string; 
}) => {
  try {
    const cleanData = {
      ...data,
      usr_respuesta: data.usr_respuesta.toLowerCase().trim()
    };
    const res = await api.post("/security/reset-password", cleanData);
    return res.data;
  } catch (error: any) {
    return error.response?.data || { result: false, message: "Error al restablecer contraseña" };
  }
};