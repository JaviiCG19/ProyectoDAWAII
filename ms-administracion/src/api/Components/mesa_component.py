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
                # Usa obtener_por_id de tu Service
                resultado = MesaService.obtener_por_id(id)
                if resultado['result'] and not resultado['data']:
                    return {"result": False, "message": "Mesa no encontrada"}, 404
            else:
                id_local = request.args.get('idlocal')
                if not id_local:
                    return {"result": False, "message": "Se requiere ID de local"}, 400

                # Manejo de filtro para inactivas (estado 0)
                ver_inactivas = request.args.get('inactivas', 'false').lower() == 'true'

                if ver_inactivas:
                    resultado = MesaService.listar_por_mesas_inactiva(id_local)
                else:
                    resultado = MesaService.listar_por_local(id_local)

            return resultado, 200 if resultado['result'] else 500
        except Exception as e:
            HandleLogs.write_error(e)
            return {"result": False, "message": str(e)}, 500

    @valida_api_token
    def post(self, id=None):
        # Lógica para restaurar mesa (estado 0 -> 1)
        if id and "restaurar" in request.path:
            resultado = MesaService.restaurar_mesa(id)
            return resultado, 200 if resultado['result'] else 400

        try:
            data = request.get_json()
            errors = MesaRequest().validate(data)
            if errors:
                return {"result": False, "message": errors}, 400

            # Usa crear_mesa que ya incluye limpieza de "ms-"
            resultado = MesaService.crear_mesa(data)
            return resultado, 201 if resultado['result'] else 400
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

            # Usa actualizar_mesa de tu Service
            resultado = MesaService.actualizar_mesa(id, data)
            return resultado, 200 if resultado['result'] else 400
        except Exception as e:
            HandleLogs.write_error(e)
            return {"result": False, "message": str(e)}, 500

    @valida_api_token
    def delete(self, id):
        try:
            # Usa eliminar_mesa (que hace el borrado lógico a estado 0)
            resultado = MesaService.eliminar_mesa(id)
            return resultado, 200 if resultado['result'] else 400
        except Exception as e:
            HandleLogs.write_error(e)
            return {"result": False, "message": str(e)}, 500