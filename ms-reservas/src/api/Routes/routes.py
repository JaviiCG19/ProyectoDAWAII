from ..Services.cliente_service import (ClienteCreateService, ClienteListService,
                                        ClienteDetailService)
from ..Services.reserva_service import (ReservaCreateService, ReservaListService,
                                        ReservaDetailService, ReservaConfirmarService,
                                        ReservaCancelarService, ReservaCheckinService,
                                        ReservaNoShowService)
from ..Services.mesa_service import MesaDisponibleService, MesaListService
from ..Services.anticipo_service import AnticipoCreateService, AnticipoReservaService
from ..Services.reporte_service import (ReportePeriodoService, ReporteTopClientesService,
                                       ReporteUsoMesasService, ReporteTasasService,
                                       ReporteFranjasService)
from ..Services.franja_service import FranjaListService

def load_routes(api):

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
    api.add_resource(MesaListService, '/mesas/list')

    # Rutas de anticipos
    api.add_resource(AnticipoCreateService, '/anticipos')
    api.add_resource(AnticipoReservaService, '/anticipos/reserva/<int:idreserva>')

    # Rutas de reportes
    api.add_resource(ReportePeriodoService, '/reportes/periodo')
    api.add_resource(ReporteTopClientesService, '/reportes/top-clientes')
    api.add_resource(ReporteUsoMesasService, '/reportes/uso-mesas')
    api.add_resource(ReporteTasasService, '/reportes/tasas')
    api.add_resource(ReporteFranjasService, '/reportes/franjas')

    # Rutas de franjas horarias
    api.add_resource(FranjaListService, '/franjas/local/<int:idlocal>')