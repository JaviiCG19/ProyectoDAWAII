from flask_restful import Resource
from flask import request
from ..Components.recovery_component import RecoveryComponent
from ...utils.general.response import response_error, response_success
from .middleware import valida_api_token


class ChangePasswordService(Resource):
    @valida_api_token
    def post(self):
        """ Cambiar clave estando logueado """
        data = request.get_json()
        user_id = data.get('usr_id')
        old_p = data.get('old_password')
        new_p = data.get('new_password')

        if not all([user_id, old_p, new_p]):
            return response_error("Faltan campos obligatorios")

        res = RecoveryComponent.changePassword(user_id, old_p, new_p)
        if res['result']:
            return response_success("Contraseña actualizada exitosamente")
        return response_error(res['message'])

class ResetPasswordService(Resource):
    def post(self):
        """ Recuperar clave olvidada """
        data = request.get_json()
        login = data.get('usr_nombre')
        respuesta = data.get('usr_respuesta')
        new_p = data.get('new_password')
        # Aquí idealmente recibirías un 'token_de_correo'

        if not login or not new_p or not respuesta:
            return response_error("Login, respuesta y nueva clave son requeridos")

        res = RecoveryComponent.resetPassword(login, respuesta, new_p)
        if res['result']:
            return response_success(None, "Se ha restablecido la contraseña")
        return response_error(res['message'])
