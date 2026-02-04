import api from "@/lib/api";
import { ReservaCreateRequest } from "@/interface/reserva.interface";



export async function crearReserva(
  data: ReservaCreateRequest
) {
  try {
    const res = await api.post("/reservas", data);
    return res.data;
  } catch (error: any) {

    if (error.response?.status === 409) {
      throw new Error(
        error.response.data?.message ||
        "Conflicto: ya existe una reserva para esa franja"
      );
    }


    throw new Error("Error al crear la reserva");
  }
}



export const buscarUltimaReservaCreada = async (
  idlocal: number,
  idcliente: number,
  fecha: string,
  franja_id: number,
  numper: number
) => {
  try {
    const res = await api.get("/reservas/list"); 

    const reservas = res.data?.data || [];

    const ultima = reservas.find((r: any) => 
      r.idlocal === idlocal &&
      r.idcliente === idcliente &&
      r.fecha === fecha &&
      r.franja_id === franja_id &&
      r.numper === numper &&
      r.estado === 0 
    );

    return ultima || null;
  } catch (error) {
    console.error("Error buscando última reserva:", error);
    return null;
  }
};



export const listarReservasActivas = async () => {
  try {
    const res = await api.get("/reservas/list");
    
    return res.data?.data || res.data || [];
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al listar reservas");
  }
};


export const confirmarReserva = async (reservaId: number) => {
  try {
    const res = await api.put(`/reservas/${reservaId}/confirmar`);
    return res.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "No se pudo confirmar la reserva"
    );
  }
};


export const cancelarReserva = async (reservaId: number) => {
  try {
    const res = await api.put(`/reservas/${reservaId}/cancelar`);
    return res.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "No se pudo cancelar la reserva"
    );
  }
};








export const checkInReserva = async (reservaId: number) => {
  try {
    const res = await api.put(`/reservas/${reservaId}/checkin`);
    return res.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "No se pudo realizar el check-in"
    );
  }
};



export const marcarNoShow = async (reservaId: number) => {
  try {
    const res = await api.put(`/reservas/${reservaId}/noshow`);
    return res.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "No se pudo marcar como no-show"
    );
  }
};