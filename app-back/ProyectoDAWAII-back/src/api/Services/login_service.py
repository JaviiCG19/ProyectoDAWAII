from flask_restful import Resource
from flask import request
from ..Components.login_component import LoginComponent
from ...utils.general.logs import HandleLogs
from ...utils.general.response import response_error, response_success, response_not_found
from ..Model.Request.login_request import LoginRequest

#Clase que implemente metodos http
class LoginService(Resource):

    @staticmethod
    def post():
        try:
            HandleLogs.write_log("Servicio para Validar login del usaurio")
            # Obtener los datos del request
            rq_json = request.get_json()
            # Validar el request con el modelo
            new_request = LoginRequest()
            error_en_validacion = new_request.validate(rq_json)

            if error_en_validacion:
                HandleLogs.write_error("Error al validar el request -> " + str(error_en_validacion))
                return response_error("Error al validar el request -> " + str(error_en_validacion))

            resultado = LoginComponent.Login(rq_json['login_user'], rq_json['login_password'])
            if resultado['result']:
                return response_success(resultado['data'])
            else:
                return response_error(resultado['message'])

        except Exception as err:
            HandleLogs.write_error(err)
            return response_error(err.__str__())