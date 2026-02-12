from flask import request
from flask_restful import Resource
from ..Services.dashboard_service import DashboardService
from ...utils.general.logs import HandleLogs
from ..Services.middleware import valida_api_token
from datetime import date


class DashboardComponent(Resource):

    @valida_api_token
    def get(self):
        """
        Dashboard Adaptativo para los 3 Roles:
        - Rol 1 (Admin) y Rol 2 (Gerente): No envían idcia, ven datos globales
        - Rol 3 (Admin Sucursal): Envía idcia, ve ocupación por franjas .
        """
        try:
            # Capturamos el idcia (ahora es opcional para no bloquear al Gerente)
            id_cia = request.args.get('idcia')

            # Llamamos al Service con los parámetros
            resultado = DashboardService.obtener_resumen(id_cia)

            return resultado, 200 if resultado['result'] else 500

        except Exception as e:
            HandleLogs.write_error(e)
            return {"result": False, "message": str(e)}, 500