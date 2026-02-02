import api from "./api";
import { LoginRequest, LoginResponse } from "@/interface/auth.interface";

// LOGIN
export async function loginService(
  data: LoginRequest
): Promise<LoginResponse> {

  const res = await api.post("/security/login", data);
  const d = res.data?.data;

  if (!d?.token) {
    throw new Error("Credenciales inválidas");
  }

  return {
    token: d.token,
    usr_id: d.usr_id,
    usr_name: d.usr_name,
    usr_role: d.usr_role,
    usr_rolp: d.usr_rolp,
    id_res: d.id_res ?? null,
    id_local: d.id_local ?? null,
  };
}

// LOGOUT
export function logoutService() {
  localStorage.clear();
  window.location.href = "/login";
}
