from flask import request
from flask_restful import Resource
from ..Services.local_service import LocalService
from ..Model.Request.local_request import LocalRequest
from ...utils.general.logs import HandleLogs
from ..Services.middleware import valida_api_token

class LocalComponent(Resource):

    @valida_api_token
    def get(self, id=None):
        try:
            if id:
                resultado = LocalService.obtener_local_por_id(id)
            else:
                idcia = request.args.get('idcia')
                ver_eliminados = request.args.get('eliminados') == 'true'

                if not idcia:
                    return {"result": False, "message": "ID de empresa requerido"}, 400

                if ver_eliminados:
                    resultado = LocalService.listar_eliminados_por_empresa(idcia)
                else:
                    resultado = LocalService.listar_por_empresa(idcia)

            return resultado, 200 if resultado['result'] else 500
        except Exception as e:
            HandleLogs.write_error(e)
            return {"result": False, "message": str(e)}, 500

    @valida_api_token
    def post(self, id=None):
        """
        Crea un nuevo local o restaura uno eliminado.
        """
        if id and "restaurar" in request.path:
            return LocalService.restaurar_local(id), 200

        try:
            data = request.get_json()
            errors = LocalRequest().validate(data)
            if errors:
                return {"result": False, "message": errors}, 400

            # El Service se encarga de la lógica de negocio (mesas automáticas)
            resultado = LocalService.crear_local(data)
            return resultado, 201 if resultado['result'] else 500
        except Exception as e:
            HandleLogs.write_error(e)
            return {"result": False, "message": str(e)}, 500

    @valida_api_token
    def put(self, id):
        try:
            data = request.get_json()
            errors = LocalRequest().validate(data)
            if errors:
                return {"result": False, "message": errors}, 400

            resultado = LocalService.actualizar_local(id, data)
            return resultado, 200 if resultado['result'] else 500
        except Exception as e:
            HandleLogs.write_error(e)
            return {"result": False, "message": str(e)}, 500

    @valida_api_token
    def delete(self, id):
        try:
            resultado = LocalService.eliminar_local(id)
            return resultado, 200 if resultado['result'] else 500
        except Exception as e:
            HandleLogs.write_error(e)
            return {"result": False, "message": str(e)}, 500