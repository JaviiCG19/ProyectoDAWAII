from ..Services.user_service import UserService
from ..Services.login_service import LoginService
from ..Services.tokenval_service import TokenValService

def load_routes(api):
    #agregar el metodo de obtener usuarios
    api.add_resource(UserService, '/user/list')
    api.add_resource(LoginService, '/security/login')
    api.add_resource(TokenValService, '/security/validate')
