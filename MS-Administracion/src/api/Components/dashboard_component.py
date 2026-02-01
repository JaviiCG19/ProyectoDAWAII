from flask_restful import Resource
from ..Services.dashboard_service import DashboardService
from ...utils.general.logs import HandleLogs
from flask import request
from ..Services.middleware import valida_api_token


class DashboardComponent(Resource):

    @valida_api_token  # El backend ahora valora el token por cada acción
    def get(self):
        """
        Este componente es de nivel Gerencial. Filtramos por 'idcia' para
        consolidar la información de todas las sucursales de una misma empresa.
        """
        try:
            # El ID de compañía se recupera del token/localStorage del Gerente
            id_cia = request.args.get('idcia')

            if not id_cia:
                return {
                    "result": False,
                    "message": "Seguridad: Se requiere ID de compañía para generar el reporte"
                }, 400

            # El servicio sumará mesas, locales y promociones de esa CIA específica
            resultado = DashboardService.obtener_resumen(id_cia)
            return resultado, 200 if resultado['result'] else 500

        except Exception as e:
            HandleLogs.write_error(e)
            return {"result": False, "message": str(e)}, 500