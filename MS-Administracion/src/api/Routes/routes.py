from ..Services.user_service import UserService
from ..Services.login_service import LoginService
from ..Services.tokenval_service import TokenValService
from ..Components.local_component import LocalComponent
from ..Components.mesa_component import MesaComponent
from ..Components.franja_component import FranjaComponent
from ..Components.promocion_component import PromocionComponent
from ..Components.dashboard_component import DashboardComponent
from ..Components.empresa_component import EmpresaComponent

def load_routes(api):
    #agregar el metodo de obtener usuarios
    api.add_resource(UserService, '/user/list')
    api.add_resource(LoginService, '/security/login')
    api.add_resource(TokenValService, '/security/validate')

   # --- EMPRESAS (Restaurantes principales) ---
    api.add_resource(
        EmpresaComponent,
        '/admin/empresas',
        '/admin/empresas/<int:id>',
        '/admin/empresas/restaurar/<int:id>'
    )

    # --- LOCALES (Sucursales) ---
    api.add_resource(
        LocalComponent,
        '/admin/locales',
        '/admin/locales/<int:id>',
        '/admin/locales/restaurar/<int:id>'
    )

    # --- MESAS ---
    api.add_resource(
        MesaComponent,
        '/admin/mesas',
        '/admin/mesas/<int:id>',
        '/admin/mesas/restaurar/<int:id>'
    )

    # --- FRANJAS ---
    api.add_resource(
        FranjaComponent,
        '/admin/franjas',
        '/admin/franjas/<int:id>',
        '/admin/franjas/eliminadas',
        '/admin/franjas/restaurar/<int:id>'
    )

    # --- PROMOCIONES ---
    api.add_resource(
        PromocionComponent,
        '/admin/promociones',
        '/admin/promociones/<int:id>',
        '/admin/promociones/eliminadas',
        '/admin/promociones/restaurar/<int:id>'
    )

    # --- DASHBOARD ---
    api.add_resource(DashboardComponent, '/admin/dashboard')
