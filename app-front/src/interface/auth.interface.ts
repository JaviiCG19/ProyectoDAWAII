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
