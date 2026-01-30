from flask import request
from flask_restful import Resource
from ..Services.franja_service import FranjaService
from ..Model.Request.franja_request import FranjaRequest
from ...utils.general.logs import HandleLogs

class FranjaComponent(Resource):
    def get(self, id_local):
        try:
            resultado = FranjaService.listar_por_local(id_local)
            return resultado, 200 if resultado['result'] else 500
        except Exception as e:
            HandleLogs.write_error(e)
            return {"result": False, "message": str(e)}, 500

    def post(self):
        try:
            data = request.get_json()
            errors = FranjaRequest().validate(data)
            if errors:
                return {"result": False, "message": errors}, 400

            resultado = FranjaService.crear_franja(data)
            return resultado, 201
        except Exception as e:
            HandleLogs.write_error(e)
            return {"result": False, "message": str(e)}, 500