import api from "./api";

export interface LoginRequest {
  login_user: string;
  login_password: string;
}

export interface LoginResponse {
  token: string;
  user_name: string;
  roles: string[];
  primary_role: string;
}

// 🔑 LOGIN
export async function loginService(
  data: LoginRequest
): Promise<LoginResponse> {
  const res = await api.post("/security/login", data);

  if (!res.data?.data?.token) {
    throw new Error("Credenciales inválidas");
  }

  return res.data.data;
}

export async function validateTokenService(): Promise<boolean> {
  try {
    const res = await api.post("/security/validate");
    return res.data?.data?.is_valid === true;
  } catch {
    return false;
  }
}

// 🚪 LOGOUT
export function logoutService() {
  localStorage.clear();
    window.location.href = "/login";
}
