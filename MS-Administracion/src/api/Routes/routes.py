# Importamos los COMPONENTES (Resources), no los Services
from ..Components.local_component import LocalComponent
from ..Components.mesa_component import MesaComponent
from ..Components.franja_component import FranjaComponent


def load_routes(api):
    # Rutas para ADM-R01 y ADM-R02 (Locales)
    api.add_resource(LocalComponent, '/admin/locales')

    # Alexander necesita esta para listar sucursales en Reservas
    # Usamos el mismo componente pero con otro endpoint
    api.add_resource(LocalComponent, '/admin/sucursales/list', endpoint='list_sucursales')

    # Rutas para ADM-R03 (Mesas)
    # Agregamos la opción de pasar el ID del local por URL
    api.add_resource(MesaComponent, '/admin/mesas', '/admin/mesas/<int:id_local>')

    # Rutas para ADM-R05 (Franjas Horarias)
    api.add_resource(FranjaComponent, '/admin/franjas', '/admin/franjas/<int:id_local>')