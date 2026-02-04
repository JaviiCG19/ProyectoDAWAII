from flask_restful import Resource
from flask import request
from ..Components.anticipo_component import AnticipoComponent
from ...utils.general.logs import HandleLogs
from ...utils.general.response import (response_error, response_success,
                                       response_not_found, response_inserted)
from ..Model.Request.anticipo_request import AnticipoCreateRequest
from ..Services.middleware import valida_api_token



class AnticipoCreateService(Resource):

    @staticmethod
    @valida_api_token
    def post():

        try:
            HandleLogs.write_log("Servicio para registrar anticipo ejecutado")
            rq_json = request.get_json()

            # Validar request
            new_request = AnticipoCreateRequest()
            error_en_validacion = new_request.validate(rq_json)

            if error_en_validacion:
                HandleLogs.write_error("Error al validar el request -> " + str(error_en_validacion))
                return response_error("Error al validar el request -> " + str(error_en_validacion))

            resultado = AnticipoComponent.crear_anticipo(
                rq_json['idreserva'],
                rq_json['monto']
            )

            if resultado['result']:
                return response_inserted(resultado['data'])
            else:
                return response_not_found()

        except Exception as err:
            HandleLogs.write_error(err)
            return response_error(err.__str__())


class AnticipoReservaService(Resource):

    @staticmethod
    @valida_api_token
    def get(idreserva):

        try:
            HandleLogs.write_log(f"Servicio para obtener anticipo de reserva {idreserva} ejecutado")

            resultado = AnticipoComponent.obtener_anticipo_por_reserva(idreserva)

            if resultado['result'] and resultado['data']:
                return response_success(resultado['data'])
            else:
                return response_not_found()

        except Exception as err:
            HandleLogs.write_error(err)
            return response_error(err.__str__())