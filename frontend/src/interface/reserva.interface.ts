// Interface para crear una reserva
export interface ReservaCreateRequest {
  idlocal: number;
  idmesa?: number | null;
  idcliente: number;
  fecha: string;
  franja_id: number;
  numper: number;
}

// Interface de una reserva (respuesta del backend)
export interface Reserva {
  id: number;
  idlocal: number;
  idmesa: number | null;
  idcliente: number;
  fecha: string;
  franja_id: number;
  numper: number;
  estado: number;
  fecact: string;
}


export interface ReservaDetalle {
  id: number;
  idcliente: number | string;
  fecha: string;
  franja_id: number;
  numper: number;
  idmesa?: number | string;
  estado: number;
  nombreCliente?: string;
}
