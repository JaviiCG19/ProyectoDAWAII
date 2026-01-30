from flask_restful import Resource
from flask import request
from datetime import datetime
from ..Components.reporte_component import ReporteComponent
from ...utils.general.logs import HandleLogs
from ...utils.general.response import response_error, response_success, response_not_found
from ..Model.Request.reporte_request import ReportePeriodoRequest, ReporteTopClientesRequest
from .middleware import valida_api_token


class ReportePeriodoService(Resource):

    @staticmethod
    @valida_api_token
    def post():
        """
        Reporte de reservas por período
        """
        try:
            HandleLogs.write_log("Servicio de reporte por período ejecutado")
            rq_json = request.get_json()

            # Validar request
            new_request = ReportePeriodoRequest()
            error_en_validacion = new_request.validate(rq_json)

            if error_en_validacion:
                return response_error("Error al validar el request -> " + str(error_en_validacion))

            resultado = ReporteComponent.reservas_por_periodo(
                rq_json['fecha_inicio'],
                rq_json['fecha_fin']
            )

            if resultado['result']:
                return response_success(resultado['data'])
            else:
                return response_not_found()

        except Exception as err:
            HandleLogs.write_error(err)
            return response_error(err.__str__())


class ReporteTopClientesService(Resource):

    @staticmethod
    @valida_api_token
    def get():
        """
        Top clientes con más reservas
        """
        try:
            HandleLogs.write_log("Servicio de top clientes ejecutado")

            limite = request.args.get('limite', 10, type=int)

            resultado = ReporteComponent.top_clientes(limite)

            if resultado['result']:
                return response_success(resultado['data'])
            else:
                return response_not_found()

        except Exception as err:
            HandleLogs.write_error(err)
            return response_error(err.__str__())


class ReporteUsoMesasService(Resource):

    @staticmethod
    @valida_api_token
    def get():
        """
        Estadísticas de uso de mesas
        """
        try:
            HandleLogs.write_log("Servicio de uso de mesas ejecutado")

            resultado = ReporteComponent.uso_mesas()

            if resultado['result']:
                return response_success(resultado['data'])
            else:
                return response_not_found()

        except Exception as err:
            HandleLogs.write_error(err)
            return response_error(err.__str__())


class ReporteTasasService(Resource):

    @staticmethod
    @valida_api_token
    def post():
        """
        Tasa de no-show y cancelaciones
        """
        try:
            HandleLogs.write_log("Servicio de tasas ejecutado")
            rq_json = request.get_json()

            # Validar request
            new_request = ReportePeriodoRequest()
            error_en_validacion = new_request.validate(rq_json)

            if error_en_validacion:
                return response_error("Error al validar el request -> " + str(error_en_validacion))

            resultado = ReporteComponent.tasa_noshow_cancelaciones(
                rq_json['fecha_inicio'],
                rq_json['fecha_fin']
            )

            if resultado['result']:
                return response_success(resultado['data'])
            else:
                return response_not_found()

        except Exception as err:
            HandleLogs.write_error(err)
            return response_error(err.__str__())


class ReporteFranjasService(Resource):

    @staticmethod
    @valida_api_token
    def get():
        """
        Reservas por franja horaria
        """
        try:
            HandleLogs.write_log("Servicio de reservas por franja ejecutado")

            resultado = ReporteComponent.reservas_por_franja()

            if resultado['result']:
                return response_success(resultado['data'])
            else:
                return response_not_found()

        except Exception as err:
            HandleLogs.write_error(err)
            return response_error(err.__str__())