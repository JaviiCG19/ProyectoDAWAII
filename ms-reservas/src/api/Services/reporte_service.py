from flask_restful import Resource
from flask import request
from datetime import datetime
from ..Components.reporte_component import ReporteComponent
from ...utils.general.logs import HandleLogs
from ...utils.general.response import response_error, response_success, response_not_found
from ..Model.Request.reporte_request import ReportePeriodoRequest, ReporteTopClientesRequest
from ..Services.middleware import valida_api_token


class ReportePeriodoService(Resource):

    @staticmethod
    @valida_api_token
    def get():
        """
        Obtener reporte de reservas por período
        Query params: inicio (YYYY-MM-DD), fin (YYYY-MM-DD)
        """
        try:
            HandleLogs.write_log("Servicio de reporte por período ejecutado")

            # Obtener parámetros de query
            fecha_inicio = request.args.get('inicio')
            fecha_fin = request.args.get('fin')

            # Validar parámetros requeridos
            if not fecha_inicio or not fecha_fin:
                return response_error("Parámetros 'inicio' y 'fin' son requeridos")

            # Validar formato de fechas
            try:
                fecha_inicio_obj = datetime.strptime(fecha_inicio, '%Y-%m-%d').date()
                fecha_fin_obj = datetime.strptime(fecha_fin, '%Y-%m-%d').date()
            except ValueError:
                return response_error("Formato de fecha inválido. Use YYYY-MM-DD")

            resultado = ReporteComponent.reservas_por_periodo(
                fecha_inicio_obj,
                fecha_fin_obj
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