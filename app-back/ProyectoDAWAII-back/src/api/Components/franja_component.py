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
                # AGREGAMOS detección de papelera
                ver_eliminados = request.args.get('eliminados') == 'true' or "eliminadas" in request.path

                if not id_local:
                    return {"result": False, "message": "ID de local requerido"}, 400

                if ver_eliminados:
                    resultado = FranjaService.listar_eliminados_por_local(id_local)
                else:
                    resultado = FranjaService.listar_por_local(id_local)

            return resultado, 200 if resultado['result'] else 500
        except Exception as e:
            HandleLogs.write_error(e)
            return {"result": False, "message": str(e)}, 500

    @valida_api_token
    def post(self, id=None):
        if id is not None and "restaurar" in request.path:
            resultado = FranjaService.restaurar_franja(id)
            return resultado, 200 if resultado['result'] else 500

        try:
            data = request.get_json()
            errors = FranjaRequest().validate(data)
            if errors: return {"result": False, "message": errors}, 400

            resultado = FranjaService.crear_franja(data)
            return resultado, 201 if resultado['result'] else 500
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