import api from "@/lib/api";

export interface AnticipoCreateRequest {
  idreserva: number;
  monto: number;
}

export const registrarAnticipo = async (data: AnticipoCreateRequest) => {
  try {
    const res = await api.post("/reservas/anticipos", data);
    return res.data;
  } catch (error: any) {
    if (error.response?.status === 400) {
      throw new Error(error.response.data?.message || "Datos inválidos");
    }
    throw new Error("Error al registrar el anticipo");
  }
};


export const agregarAnticipo = async ({
  reservaId,
  monto,
}: {
  reservaId: number;
  monto: number;
}) => {
  try {
    const res = await api.post("/reservas/anticipos", {
      idreserva: reservaId,
      monto
    });
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al agregar anticipo");
  }
};



export const getAnticipoByReserva = async (idreserva: number) => {
  try {
    const res = await api.get(`/reservas/anticipos/reserva/${idreserva}`);
    return res.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null; // No hay anticipo
    }
    throw error;
  }
};