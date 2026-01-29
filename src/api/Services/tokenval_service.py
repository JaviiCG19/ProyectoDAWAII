from flask_restful import Resource
from flask import request
from ...utils.general.logs import HandleLogs
from ...utils.general.response import response_success, response_error, response_unauthorize
from ..Components.jwt_component import JwtComponent


class TokenValService(Resource):

    @staticmethod

    def post():
        try:
            HandleLogs.write_log("Servicio de validación de token")

            # Obtenemos el token del header como lo hace tu middleware
            token = request.headers.get('tokenapp')

            if token is None:
                return response_unauthorize()

            # Usamos el componente que ya tienes para validar
            is_valid = JwtComponent.token_validate(token)

            if is_valid:
                return response_success({"is_valid": True}, "Token válido y vigente")
            else:
                return response_error("Token inválido o expirado")

        except Exception as err:
            HandleLogs.write_error(err)
            return response_error(err.__str__())