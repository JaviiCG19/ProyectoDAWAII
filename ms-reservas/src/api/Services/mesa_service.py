from flask_restful import Resource
from flask import request
from datetime import datetime
from ..Components.mesa_component import MesaComponent
from ...utils.general.logs import HandleLogs
from ...utils.general.response import response_error, response_success, response_not_found
from .middleware import valida_api_token


class MesaDisponibleService(Resource):

    @staticmethod
    @valida_api_token
    def get(fecha):
        """
        Obtener mesas disponibles para una fecha
        """
        try:
            HandleLogs.write_log(f"Servicio para obtener mesas disponibles en {fecha} ejecutado")

            # Validar formato de fecha
            try:
                fecha_obj = datetime.strptime(fecha, '%Y-%m-%d').date()
            except ValueError:
                return response_error("Formato de fecha inválido. Use YYYY-MM-DD")

            resultado = MesaComponent.mesas_disponibles_por_fecha(fecha_obj)

            if resultado['result']:
                return response_success(resultado['data'])
            else:
                return response_not_found()

        except Exception as err:
            HandleLogs.write_error(err)
            return response_error(err.__str__())