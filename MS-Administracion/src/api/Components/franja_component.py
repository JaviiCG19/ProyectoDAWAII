from flask import request
from flask_restful import Resource
from ..Services.franja_service import FranjaService
from ..Model.Request.franja_request import FranjaRequest
from ...utils.general.logs import HandleLogs
from ..Services.middleware import valida_api_token


class FranjaComponent(Resource):

    @valida_api_token  # Valoramos el token para ver los horarios
    def get(self, id=None):
        """
        CORRECCIÓN: Gestión por sucursal.
        Filtramos los horarios (franjas) por 'idlocal'. Esto cumple con que cada
        administrador de sucursal maneje su propia disponibilidad.
        """
        try:
            if id:
                resultado = FranjaService.obtener_por_id(id)
            else:
                # El ID viene del front de localstorage
                id_local = request.args.get('idlocal')
                if not id_local:
                    return {"result": False, "message": "ID de local requerido para cargar horarios"}, 400
                resultado = FranjaService.listar_por_local(id_local)

            return resultado, 200 if resultado['result'] else 500
        except Exception as e:
            HandleLogs.write_error(e)
            return {"result": False, "message": str(e)}, 500

    @valida_api_token  # Seguridad para crear nuevos horarios
    def post(self, id=None):
        """
        Solo el Admin de Sucursal puede crear nuevos horarios de reserva.
        """
        if id and "restaurar" in request.path:
            return FranjaService.restaurar_franja(id), 200

        try:
            data = request.get_json()
            # Validamos el formato de hora (HH:MM) y la vinculación al local
            errors = FranjaRequest().validate(data)
            if errors: return {"result": False, "message": errors}, 400
            return FranjaService.crear_franja(data), 201
        except Exception as e:
            HandleLogs.write_error(e)
            return {"result": False, "message": str(e)}, 500

    @valida_api_token  # Seguridad para modificar horarios existentes
    def put(self, id):
        """
        Actualización de horarios de apertura/cierre de reservas.
        """
        try:
            data = request.get_json()
            return FranjaService.actualizar_franja(id, data), 200
        except Exception as e:
            HandleLogs.write_error(e)
            return {"result": False, "message": str(e)}, 500

    @valida_api_token  # Seguridad para eliminar disponibilidad
    def delete(self, id):
        """
        Borrado lógico de la franja horaria.
        """
        try:
            return FranjaService.eliminar_franja(id), 200
        except Exception as e:
            HandleLogs.write_error(e)
            return {"result": False, "message": str(e)}, 500