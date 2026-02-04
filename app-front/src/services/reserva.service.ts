import api from "@/lib/api";
import { ReservaCreateRequest } from "@/interface/reserva.interface";

// Crear reserva
export async function crearReserva(
  data: ReservaCreateRequest
) {
  try {
    const res = await api.post("/reservas", data);
    return res.data;
  } catch (error: any) {

    // Conflicto (regla de negocio)
    if (error.response?.status === 409) {
      throw new Error(
        error.response.data?.message ||
        "Conflicto: ya existe una reserva para esa franja"
      );
    }

    // Error general
    throw new Error("Error al crear la reserva");
  }
}
