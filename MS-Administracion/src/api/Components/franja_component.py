from flask import request
from flask_restful import Resource
from ..Services.franja_service import FranjaService
from ..Model.Request.franja_request import FranjaRequest
from ...utils.general.logs import HandleLogs


class FranjaComponent(Resource):
    def get(self, id=None):
        try:
            # Si hay ID en la URL, buscamos una franja. Si no, listamos por idlocal
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

    def post(self, id=None):
        # Acción de Restaurar
        if id and "restaurar" in request.path:
            return FranjaService.restaurar_franja(id), 200

        # Acción de Crear
        try:
            data = request.get_json()
            errors = FranjaRequest().validate(data)
            if errors: return {"result": False, "message": errors}, 400
            return FranjaService.crear_franja(data), 201
        except Exception as e:
            return {"result": False, "message": str(e)}, 500

    def put(self, id):
        try:
            data = request.get_json()
            # Reutilizamos validación de horas
            return FranjaService.actualizar_franja(id, data), 200
        except Exception as e:
            return {"result": False, "message": str(e)}, 500

    def delete(self, id):
        try:
            return FranjaService.eliminar_franja(id), 200
        except Exception as e:
            return {"result": False, "message": str(e)}, 500