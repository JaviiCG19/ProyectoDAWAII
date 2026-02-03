export interface Usuario {
  id: number;
  nombre: string;
  detalle: string;
  roles: string;
  rol_prioritario: number;
  id_res: number | null;
  id_local: number | null;
  respuesta?: string;
}
