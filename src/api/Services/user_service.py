from flask_restful import Resource
from src.api.Components.user_component import UserComponent
from src.utils.general.logs import HandleLogs
from src.utils.general.response import response_error, response_success, response_not_found

#Clase que implemente metodos http
class UserService(Resource):

    @staticmethod
    def get():
        try:
            HandleLogs.write_log("Servicio para Obtener Lista de Usuario Ejecutado")
            resultado = UserComponent.getAllUsers()
            if resultado['result']:
                return response_success(resultado['data'])
            else:
                return response_not_found()

        except Exception as err:
            HandleLogs.write_error(err)
            return response_error(err.__str__())

