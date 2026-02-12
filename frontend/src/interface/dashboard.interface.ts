export interface DashboardStats {
  totalVentas: number;
  reservasHoy: number;
  clientesNuevos: number;
  ocupacionPromedio: number;
}

export interface LocalResumen {
  idlocal: number;
  nombre: string;
  ingresosHoy: number;
  estado: "Activo" | "Inactivo";
}
