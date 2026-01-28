from src.api.Services.user_service import UserService
from src.api.Services.login_service import LoginService


def load_routes(api):
    #agregar el metodo de obtener usuarios
    api.add_resource(UserService, '/user/list')
    api.add_resource(LoginService, '/security/login')

