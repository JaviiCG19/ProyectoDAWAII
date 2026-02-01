from flask import request
from flask_restful import Resource
from ..Services.local_service import LocalService
from ..Model.Request.local_request import LocalRequest
from ...utils.general.logs import HandleLogs
from ..Services.middleware import valida_api_token


class LocalComponent(Resource):

    @valida_api_token  # El backend ahora valora el token para listar locales
    def get(self, id=None):
        """
        CORRECCIÓN
        1. Si hay ID, buscamos la sucursal específica.
        2. Si no hay ID, listamos las sucursales PERO filtradas por 'idcia'.
        """
        try:
            if id:
                resultado = LocalService.obtener_local_por_id(id)
            else:
                # Recuperamos el idcia que viene del localStorage/Token del Gerente.
                id_cia = request.args.get('idcia')
                if not id_cia:
                    return {"result": False,
                            "message": "Seguridad: ID de compañía requerido para listar sucursales"}, 400

                resultado = LocalService.listar_por_empresa(id_cia)

            return resultado, 200 if resultado['result'] else 500
        except Exception as e:
            HandleLogs.write_error(e)
            return {"result": False, "message": str(e)}, 500

    @valida_api_token  # Seguridad para la creación o restauración de sucursales
    def post(self, id=None):
        # Restauración lógica para no perder historial
        if id and "restaurar" in request.path:
            return LocalService.restaurar_local(id), 200

        try:
            data = request.get_json()
            # Validamos que idcia, detalle y dirección vengan definidos.
            errors = LocalRequest().validate(data)
            if errors:
                return {"result": False, "message": errors}, 400

            resultado = LocalService.crear_local(data)
            return resultado, 201 if resultado['result'] else 500
        except Exception as e:
            HandleLogs.write_error(e)
            return {"result": False, "message": str(e)}, 500

    @valida_api_token  # Seguridad para el borrado lógico
    def delete(self, id):
        """
        Borrado lógico:
        Cambiamos estado a 0 para mantener integridad con las mesas vinculadas.
        """
        try:
            return LocalService.eliminar_local(id), 200
        except Exception as e:
            HandleLogs.write_error(e)
            return {"result": False, "message": str(e)}, 500