from ..Services.cliente_service import (ClienteCreateService, ClienteListService,
                                        ClienteDetailService)
from ..Services.reserva_service import (ReservaCreateService, ReservaListService,
                                        ReservaDetailService, ReservaConfirmarService,
                                        ReservaCancelarService, ReservaCheckinService,
                                        ReservaNoShowService)
from ..Services.mesa_service import MesaDisponibleService
from ..Services.anticipo_service import AnticipoCreateService, AnticipoReservaService


def load_routes(api):
    """
    Carga todas las rutas de la API
    """
    # Rutas de clientes
    api.add_resource(ClienteCreateService, '/clientes')
    api.add_resource(ClienteListService, '/clientes/list')
    api.add_resource(ClienteDetailService, '/clientes/<int:cliente_id>')

    # Rutas de reservas
    api.add_resource(ReservaCreateService, '/reservas')
    api.add_resource(ReservaListService, '/reservas/list')
    api.add_resource(ReservaDetailService, '/reservas/<int:reserva_id>')
    api.add_resource(ReservaConfirmarService, '/reservas/<int:reserva_id>/confirmar')
    api.add_resource(ReservaCancelarService, '/reservas/<int:reserva_id>/cancelar')
    api.add_resource(ReservaCheckinService, '/reservas/<int:reserva_id>/checkin')
    api.add_resource(ReservaNoShowService, '/reservas/<int:reserva_id>/noshow')

    # Rutas de mesas
    api.add_resource(MesaDisponibleService, '/mesas/disponibles/<string:fecha>')

    # Rutas de anticipos
    api.add_resource(AnticipoCreateService, '/anticipos')
    api.add_resource(AnticipoReservaService, '/anticipos/reserva/<int:idreserva>')