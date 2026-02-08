from flask_restful import Resource
from flask import request
from ..Components.reserva_component import ReservaComponent
from ...utils.general.logs import HandleLogs
from ...utils.general.response import (response_error, response_success,
                                       response_not_found, response_inserted,
                                       response_conflict)
from ..Model.Request.reserva_request import ReservaCreateRequest
from ..Services.middleware import valida_api_token


class ReservaCreateService(Resource):

    @staticmethod
    @valida_api_token
    def post():

        try:
            HandleLogs.write_log("Servicio para crear reserva ejecutado")
            rq_json = request.get_json()

            new_request = ReservaCreateRequest()
            error_en_validacion = new_request.validate(rq_json)

            if error_en_validacion:
                HandleLogs.write_error("Error al validar el request -> " + str(error_en_validacion))
                return response_error("Error al validar el request -> " + str(error_en_validacion))

            resultado = ReservaComponent.crear_reserva(
                rq_json['idlocal'],
                rq_json['idmesa'],
                rq_json['idcliente'],
                rq_json['fecha'],
                rq_json['franja_id'],
                rq_json.get('numper', 1)
            )

            if resultado['result']:
                return response_inserted(resultado['data'])
            else:
                return response_conflict(resultado['message'])

        except Exception as err:
            HandleLogs.write_error(err)
            return response_error(err.__str__())


class ReservaListService(Resource):

    @staticmethod
    @valida_api_token
    def get():

        try:
            HandleLogs.write_log("Servicio para listar reservas activas ejecutado")

            resultado = ReservaComponent.listar_reservas_activas()

            if resultado['result']:
                return response_success(resultado['data'])
            else:
                return response_not_found()

        except Exception as err:
            HandleLogs.write_error(err)
            return response_error(err.__str__())

class ReservaDetailService(Resource):

    @staticmethod
    @valida_api_token
    def get(reserva_id):

        try:
            HandleLogs.write_log(f"Servicio para obtener reserva {reserva_id} ejecutado")

            resultado = ReservaComponent.obtener_reserva(reserva_id)

            if resultado['result'] and resultado['data']:
                return response_success(resultado['data'])
            else:
                return response_not_found()

        except Exception as err:
            HandleLogs.write_error(err)
            return response_error(err.__str__())

    @staticmethod
    @valida_api_token
    def delete(reserva_id):

        try:
            HandleLogs.write_log(f"Servicio para eliminar reserva {reserva_id} ejecutado")

            resultado = ReservaComponent.eliminar_reserva(reserva_id)

            if resultado['result']:
                return response_success(resultado['data'])
            else:
                return response_not_found()

        except Exception as err:
            HandleLogs.write_error(err)
            return response_error(err.__str__())


class ReservaConfirmarService(Resource):

    @staticmethod
    @valida_api_token
    def put(reserva_id):

        try:
            HandleLogs.write_log(f"Servicio para confirmar reserva {reserva_id} ejecutado")

            resultado = ReservaComponent.confirmar_reserva(reserva_id)

            if resultado['result']:
                return response_success(resultado['data'])
            else:
                return response_conflict(resultado['message'])

        except Exception as err:
            HandleLogs.write_error(err)
            return response_error(err.__str__())


class ReservaCancelarService(Resource):

    @staticmethod
    @valida_api_token
    def put(reserva_id):

        try:
            HandleLogs.write_log(f"Servicio para cancelar reserva {reserva_id} ejecutado")

            resultado = ReservaComponent.cancelar_reserva(reserva_id)

            if resultado['result']:
                return response_success(resultado['data'])
            else:
                return response_not_found()

        except Exception as err:
            HandleLogs.write_error(err)
            return response_error(err.__str__())


class ReservaCheckinService(Resource):

    @staticmethod
    @valida_api_token
    def put(reserva_id):

        try:
            HandleLogs.write_log(f"Servicio para check-in reserva {reserva_id} ejecutado")

            resultado = ReservaComponent.checkin_reserva(reserva_id)

            if resultado['result']:
                return response_success(resultado['data'])
            else:
                return response_not_found()

        except Exception as err:
            HandleLogs.write_error(err)
            return response_error(err.__str__())


class ReservaNoShowService(Resource):

    @staticmethod
    @valida_api_token
    def put(reserva_id):

        try:
            HandleLogs.write_log(f"Servicio para marcar no-show reserva {reserva_id} ejecutado")

            resultado = ReservaComponent.marcar_no_show(reserva_id)

            if resultado['result']:
                return response_success(resultado['data'])
            else:
                return response_not_found()

        except Exception as err:
            HandleLogs.write_error(err)
            return response_error(err.__str__())


class ReservaListAllService(Resource):

    @staticmethod
    @valida_api_token
    def get():

        try:
            HandleLogs.write_log("Servicio para listar TODAS las reservas ejecutado")

            resultado = ReservaComponent.listar_todas_reservas()

            if resultado['result']:
                return response_success(resultado['data'])
            else:
                return response_not_found()

        except Exception as err:
            HandleLogs.write_error(err)
            return response_error(err.__str__())