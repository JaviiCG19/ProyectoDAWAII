from flask import request
from flask_restful import Resource
from ..Services.local_service import LocalService
from ..Model.Request.local_request import LocalRequest
from ...utils.general.logs import HandleLogs


class LocalComponent(Resource):
    def get(self, id=None):
        try:
            # Si el endpoint es /list_sucursales
            if id:
                resultado = LocalService.obtener_local_por_id(id)
            else:
                resultado = LocalService.listar_locales()
            return resultado, 200 if resultado['result'] else 500
        except Exception as e:
            HandleLogs.write_error(e)
            return {"result": False, "message": str(e)}, 500

    def post(self, id=None):
        # Manejo de la restauración (Ruta: /admin/locales/restaurar/<id>)
        if id and "restaurar" in request.path:
            return LocalService.restaurar_local(id), 200

        # Registro normal de Sucursal (idcia obligatorio en el body)
        try:
            data = request.get_json()
            # La validación asegura que idcia, detalle y direccion existan
            errors = LocalRequest().validate(data)
            if errors:
                return {"result": False, "message": errors}, 400


            resultado = LocalService.crear_local(data)
            return resultado, 201
        except Exception as e:
            HandleLogs.write_error(e)
            return {"result": False, "message": str(e)}, 500

    def put(self, id):
        try:
            data = request.get_json()
            errors = LocalRequest().validate(data)
            if errors:
                return {"result": False, "message": errors}, 400
            return LocalService.actualizar_local(id, data), 200
        except Exception as e:
            HandleLogs.write_error(e)
            return {"result": False, "message": str(e)}, 500

    def delete(self, id):
        try:
            # Ejecuta el borrado lógico que definimos en el Service
            return LocalService.eliminar_local(id), 200
        except Exception as e:
            HandleLogs.write_error(e)
            return {"result": False, "message": str(e)}, 500