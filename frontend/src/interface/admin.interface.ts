export interface Franja {
  id: number;
  idlocal: number;
  diasem: number; 
  horini: string;
  horfin: string;
  tipres: number;
  estado: number;
}

export interface Promocion {
  id: number;
  idlocal: number;
  nombre: string;
  descripcion: string;
  descuento: number;
  fec_inicio: string;
  fec_fin: string;
}