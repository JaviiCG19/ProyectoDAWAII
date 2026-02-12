export interface ChangePasswordData {
  usr_id: number;
  old_password: string;
  new_password: string;
}

export interface ResetPasswordData {
  usr_nombre: string;
  usr_respuesta: string;
  new_password: string;
}

export interface SecurityResponse {
  result: boolean;
  message: string;
  data?: any;
}