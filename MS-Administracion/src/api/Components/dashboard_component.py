from flask import request
from flask_restful import Resource
from ..Services.dashboard_service import DashboardService
from ...utils.general.logs import HandleLogs
from ..Services.middleware import valida_api_token

class DashboardComponent(Resource):

    @valida_api_token
    def get(self):
        """
        Obtiene las métricas generales del dashboard filtradas por idcia.
        Requiere token de seguridad.
        """
        try:
            # Recibimos el idcia por parámetros para filtrar las métricas
            id_cia = request.args.get('idcia')
            if not id_cia:
                return {"result": False, "message": "ID de compañía requerido para el dashboard"}, 400

            # Si el token es válido, llamamos al Service para las métricas
            resultado = DashboardService.obtener_resumen(id_cia)
            return resultado, 200 if resultado['result'] else 500
        except Exception as e:
            HandleLogs.write_error(e)
            return {"result": False, "message": str(e)}, 500