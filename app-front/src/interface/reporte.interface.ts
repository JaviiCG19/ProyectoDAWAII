

export interface ReportePorPeriodo {
  total_reservas: number; 
  pendientes: number;
  confirmadas: number;
  canceladas: number;
  checkin: number;
  noshow: number;
  total_personas: number;
  fecha?: string; 
}

export interface TopCliente {
  id: number;
  nombre: string;
  ruc_cc: string;
  telefono: string;
  total_reservas: number;
  total_personas: number;
}

export interface UsoMesa {
  id: number;       // Antes tenías idmesa
  numero: string;   // Asegúrate de incluir esto
  maxper: number;
  total_reservas: number;
  confirmadas: number;
  canceladas: number;
  noshow: number;   // Tu SQL lo devuelve sin guion bajo
}

export interface TasasAsistencia {
  total_reservas: number;
  confirmadas: number;
  canceladas: number;
  no_show: number;
  porcentaje_no_show: number;
  porcentaje_canceladas: number;
}

export interface ReporteFranja {
  franja_id: number;
  total_reservas: number;
}