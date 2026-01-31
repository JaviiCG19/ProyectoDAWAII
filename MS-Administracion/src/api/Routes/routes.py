# Importamos los COMPONENTES
from ..Components.local_component import LocalComponent
from ..Components.mesa_component import MesaComponent
from ..Components.franja_component import FranjaComponent
from ..Components.promocion_component import PromocionComponent
from ..Components.dashboard_component import DashboardComponent
from ..Components.empresa_component import EmpresaComponent

def load_routes(api):
    # --- EMPRESAS (Restaurantes principales) ---

    api.add_resource(EmpresaComponent, '/admin/empresas')

    # --- LOCALES (Sucursales) ---

    api.add_resource(LocalComponent,
                     '/admin/locales',
                     '/admin/locales/<int:id>',
                     '/admin/locales/restaurar/<int:id>')

    api.add_resource(LocalComponent, '/admin/sucursales/list', endpoint='list_sucursales')

    # --- MESAS ---
    api.add_resource(MesaComponent,
                     '/admin/mesas',
                     '/admin/mesas/<int:id>',
                     '/admin/mesas/restaurar/<int:id>')

    # --- FRANJAS ---
    api.add_resource(FranjaComponent,
                     '/admin/franjas',
                     '/admin/franjas/<int:id>',
                     '/admin/franjas/restaurar/<int:id>')

    # --- PROMOCIONES ---
    api.add_resource(PromocionComponent,
                     '/admin/promociones',
                     '/admin/promociones/<int:id>')

    # --- DASHBOARD ---
    api.add_resource(DashboardComponent, '/admin/dashboard')