import api from "./api";

export const getUsuarios = async () => {
  const res = await api.get("/user");
  return res.data.result ? res.data.data : [];
};

export const crearUsuario = async (userData: any) => {
  const res = await api.post("/user", userData);
  return res.data;
};

export const actualizarUsuario = async (userData: any) => {
  const res = await api.put("/user", userData);
  return res.data;
};

export const eliminarUsuario = async (id: number) => {
  const res = await api.delete("/user", { data: { usr_id: id } });
  return res.data;
};