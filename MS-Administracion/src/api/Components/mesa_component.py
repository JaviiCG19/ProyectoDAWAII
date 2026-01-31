from flask import request
from flask_restful import Resource
from ..Services.mesa_service import MesaService
from ..Model.Request.mesa_request import MesaRequest
from ...utils.general.logs import HandleLogs

class MesaComponent(Resource):
    def get(self, id=None):
        try:
            if id:
                resultado = MesaService.obtener_por_id(id)
            else:
                id_local = request.args.get('idlocal')
                if not id_local:
                    return {"result": False, "message": "ID de local requerido para el enrutamiento"}, 400
                resultado = MesaService.listar_por_local(id_local)
            return resultado, 200 if resultado['result'] else 500
        except Exception as e:
            HandleLogs.write_error(e)
            return {"result": False, "message": str(e)}, 500

    def post(self, id=None):
        if id and "restaurar" in request.path:
            return MesaService.restaurar_mesa(id), 200
        try:
            data = request.get_json()
            # Validamos que traiga idlocal para cumplir con el multitenant
            errors = MesaRequest().validate(data)
            if errors: return {"result": False, "message": errors}, 400
            return MesaService.crear_mesa(data), 201
        except Exception as e:
            HandleLogs.write_error(e) # Te faltaba este
            return {"result": False, "message": str(e)}, 500

    def put(self, id):
        try:
            data = request.get_json()
            # Importante validar también al actualizar
            errors = MesaRequest().validate(data)
            if errors: return {"result": False, "message": errors}, 400
            return MesaService.actualizar_mesa(id, data), 200
        except Exception as e:
            HandleLogs.write_error(e)
            return {"result": False, "message": str(e)}, 500

    def delete(self, id):
        try:
            # Borrado lógico para no perder historial de reservas
            return MesaService.eliminar_mesa(id), 200
        except Exception as e:
            HandleLogs.write_error(e)
            return {"result": False, "message": str(e)}, 500