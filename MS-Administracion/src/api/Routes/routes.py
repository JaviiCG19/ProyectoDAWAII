# Importamos los COMPONENTES
from ..Components.local_component import LocalComponent
from ..Components.mesa_component import MesaComponent
from ..Components.franja_component import FranjaComponent
from ..Components.promocion_component import PromocionComponent
from ..Components.dashboard_component import DashboardComponent
from ..Components.empresa_component import EmpresaComponent


def load_routes(api):

    # 1. RUTAS DE GERENCIA (Dueños de Restaurante / Cuentas Maestras)

    # Dashboard y Reportes de la Empresa
    api.add_resource(DashboardComponent, '/gerente/dashboard')

    # Gestión de la Entidad Legal
    api.add_resource(EmpresaComponent, '/gerente/empresa')

    # Gestión de Sucursales (Solo el Gerente crea/borra sucursales)
    api.add_resource(LocalComponent,
                     '/gerente/sucursales',
                     '/gerente/sucursales/<int:id>',
                     '/gerente/sucursales/restaurar/<int:id>')

    # 2. RUTAS DE SUCURSAL (Administradores de Local)
    # Horarios, promociones y mesas son manejados por el admin del local.

    # Gestión de Mesas por Sucursal
    api.add_resource(MesaComponent,
                     '/sucursal/mesas',
                     '/sucursal/mesas/<int:id>',
                     '/sucursal/mesas/restaurar/<int:id>')

    # Gestión de Franjas Horarias (Configuración de Reservas)
    api.add_resource(FranjaComponent,
                     '/sucursal/horarios',
                     '/sucursal/horarios/<int:id>',
                     '/sucursal/horarios/restaurar/<int:id>')

    # Gestión de Promociones Vigentes
    api.add_resource(PromocionComponent,
                     '/sucursal/promociones',
                     '/sucursal/promociones/<int:id>')

    # Endpoint utilitario para selectores/combos en el Front
    api.add_resource(LocalComponent, '/sucursal/listado-sucursales', endpoint='list_sucursales')