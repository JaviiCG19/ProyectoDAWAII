from flask_restful import Resource
from ..Services.dashboard_service import DashboardService
from ...utils.general.logs import HandleLogs
from flask import request

class DashboardComponent(Resource):
    def get(self):
        try:
            # Recibimos el idcia por parámetros para filtrar las métricas
            id_cia = request.args.get('idcia')
            if not id_cia:
                return {"result": False, "message": "ID de compañía requerido para el dashboard"}, 400

            resultado = DashboardService.obtener_resumen(id_cia)
            return resultado, 200 if resultado['result'] else 500
        except Exception as e:
            HandleLogs.write_error(e)
            return {"result": False, "message": str(e)}, 500