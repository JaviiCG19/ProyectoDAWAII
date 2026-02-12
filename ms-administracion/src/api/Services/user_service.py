from flask_restful import Resource
from ..Components.user_component import UserComponent
from ..Components.jwt_component import JwtComponent
from ...utils.general.logs import HandleLogs
from ...utils.general.response import (response_error, response_success,
                                       response_not_found, response_unauthorize)
from .middleware import valida_api_token
from flask import request

#Clase que implemente metodos http
class UserService(Resource):

    @staticmethod
    @valida_api_token
    def get():
        try:
            HandleLogs.write_log("Servicio para Obtener Lista de Usuario Ejecutado")
            # Validar que el token que yo recibo sea válido
            # token = request.headers['tokenapp']
            # if token is None:
            #     return response_error(500, "Token no encontrado, no se puede procesar la solicitud")

            # if not JwtComponent.token_validate(token):
            #     return response_unauthorize()
            #
            resultado = UserComponent.getAllUsers()
            if resultado['result']:
                return response_success(resultado['data'])
            else:
                return response_not_found()

        except Exception as err:
            HandleLogs.write_error(err)
            return response_error(err.__str__())

