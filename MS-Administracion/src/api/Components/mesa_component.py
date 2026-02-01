from flask import request
from flask_restful import Resource
from ..Services.mesa_service import MesaService
from ..Model.Request.mesa_request import MesaRequest
from ...utils.general.logs import HandleLogs
from ..Services.middleware import valida_api_token


class MesaComponent(Resource):

    @valida_api_token
    def get(self, id=None):
        try:
            if id:
                resultado = MesaService.obtener_por_id(id)
            else:
                id_local = request.args.get('idlocal')
                if not id_local:
                    return {"result": False, "message": "Seguridad: Se requiere ID de local"}, 400
                resultado = MesaService.listar_por_local(id_local)

            return resultado, 200 if resultado['result'] else 500
        except Exception as e:
            HandleLogs.write_error(e)
            return {"result": False, "message": str(e)}, 500

    @valida_api_token
    def post(self, id=None):
        # Manejo de restauración (Ruta: /admin/mesas/restaurar/<id>)
        if id and "restaurar" in request.path:
            resultado = MesaService.restaurar_mesa(id)
            return resultado, 200 if resultado['result'] else 500

        try:
            data = request.get_json()
            errors = MesaRequest().validate(data)
            if errors:
                return {"result": False, "message": errors}, 400

            resultado = MesaService.crear_mesa(data)
            return resultado, 201 if resultado['result'] else 500
        except Exception as e:
            HandleLogs.write_error(e)
            return {"result": False, "message": str(e)}, 500

    @valida_api_token
    def put(self, id):
        try:
            data = request.get_json()
            errors = MesaRequest().validate(data)
            if errors:
                return {"result": False, "message": errors}, 400

            resultado = MesaService.actualizar_mesa(id, data)
            return resultado, 200 if resultado['result'] else 500
        except Exception as e:
            HandleLogs.write_error(e)
            return {"result": False, "message": str(e)}, 500

    @valida_api_token
    def delete(self, id):
        try:
            resultado = MesaService.eliminar_mesa(id)
            return resultado, 200 if resultado['result'] else 500
        except Exception as e:
            HandleLogs.write_error(e)
            return {"result": False, "message": str(e)}, 500