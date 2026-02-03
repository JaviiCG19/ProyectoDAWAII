export interface LoginRequest {
  login_user: string;
  login_password: string;
}

export interface LoginResponse {
  token: string;
  token_exp: number;
  usr_id: number;
  usr_name: string;
  usr_role: string[];
  usr_rolp: number;
  id_res: number | null;
  id_local: number | null;
}
