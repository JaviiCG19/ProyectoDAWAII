from flask import request
from flask_restful import Resource
from ..Services.local_service import LocalService
from ..Model.Request.local_request import LocalRequest
from ...utils.general.logs import HandleLogs

class LocalComponent(Resource):
    def get(self):
        """Lista todos los locales """
        try:
            resultado = LocalService.listar_locales()
            if resultado['result']:
                return resultado, 200
            return resultado, 500
        except Exception as e:
            HandleLogs.write_error(e)
            return {"result": False, "message": str(e)}, 500

    def post(self):
        """Registra un nuevo local """
        try:
            data = request.get_json()

            # VALIDAR: Ahora sí encontrará LocalRequest
            errors = LocalRequest().validate(data)
            if errors:
                return {"result": False, "data": None, "message": errors}, 400

            # PROCESAR
            resultado = LocalService.crear_local(data)
            return resultado, 201 if resultado['result'] else 500

        except Exception as e:
            HandleLogs.write_error(e)
            return {"result": False, "message": str(e)}, 500