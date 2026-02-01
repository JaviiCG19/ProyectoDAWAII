from flask import request
from flask_restful import Resource
from ..Services.franja_service import FranjaService
from ..Model.Request.franja_request import FranjaRequest
from ...utils.general.logs import HandleLogs
from ..Services.middleware import valida_api_token


class FranjaComponent(Resource):

    @valida_api_token
    def get(self, id=None):
        try:
            if id:
                resultado = FranjaService.obtener_por_id(id)
            else:
                id_local = request.args.get('idlocal')
                if not id_local:
                    return {"result": False, "message": "ID de local requerido"}, 400
                resultado = FranjaService.listar_por_local(id_local)

            return resultado, 200 if resultado['result'] else 500
        except Exception as e:
            HandleLogs.write_error(e)
            return {"result": False, "message": str(e)}, 500

    @valida_api_token
    def post(self, id=None):
        if id and "restaurar" in request.path:
            return FranjaService.restaurar_franja(id), 200

        try:
            data = request.get_json()
            errors = FranjaRequest().validate(data)
            if errors: return {"result": False, "message": errors}, 400
            return FranjaService.crear_franja(data), 201
        except Exception as e:
            return {"result": False, "message": str(e)}, 500

    @valida_api_token
    def put(self, id):
        try:
            data = request.get_json()
            errors = FranjaRequest().validate(data)
            if errors:
                return {"result": False, "message": errors}, 400

            resultado = FranjaService.actualizar_franja(id, data)
            return resultado, 200 if resultado['result'] else 500
        except Exception as e:
            HandleLogs.write_error(e)
            return {"result": False, "message": str(e)}, 500

    @valida_api_token
    def delete(self, id):
        try:
            return FranjaService.eliminar_franja(id), 200
        except Exception as e:
            return {"result": False, "message": str(e)}, 500